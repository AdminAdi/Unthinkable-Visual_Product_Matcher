# Python Backend for Visual Product Patcher
# Uses TensorFlow/Keras with MobileNetV2 for image similarity

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from tensorflow.keras.preprocessing import image
from sklearn.metrics.pairwise import cosine_similarity
import json
import requests
from io import BytesIO

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
PRODUCT_IMAGES_FOLDER = 'product-images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load pre-trained MobileNetV2 model
print("🔄 Loading MobileNetV2 model...")
model = MobileNetV2(weights='imagenet', include_top=False, pooling='avg')
print("✅ Model loaded successfully!")

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
        
        # Resize to 224x224 (MobileNetV2 input size)
        img = img.resize((224, 224))
        
        # Convert to array
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        return img_array
    except Exception as e:
        raise Exception(f"Error loading image: {str(e)}")

def extract_features(img_path_or_url):
    """Extract features from image using MobileNetV2"""
    img_array = load_and_preprocess_image(img_path_or_url)
    features = model.predict(img_array, verbose=0)
    # Flatten to 1D array
    features = features.flatten()
    # Normalize
    features = features / np.linalg.norm(features)
    return features

def compute_similarity(features1, features2):
    """Compute cosine similarity between two feature vectors"""
    similarity = cosine_similarity([features1], [features2])[0][0]
    return float(similarity * 100)  # Convert to percentage

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'Python ML server is running',
        'model': 'MobileNetV2'
    })

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify({
        'success': True,
        'count': len(products),
        'products': products
    })

@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = list(set([p['category'] for p in products]))
    return jsonify({
        'success': True,
        'categories': categories
    })

@app.route('/api/products/<product_id>/similar', methods=['GET'])
def get_similar_products(product_id):
    try:
        # Find the target product
        target_product = next((p for p in products if p['id'] == product_id), None)
        if not target_product:
            return jsonify({
                'success': False,
                'message': 'Product not found'
            }), 404

        print(f"🔍 Finding products similar to: {target_product['name']}")
        
        # Get or extract features for the target product
        if product_id not in product_features_cache:
            target_features = extract_features(target_product['image'])
            product_features_cache[product_id] = target_features
        else:
            target_features = product_features_cache[product_id]
        
        # Compute similarity with all other products
        results = []
        for product in products:
            if product['id'] == product_id:  # Skip the same product
                continue
                
            try:
                # Get or extract features for the current product
                current_id = product['id']
                if current_id not in product_features_cache:
                    product_features = extract_features(product['image'])
                    product_features_cache[current_id] = product_features
                else:
                    product_features = product_features_cache[current_id]
                
                # Compute similarity
                similarity = compute_similarity(target_features, product_features)
                
                results.append({
                    **product,
                    'similarity': round(similarity, 2)
                })
                
            except Exception as e:
                print(f"❌ Error processing product {product['id']}: {str(e)}")
                continue
        
        # Sort by similarity (highest first)
        results.sort(key=lambda x: x['similarity'], reverse=True)
        
        # Return top 20 similar products
        top_results = results[:20]
        
        print(f"✅ Found {len(top_results)} similar products for {target_product['name']}")
        
        return jsonify({
            'success': True,
            'count': len(top_results),
            'targetProduct': target_product,
            'results': top_results
        })
        
    except Exception as e:
        print(f"❌ Error finding similar products: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error finding similar products: {str(e)}'
        }), 500

@app.route('/api/search', methods=['POST'])
def search_similar_products():
    try:
        uploaded_image_path = None
        
        # Handle file upload
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(UPLOAD_FOLDER, f"{os.urandom(8).hex()}_{filename}")
                file.save(filepath)
                uploaded_image_path = filepath
        
        # Handle URL input
        elif request.json and 'imageUrl' in request.json:
            uploaded_image_path = request.json['imageUrl']
        
        else:
            return jsonify({
                'success': False,
                'message': 'No image file or URL provided'
            }), 400
        
        print(f"🔍 Processing image: {uploaded_image_path}")
        
        # Extract features from uploaded image
        uploaded_features = extract_features(uploaded_image_path)
        print(f"✅ Extracted features: {len(uploaded_features)} dimensions")
        
        # Compute similarity with all products
        results = []
        for product in products:
            try:
                product_id = product['id']
                
                # Check cache first
                if product_id not in product_features_cache:
                    product_img_path = product['image']
                    product_features = extract_features(product_img_path)
                    product_features_cache[product_id] = product_features
                else:
                    product_features = product_features_cache[product_id]
                
                # Compute similarity
                similarity = compute_similarity(uploaded_features, product_features)
                
                results.append({
                    **product,
                    'similarity': round(similarity, 2)
                })
                
            except Exception as e:
                print(f"❌ Error processing product {product['id']}: {str(e)}")
                continue
        
        # Sort by similarity (highest first)
        results.sort(key=lambda x: x['similarity'], reverse=True)
        
        # Return top 20
        top_results = results[:20]
        
        print(f"✅ Found {len(top_results)} similar products")
        if top_results:
            print(f"🎯 Top match: {top_results[0]['name']} ({top_results[0]['similarity']}%)")
        
        return jsonify({
            'success': True,
            'count': len(top_results),
            'uploadedImage': uploaded_image_path if not uploaded_image_path.startswith('http') else uploaded_image_path,
            'results': top_results
        })
        
    except Exception as e:
        print(f"❌ Search error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error processing image: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Visual Product Patcher - Python ML Backend")
    print("="*60)
    print(f"📊 Loaded {len(products)} products")
    print(f"🤖 Model: MobileNetV2 (ImageNet weights)")
    print(f"🌐 Server starting on http://localhost:5000")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
