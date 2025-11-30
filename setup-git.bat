@echo off
echo Setting up Git repository...

REM Initialize Git (already done)
git init

REM Add all files
echo Adding files to Git...
git add .

REM Create first commit
echo Creating initial commit...
git commit -m "Initial commit - Choco e-commerce website"

echo.
echo ============================================
echo Git repository is ready!
echo ============================================
echo.
echo Next steps:
echo 1. Go to https://github.com/new
echo 2. Create a new repository (name it "choco-website" or anything you like)
echo 3. DO NOT initialize with README
echo 4. Copy the commands GitHub shows you
echo.
echo OR just run these commands (replace YOUR_USERNAME and YOUR_REPO):
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
echo    git branch -M main
echo    git push -u origin main
echo.
pause
