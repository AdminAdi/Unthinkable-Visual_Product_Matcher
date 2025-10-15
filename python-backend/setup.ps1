# Python Backend Setup Script for Visual Product Patcher

Write-Host "🚀 Setting up Python Backend with TensorFlow MobileNetV2..." -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "1. Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   ✅ $pythonVersion found" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Python not found! Please install Python 3.8+ from https://www.python.org/downloads/" -ForegroundColor Red
    exit 1
}

# Create virtual environment
Write-Host ""
Write-Host "2. Creating virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "   Virtual environment already exists, skipping..." -ForegroundColor Blue
} else {
    python -m venv venv
    Write-Host "   Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment
Write-Host ""
Write-Host "3. Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
Write-Host "   ✅ Virtual environment activated" -ForegroundColor Green

# Upgrade pip
Write-Host ""
Write-Host "4. Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip --quiet
Write-Host "   ✅ Pip upgraded" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "5. Installing Python dependencies (this may take a few minutes)..." -ForegroundColor Yellow
Write-Host "   📦 Installing: Flask, TensorFlow, Pillow, NumPy, scikit-learn, requests, flask-cors" -ForegroundColor Cyan

pip install -r requirements.txt --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ All dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Some packages may have failed. Check the output above." -ForegroundColor Yellow
}

# Verify installations
Write-Host ""
Write-Host "6. Verifying critical packages..." -ForegroundColor Yellow
$packages = @("flask", "tensorflow", "PIL", "numpy", "sklearn")
$allInstalled = $true

foreach ($package in $packages) {
    try {
        python -c "import $package" 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ $package installed" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $package not found" -ForegroundColor Red
            $allInstalled = $false
        }
    } catch {
        Write-Host "   ❌ $package not found" -ForegroundColor Red
        $allInstalled = $false
    }
}

# Check product images
Write-Host ""
Write-Host "7. Checking product images..." -ForegroundColor Yellow
$imageCount = (Get-ChildItem -Path "product-images" -Recurse -File).Count
if ($imageCount -eq 55) {
    Write-Host "   ✅ All 55 product images found" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Expected 55 images, found $imageCount" -ForegroundColor Yellow
}

# Final summary
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

if ($allInstalled) {
    Write-Host "✅ Python backend is ready to run!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To start the server:" -ForegroundColor Cyan
    Write-Host "   python app.py" -ForegroundColor White
    Write-Host ""
    Write-Host "The server will run on: http://localhost:5000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "API Endpoints:" -ForegroundColor Cyan
    Write-Host "   GET  /api/health          - Health check" -ForegroundColor White
    Write-Host "   GET  /api/products        - Get all products" -ForegroundColor White
    Write-Host "   GET  /api/categories      - Get all categories" -ForegroundColor White
    Write-Host "   POST /api/search          - Search by image" -ForegroundColor White
    Write-Host "   GET  /api/category/:name  - Filter by category" -ForegroundColor White
} else {
    Write-Host "⚠️  Some packages failed to install. Please check errors above." -ForegroundColor Yellow
    Write-Host "   Try running: pip install -r requirements.txt" -ForegroundColor Cyan
}

Write-Host ""
