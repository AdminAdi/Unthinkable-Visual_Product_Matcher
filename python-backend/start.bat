@echo off
echo ========================================
echo Starting Python Backend Server
echo ========================================
echo.

if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo Starting Flask server with TensorFlow MobileNetV2...
echo Server URL: http://localhost:5000
echo Press Ctrl+C to stop
echo.

python app.py
