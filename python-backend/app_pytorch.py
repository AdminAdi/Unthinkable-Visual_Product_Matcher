# Python Backend for Visual Product Patcher
# Uses PyTorch with ResNet50 for image similarity

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import numpy as np
from PIL import Image
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from sklearn.metrics.pairwise import cosine_similarity
import json
import requests
from io import BytesIO

app = Flask(__name__)
# Configure CORS to allow requests from frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "https://*.vercel.app", "https://*.netlify.app"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configuration
UPLOAD_FOLDER = 'uploads'
PRODUCT_IMAGES_FOLDER = 'product-images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load pre-trained ResNet50 model
print("🔄 Loading ResNet50 model...")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

model = models.resnet50(pretrained=True)
# Remove the final classification layer to get 2048-dim feature embeddings
model = torch.nn.Sequential(*list(model.children())[:-1])
model = model.to(device)
model.eval()
print("✅ Model loaded successfully!")

# Image preprocessing
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Cache for product features
product_features_cache = {}

# Load products database
with open('data/products.json', 'r') as f:
    products = json.load(f)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_and_preprocess_image(img_path_or_url):
    """Load image from file path or URL and preprocess for model"""
    try:
        if img_path_or_url.startswith('http://') or img_path_or_url.startswith('https://'):
            response = requests.get(img_path_or_url, timeout=10)
            img = Image.open(BytesIO(response.content))
        else:
            img = Image.open(img_path_or_url)
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        return img
    except Exception as e:
        print(f"Error loading image: {str(e)}")
        return None

def extract_features(img):
    """Extract 2048-dimensional feature vector using ResNet50"""
    try:
        img_tensor = preprocess(img)
        img_tensor = img_tensor.unsqueeze(0).to(device)
        
        with torch.no_grad():
            features = model(img_tensor)
        
        # Flatten to 1D array
        features = features.cpu().numpy().flatten()
        return features
    except Exception as e:
        print(f"Error extracting features: {str(e)}")
        return None

def get_product_features(product_id, image_path):
    """Get or compute features for a product image"""
    if product_id in product_features_cache:
        return product_features_cache[product_id]
    
    img = load_and_preprocess_image(image_path)
    if img is None:
        return None
    
    features = extract_features(img)
    if features is not None:
        product_features_cache[product_id] = features
    
    return features

def find_similar_products(uploaded_image_features, limit=20):
    """Find products similar to the uploaded image"""
    similarities = []
    
    for product in products:
        # Remove 'product-images/' prefix if it exists in the JSON
        image_path = product['image'].replace('product-images/', '')
        product_image_path = os.path.join(PRODUCT_IMAGES_FOLDER, image_path)
        product_features = get_product_features(product['id'], product_image_path)
        
        if product_features is None:
            continue
        
        # Calculate cosine similarity
        similarity = cosine_similarity(
            uploaded_image_features.reshape(1, -1),
            product_features.reshape(1, -1)
        )[0][0]
        
        # Convert to percentage
        similarity_percentage = float(similarity * 100)
        
        similarities.append({
            **product,
            'similarity': similarity_percentage
        })
    
    # Sort by similarity (highest first)
    similarities.sort(key=lambda x: x['similarity'], reverse=True)
    
    return similarities[:limit]

# API Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Python backend with PyTorch ResNet50 is running',
        'model': 'ResNet50',
        'device': str(device)
    })

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = list(set(product['category'] for product in products))
    return jsonify(categories)

@app.route('/api/category/<category>', methods=['GET'])
def filter_by_category(category):
    filtered = [p for p in products if p['category'].lower() == category.lower()]
    return jsonify(filtered)

@app.route('/api/search', methods=['POST'])
def search_by_image():
    try:
        uploaded_image = None
        
        # Handle file upload
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                file.save(filepath)
                uploaded_image = load_and_preprocess_image(filepath)
        
        # Handle URL input (JSON body)
        elif request.is_json and 'imageUrl' in request.json:
            image_url = request.json['imageUrl']
            uploaded_image = load_and_preprocess_image(image_url)
        
        # Handle URL input (Form data)
        elif 'imageUrl' in request.form:
            image_url = request.form['imageUrl']
            uploaded_image = load_and_preprocess_image(image_url)
        
        if uploaded_image is None:
            return jsonify({'error': 'No valid image provided'}), 400
        
        # Extract features from uploaded image
        uploaded_features = extract_features(uploaded_image)
        if uploaded_features is None:
            return jsonify({'error': 'Failed to process image'}), 500
        
        # Find similar products
        similar_products = find_similar_products(uploaded_features)
        
        return jsonify({
            'success': True,
            'results': similar_products,
            'count': len(similar_products)
        })
        
    except Exception as e:
        print(f"Error in search: {str(e)}")
        return jsonify({'success': False, 'error': str(e), 'message': str(e)}), 500

@app.route('/product-images/<path:filename>')
def serve_product_image(filename):
    return send_from_directory(PRODUCT_IMAGES_FOLDER, filename)

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Visual Product Patcher - Python Backend")
    print("="*60)
    print(f"✅ Loaded {len(products)} products")
    print(f"✅ Model: ResNet50 (2048-dimensional features)")
    print(f"✅ Device: {device}")
    print(f"📡 Server running on http://localhost:5000")
    print("="*60 + "\n")
    
    # Get port from environment variable for deployment
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
