# 🖼️ Visual Product Matcher

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-red.svg)](https://pytorch.org)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://reactjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An intelligent visual search engine that helps users find similar products using deep learning and computer vision. Built with PyTorch, Flask, and React.

## 🌟 Features

- **AI-Powered Search**: Find visually similar products using deep learning
- **Multiple Input Methods**: Upload images or paste image URLs
- **Smart Filtering**: Filter by category and similarity threshold
- **Responsive UI**: Works on desktop and mobile devices
- **Real-time Results**: Get instant visual matches
- **Scalable Architecture**: Ready for production deployment

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- pip (Python package manager)
- npm (Node.js package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdminAdi/Unthinkable-Visual_Product_Matcher.git
   cd Unthinkable-Visual_Product_Matcher
   ```

2. **Set up Python backend**
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   # source venv/bin/activate

   # Install dependencies
   cd python-backend
   pip install -r requirements.txt
   ```

3. **Set up React frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd python-backend
   python app_pytorch.py
   ```

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask 3.0
- **Machine Learning**: PyTorch, ResNet50
- **Image Processing**: Pillow, torchvision
- **API**: RESTful endpoints with CORS support

### Frontend
- **Framework**: React 18.2
- **State Management**: React Hooks
- **Styling**: CSS3, Flexbox, Grid
- **HTTP Client**: Axios

## 📂 Project Structure

```
Unthinkable-Visual_Product_Matcher/
├── python-backend/          # Flask backend
│   ├── app_pytorch.py      # Main application
│   ├── requirements.txt    # Python dependencies
│   ├── data/              # Product data
│   └── product-images/    # Product images
│
├── frontend/              # React frontend
│   ├── public/           # Static files
│   └── src/              # Source code
│
├── .gitignore            # Git ignore file
└── README.md             # This file
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/health` | Health check |
| `POST` | `/api/search` | Process image and find matches |
| `GET`  | `/api/products` | List all products |
| `GET`  | `/api/categories` | Get all categories |

## 🤖 Machine Learning

### Model Architecture
- **Base Model**: ResNet50 (pre-trained on ImageNet)
- **Feature Extraction**: 2048-dimensional embeddings
- **Similarity Metric**: Cosine similarity
- **Inference Time**: ~1-2s after initial load

## 🚀 Deployment

### Backend (Python/Flask)
```bash
# Production server with Gunicorn
pip install gunicorn
gunicorn --workers 4 --bind 0.0.0.0:5000 app_pytorch:app
```

### Frontend (React)
```bash
# Production build
npm run build

# Serve static files
serve -s build
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Animesh Kumar**

## 🙏 Acknowledgments

- PyTorch team for the amazing deep learning framework
- React team for the frontend library
- All contributors who helped improve this project

---

<div align="center">
  Made with ❤️ by Animesh Kumar
</div>
