@echo off
echo ========================================
echo Python Backend Setup
echo ========================================
echo.

echo 1. Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python 3.8+
    pause
    exit /b 1
)
echo.

echo 2. Creating virtual environment...
if exist venv (
    echo Virtual environment already exists, skipping...
) else (
    python -m venv venv
    echo Virtual environment created
)
echo.

echo 3. Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo 4. Upgrading pip...
python -m pip install --upgrade pip
echo.

echo 5. Installing Python dependencies...
echo This may take a few minutes...
pip install -r requirements.txt
echo.

echo 6. Checking product images...
dir /s /b product-images\*.jpg > temp_count.txt
for /f %%C in ('find /c /v "" ^< temp_count.txt') do set count=%%C
del temp_count.txt
echo Found %count% product images
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the server, run: start.bat
echo Or manually: python app.py
echo.
pause
