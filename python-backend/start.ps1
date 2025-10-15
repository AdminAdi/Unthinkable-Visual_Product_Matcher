# Quick start script for Python backend

Write-Host "🚀 Starting Python Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "❌ Virtual environment not found!" -ForegroundColor Red
    Write-Host "   Please run setup.ps1 first:" -ForegroundColor Yellow
    Write-Host "   .\setup.ps1" -ForegroundColor White
    exit 1
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Start the server
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "Starting Flask Server with TensorFlow MobileNetV2" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "Server URL: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python app.py
