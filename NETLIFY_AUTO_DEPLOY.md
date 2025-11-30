# Netlify Auto-Deploy Setup Guide

This guide will help you set up **automatic deployment** so you never have to manually upload the `dist` folder again!

## 🎯 Problem
Currently, you have to:
1. Build the project (`npm run build`)
2. Delete the old `dist` folder from Netlify
3. Upload the new `dist` folder
4. Wait for a new link

## ✅ Solution: Continuous Deployment

With continuous deployment, whenever you push code changes to GitHub, Netlify will automatically:
- Build your project
- Deploy the new version
- Keep the same URL (no new links!)

---

## Method 1: GitHub + Netlify (RECOMMENDED)

### Step 1: Push Your Project to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a `.gitignore` file** to exclude unnecessary files:
   ```
   node_modules/
   dist/
   .DS_Store
   *.log
   ```

3. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name it (e.g., "choco-website")
   - Don't initialize with README (you already have files)
   - Click "Create repository"

4. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect Netlify to GitHub

1. **Log in to Netlify** (https://app.netlify.com)

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to Git provider**:
   - Choose "GitHub"
   - Authorize Netlify to access your repositories
   - Select your repository

4. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Click "Deploy site"

### Step 3: Done! 🎉

Now whenever you make changes:
```bash
git add .
git commit -m "Updated products"
git push
```

Netlify will automatically rebuild and deploy! Your URL stays the same.

---

## Method 2: Netlify CLI (Alternative)

If you don't want to use GitHub, you can use Netlify CLI:

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```

### Step 3: Link Your Site
```bash
netlify link
```
Select your existing site from the list.

### Step 4: Deploy
Instead of manually uploading, just run:
```bash
npm run build
netlify deploy --prod
```

You can create a script to make this easier:

**Add to `package.json`**:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "deploy": "vite build && netlify deploy --prod"
}
```

Now you can deploy with one command:
```bash
npm run deploy
```

---

## Method 3: Netlify Drop with Build Script

Create a simple script that builds and opens Netlify Drop:

**Add to `package.json`**:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "build:deploy": "vite build && echo Build complete! Now drag the dist folder to Netlify Drop"
}
```

Then run:
```bash
npm run build:deploy
```

This at least combines the build step with a reminder.

---

## 🏆 Best Practices

### 1. Environment Variables
If you have API keys or sensitive data, use Netlify environment variables:
- Go to Site settings → Environment variables
- Add your variables (e.g., `VITE_SHEETS_API_KEY`)
- Access them in your code: `import.meta.env.VITE_SHEETS_API_KEY`

### 2. Build Notifications
Enable build notifications in Netlify to get alerts when deployments succeed or fail.

### 3. Deploy Previews
With GitHub integration, you can create branches for testing:
```bash
git checkout -b test-new-feature
# Make changes
git push origin test-new-feature
```
Netlify will create a preview URL for testing before merging to main!

---

## 🚀 Recommended Workflow

**For Method 1 (GitHub + Netlify):**

1. Make changes to your code
2. Test locally: `npm run dev`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. Netlify automatically builds and deploys
5. Check your live site (same URL as before!)

**For Method 2 (Netlify CLI):**

1. Make changes to your code
2. Test locally: `npm run dev`
3. Deploy:
   ```bash
   npm run deploy
   ```

---

## 📝 Quick Reference

| Task | Command |
|------|---------|
| Start development | `npm run dev` |
| Build for production | `npm run build` |
| Deploy (CLI method) | `npm run deploy` |
| Push to GitHub | `git add . && git commit -m "message" && git push` |

---

## ❓ Troubleshooting

### Build fails on Netlify
- Check the build logs in Netlify dashboard
- Ensure `package.json` has correct build command
- Make sure all dependencies are in `package.json`, not just `devDependencies`

### Environment variables not working
- Prefix Vite env vars with `VITE_`
- Add them in Netlify dashboard, not in code
- Redeploy after adding env vars

### Old version still showing
- Clear browser cache (Ctrl + Shift + R)
- Check Netlify deploy log to confirm new version deployed
- Verify you pushed to the correct branch

---

## 🎯 Which Method Should You Choose?

- **Method 1 (GitHub + Netlify)**: Best for collaboration, version control, and professional workflow
- **Method 2 (Netlify CLI)**: Good if you want to keep code private or don't want to use GitHub
- **Method 3 (Manual with script)**: Only if you absolutely can't use the other methods

**I strongly recommend Method 1!** It's the industry standard and will save you the most time.
