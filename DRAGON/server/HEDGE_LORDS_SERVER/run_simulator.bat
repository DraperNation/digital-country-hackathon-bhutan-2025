@echo on
setlocal
echo Running Simulator Service Batch Script...

REM Get the directory where this batch script is located
set SCRIPT_DIR=%~dp0

REM Define paths relative to the script directory
set VENV_ACTIVATE=%SCRIPT_DIR%.venv_pc_service\Scripts\activate.bat
set PYTHON_SCRIPT=%SCRIPT_DIR%services\simulator\service.py

REM Check if activation script exists
IF NOT EXIST "%VENV_ACTIVATE%" (
    echo ERROR: Virtual environment activation script not found at %VENV_ACTIVATE%
    exit /b 1
)

REM Check if python script exists
IF NOT EXIST "%PYTHON_SCRIPT%" (
    echo ERROR: Python script not found at %PYTHON_SCRIPT%
    exit /b 1
)

echo [+] Activating virtual environment...
CALL "%VENV_ACTIVATE%"
IF ERRORLEVEL 1 (
    echo ERROR: Failed to activate virtual environment.
    exit /b 1
)
echo [+] Virtual environment activated.

echo [+] Running Python script: %PYTHON_SCRIPT%
REM Ensure we use the python from the activated venv's PATH
python "%PYTHON_SCRIPT%"
set SCRIPT_ERRORLEVEL=%ERRORLEVEL%

echo [+] Python script finished with exit code: %SCRIPT_ERRORLEVEL%

REM Deactivation happens automatically with endlocal or when script ends normally
REM CALL deactivate

endlocal
echo [+] Batch script finished.
exit /b %SCRIPT_ERRORLEVEL%