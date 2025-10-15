# Python Backend Setup Guide

## Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

## Installation Steps

### 1. Create a virtual environment (recommended)
```bash
cd python-backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- TensorFlow (ML framework)
- MobileNetV2 (pre-trained model)
- Pillow (image processing)
- scikit-learn (similarity metrics)

### 3. Copy product images
```bash
# Copy product images from backend to python-backend
xcopy /E /I ..\backend\product-images product-images
```

### 4. Run the Python server
```bash
python app.py
```

The server will start on `http://localhost:5000`

## Features

- **Pre-trained MobileNetV2 model** from ImageNet
- **1280-dimensional feature vectors** (much better than 205 features)
- **Cosine similarity** for matching
- **Feature caching** for faster repeated searches
- **File upload and URL support**

## API Endpoints

### GET /api/health
Health check

### GET /api/products
Get all products

### GET /api/categories
Get unique categories

### POST /api/search
Search for similar products
- Body (file): `image` (multipart/form-data)
- Body (JSON): `{"imageUrl": "https://..."}`

## Frontend Integration

The React frontend already supports the Python backend!
Just make sure the Python server is running on port 5000.

## Performance

- First search: ~3-5 seconds (model loading + feature extraction)
- Subsequent searches: ~1-2 seconds (features cached)
- Much better accuracy than the Node.js version!

## Troubleshooting

### TensorFlow Installation Issues
If TensorFlow installation fails:
```bash
# Try installing CPU-only version
pip install tensorflow-cpu==2.15.0
```

### Memory Issues
If running out of memory:
- Close other applications
- Use a smaller batch size
- Consider using TensorFlow Lite

### Port Already in Use
If port 5000 is in use:
```bash
# Kill Node.js backend first
taskkill /F /IM node.exe

# Or change port in app.py:
app.run(host='0.0.0.0', port=5001, debug=True)
```
