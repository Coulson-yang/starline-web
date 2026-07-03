@echo off
setlocal

cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo The local Python environment was not found.
  echo Please run setup once before using this launcher.
  pause
  exit /b 1
)

if not exist ".env" (
  echo The .env file was not found.
  echo Please create .env and add your DeepSeek API key first.
  pause
  exit /b 1
)

start "" cmd /c "timeout /t 3 /nobreak >nul && start "" http://localhost:8501"

".venv\Scripts\python.exe" -m streamlit run app.py --server.address 127.0.0.1 --server.port 8501

pause
