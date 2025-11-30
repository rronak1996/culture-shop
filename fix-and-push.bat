@echo off
echo Fixing Git setup and pushing to GitHub...
echo.

REM Add all files
echo [1/3] Adding all files to Git...
git add .

REM Create the first commit
echo [2/3] Creating initial commit...
git commit -m "Initial commit - Choco e-commerce website"

REM Push to GitHub
echo [3/3] Pushing to GitHub...
git push -u origin main

echo.
echo ============================================
echo Done! Your code is now on GitHub!
echo ============================================
echo.
echo Next: Set up Netlify auto-deploy
echo 1. Go to https://app.netlify.com
echo 2. Click "Add new site" -^> "Import an existing project"
echo 3. Choose "GitHub"
echo 4. Select "culture-choco" repository
echo 5. Build command: npm run build
echo 6. Publish directory: dist
echo 7. Click "Deploy site"
echo.
echo After that, whenever you push to GitHub, Netlify will auto-deploy!
echo.
pause
