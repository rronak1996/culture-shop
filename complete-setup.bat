@echo off
echo ============================================
echo Complete Git + GitHub Setup
echo ============================================
echo.

REM Step 0: Configure Git user
echo [0/6] Configuring Git user...
git config --global user.name "rronak1996"
git config --global user.email "rronak1996@users.noreply.github.com"
echo Git user configured!

REM Step 1: Initialize Git
echo [1/6] Initializing Git repository...
git init
if errorlevel 1 (
    echo ERROR: Git initialization failed!
    pause
    exit /b 1
)

REM Step 2: Add all files
echo [2/6] Adding all files...
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files!
    pause
    exit /b 1
)

REM Step 3: Create first commit
echo [3/6] Creating initial commit...
git commit -m "Initial commit - Choco e-commerce website"
if errorlevel 1 (
    echo ERROR: Failed to create commit!
    pause
    exit /b 1
)

REM Step 4: Add remote (if not already added)
echo [4/6] Adding GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/rronak1996/culture-choco.git

REM Step 5: Set main branch
echo [5/6] Setting main branch...
git branch -M main

REM Step 6: Push to GitHub
echo [6/6] Pushing to GitHub...
git push -u origin main

echo.
echo ============================================
echo SUCCESS! Your code is now on GitHub!
echo ============================================
echo.
echo Repository: https://github.com/rronak1996/culture-choco
echo.
echo Next Steps - Set up Netlify Auto-Deploy:
echo 1. Go to https://app.netlify.com
echo 2. Click "Add new site" -^> "Import an existing project"
echo 3. Choose "GitHub" and select "culture-choco"
echo 4. Build command: npm run build
echo 5. Publish directory: dist
echo 6. Click "Deploy site"
echo.
echo After setup, update your site anytime with:
echo    git add .
echo    git commit -m "Your update message"
echo    git push
echo.
echo Netlify will automatically rebuild and deploy!
echo No more manual dist folder uploads!
echo.
pause
