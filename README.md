# 🔍 Visual Product Patcher

An intelligent product search application powered by deep learning. Upload a product image or provide an image URL to find visually similar products from a database of 55 items across 6 categories.

![Python](https://img.shields.io/badge/Python-3.13-blue)
![PyTorch](https://img.shields.io/badge/PyTorch-2.8-red)
![React](https://img.shields.io/badge/React-18.2-61DAFB)
![Flask](https://img.shields.io/badge/Flask-3.0-000000)

## ✨ Features

- **🤖 AI-Powered Search**: PyTorch ResNet50 model with ImageNet pre-trained weights
- **📊 2048-Dimensional Features**: Deep learning embeddings for accurate matching
- **📤 Dual Upload Methods**: Upload image files or provide image URLs
- **🎯 Smart Filtering**: Filter by category and similarity threshold
- **📈 Sorting Options**: Sort results by similarity or price
- **📱 Responsive Design**: Mobile-friendly interface with modern UI
- **👀 Real-time Preview**: See your uploaded image alongside results
- **🏪 55 Products**: Electronics, Clothing, Footwear, Home & Kitchen, Sports, Accessories

## 🏗️ Architecture

### Backend (Python + Flask + PyTorch)
- **Framework**: Flask 3.0 with CORS support
- **ML Model**: ResNet50 pre-trained on ImageNet (1.2M images, 1000 categories)
- **Feature Extraction**: 2048-dimensional embeddings from final convolutional layer
- **Similarity Metric**: Cosine similarity for comparing feature vectors
- **Feature Caching**: Product features cached in memory for fast search
- **Image Processing**: PIL for loading, torchvision for preprocessing

### Frontend (React)
- **Framework**: React 18.2 with Hooks
- **HTTP Client**: Axios for API calls
- **Styling**: Modern CSS3 with gradients and animations
- **File Upload**: Native file input with drag-and-drop support
- **URL Input**: Support for direct image URLs
- **Responsive**: Mobile-first design with flexbox/grid layout

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (tested with Python 3.13)
- Node.js 14+ and npm
- 2GB+ RAM (for ResNet50 model)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Visual Product Patcher"
```

### 2. Start Python Backend
```bash
cd python-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
python app_pytorch.py
```

Backend will start on: **http://localhost:5000**

### 3. Start React Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will open at: **http://localhost:3000**

## 🎮 Usage

1. **Open the Application**: Navigate to http://localhost:3000
2. **Upload Image**: 
   - Click "Choose File" to upload from your computer, OR
   - Switch to "Image URL" tab and paste an image URL
3. **Search**: Click "Search Similar Products"
4. **View Results**: See top 20 similar products with similarity scores
5. **Filter & Sort**:
   - Filter by category (Electronics, Clothing, etc.)
   - Adjust minimum similarity threshold
   - Sort by similarity or price

## 📁 Project Structure

```
Visual Product Patcher/
├── python-backend/          # Flask backend with PyTorch
│   ├── app_pytorch.py      # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── data/
│   │   └── products.json   # 55 products database
│   ├── product-images/     # Product image files
│   │   ├── electronics/
│   │   ├── clothing/
│   │   ├── footwear/
│   │   ├── home/
│   │   ├── sports/
│   │   └── accessories/
│   └── uploads/            # Temporary uploads
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.js         # Main app component
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── ImageUpload.js
│   │   │   └── ProductResults.js
│   │   └── index.js
│   ├── public/
│   └── package.json
│
├── start-python-backend.bat   # Windows startup script
├── start-python-backend.ps1   # PowerShell startup script
└── README.md
```

## 🔧 API Endpoints

### Python Backend (Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | Get all 55 products |
| GET | `/api/categories` | Get all categories |
| GET | `/api/category/<name>` | Filter by category |
| POST | `/api/search` | Image similarity search |
| GET | `/product-images/<path>` | Serve product images |

### Search API Example

**Request:**
```http
POST /api/search
Content-Type: multipart/form-data

image: <file>
```
OR
```http
POST /api/search
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "results": [
    {
      "id": 1,
      "name": "Nike Air Max 90",
      "category": "Footwear",
      "subcategory": "Sneakers",
      "price": 130,
      "similarity": 85.42,
      "image": "product-images/footwear/nike-air-max-90.jpg",
      "description": "Classic running shoes"
    }
  ]
}
```

## 🤖 Machine Learning Details

### Model: ResNet50
- **Architecture**: 50-layer Residual Network
- **Pre-training**: ImageNet (1.2M images, 1000 classes)
- **Feature Layer**: Global average pooling before final FC layer
- **Output**: 2048-dimensional feature vector
- **Framework**: PyTorch 2.8.0

### Feature Extraction Process
1. Load image and convert to RGB
2. Resize to 256x256, center crop to 224x224
3. Normalize with ImageNet mean/std
4. Forward pass through ResNet50 (without final FC layer)
5. Extract 2048-dim feature vector
6. Compute cosine similarity with cached product features
7. Return top 20 matches sorted by similarity

### Similarity Calculation
```python
similarity = cosine_similarity(
    uploaded_features.reshape(1, -1),
    product_features.reshape(1, -1)
)[0][0] * 100  # Convert to percentage
```

## 📦 Dependencies

### Python Backend
```
flask==3.0.0
flask-cors==4.0.0
torch==2.8.0
torchvision==0.23.0
pillow>=10.4.0
numpy
scikit-learn
requests
werkzeug==3.0.1
```

### React Frontend
```
react: ^18.2.0
react-dom: ^18.2.0
axios: ^1.5.0
react-scripts: 5.0.1
```

## 🎨 Screenshots

### Main Interface
- Dual upload interface (File + URL)
- Real-time image preview
- Category filters and sorting

### Search Results
- Grid layout with product cards
- Similarity scores with color coding
- Category badges
- Price information

## ⚡ Performance

- **First Search**: 5-10 seconds (loads ResNet50 + extracts all product features)
- **Subsequent Searches**: 1-2 seconds (features cached)
- **Memory Usage**: ~1.5GB (model + features)
- **Model Size**: ~100MB (ResNet50 weights)

## 🚀 Deployment

### Backend Deployment Options
- **Heroku**: Use `Procfile` with gunicorn
- **Render**: Python environment with GPU support
- **Railway**: Docker deployment
- **AWS EC2**: Ubuntu instance with PyTorch

### Frontend Deployment Options
- **Vercel**: Automatic React deployment
- **Netlify**: Static site hosting
- **GitHub Pages**: Build and deploy
- **AWS S3 + CloudFront**: Static hosting

### Environment Variables
```bash
# Backend
FLASK_ENV=production
PORT=5000

# Frontend
REACT_APP_API_URL=https://your-backend-url.com
```

## 🔍 Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Linux/macOS
lsof -ti:5000 | xargs kill -9
```

**Model download slow:**
- First run downloads ResNet50 weights (~100MB)
- Be patient, it only happens once

**Out of memory:**
- Reduce batch size or use CPU instead of GPU
- Close other applications

### Frontend Issues

**Cannot connect to backend:**
- Ensure backend is running on port 5000
- Check proxy setting in `frontend/package.json`

**CORS errors:**
- Backend has CORS enabled by default
- Check Flask-CORS configuration

## 📝 TODO / Future Improvements

- [ ] Add real product images (currently using placeholders)
- [ ] Implement user authentication
- [ ] Add product upload functionality
- [ ] Use GPU acceleration for faster inference
- [ ] Implement vector database (FAISS) for scalability
- [ ] Add more categories and products
- [ ] Implement advanced filters (price range, brand)
- [ ] Add product details modal
- [ ] Implement shopping cart functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👥 Authors

- Your Name - Animesh Kumar

## 🙏 Acknowledgments

- PyTorch team for the excellent deep learning framework
- ResNet50 architecture from "Deep Residual Learning for Image Recognition"
- ImageNet dataset for pre-trained weights
- React team for the amazing frontend framework
- Lorem Picsum for placeholder images

---

**Note**: The current product images are placeholders. For production use, replace them with actual product images for better matching accuracy.

**Built with ❤️ using Python, PyTorch, Flask, and React**
#   U n t h i n k a b l e - V i s u a l _ P r o d u c t _ M a t c h e r  
 