# Quick GitHub Setup (5 Minutes!)

## Step 1: Run the Setup Script (30 seconds)

Just double-click this file: **`setup-git.bat`**

Or open terminal and run:
```bash
.\setup-git.bat
```

This will:
- Add all your files to Git
- Create the initial commit

## Step 2: Create GitHub Repository (2 minutes)

1. Go to **https://github.com/new**
2. Repository name: `choco-website` (or any name you like)
3. Keep it **Public** or **Private** (your choice)
4. **DO NOT** check "Initialize with README"
5. Click **"Create repository"**

## Step 3: Push to GitHub (1 minute)

GitHub will show you commands. Copy the section "push an existing repository" which looks like:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

Run these commands in your terminal (in the choco folder).

## Step 4: Connect Netlify (2 minutes)

1. Go to **https://app.netlify.com**
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"GitHub"**
4. Select your repository (`choco-website`)
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**

## Done! 🎉

Now whenever you make changes:

```bash
git add .
git commit -m "Updated products"
git push
```

Netlify will automatically rebuild and deploy! Same URL every time!

---

## Alternative: Use Netlify CLI (Simpler but manual)

If you don't want to use GitHub, install Netlify CLI:

```bash
npm install -g netlify-cli
netlify login
netlify link
```

Then deploy with one command:
```bash
netlify deploy --prod
```

Add this to `package.json` scripts:
```json
"deploy": "vite build && netlify deploy --prod"
```

Then just run: `npm run deploy`
