@echo off
echo ========================================
echo  Deploying with Image Fix
echo ========================================
echo.

echo Step 1: Copying assets to public folder...
xcopy /E /I /Y assets public\assets
if errorlevel 1 (
    echo ERROR: Failed to copy assets
    pause
    exit /b 1
)
echo Assets copied successfully!
echo.

echo Step 2: Adding files...
git add -A
echo.

echo Step 3: Committing changes...
git commit -m "Fix: Copy all product images to public folder for deployment"
if errorlevel 1 (
    echo Note: Nothing new to commit
)
echo.

echo Step 4: Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo Note: Already up to date or push failed
)
echo.

echo Step 5: Building project...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo Build successful!
echo.

echo Step 6: Deploying to GitHub Pages...
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
echo Product images have been copied and deployed!
echo Your website will be live at:
echo https://culturechocolates.online
echo.
echo Wait 2-3 minutes for changes to appear.
echo Then clear your browser cache (Ctrl+Shift+R)
echo.
pause
