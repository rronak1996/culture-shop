@echo off
echo ========================================
echo  Deploying Culture Chocolates Website
echo ========================================
echo.

echo Step 1: Adding files...
git add -A
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo Step 2: Committing changes...
git commit -m "Fix: Product images now visible - support all image URLs"
if errorlevel 1 (
    echo Note: Nothing to commit or already committed
)

echo Step 3: Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo ERROR: Failed to push to GitHub
    pause
    exit /b 1
)

echo Step 4: Building project...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo Step 5: Deploying to GitHub Pages...
call npm run deploy
if errorlevel 1 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo  DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your website will be live at:
echo https://culturechocolates.online
echo.
echo Wait 2-3 minutes for changes to appear.
echo.
pause
