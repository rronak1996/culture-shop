# Deployment Guide for GitHub Pages

This project is configured to deploy to GitHub Pages using the `gh-pages` package.

## Prerequisites

1.  **Git**: Ensure Git is installed and initialized in your project.
2.  **Node.js**: Ensure Node.js and npm are installed.
3.  **Remote Repository**: Your local git repository must be connected to a GitHub repository.

## One-Step Deployment

We have configured a `deploy` script in `package.json` that handles building and deploying.

Run the following command in your terminal:

```bash
npm run deploy
```

### What this does:
1.  **Builds** the project (`npm run build`).
2.  **Uploads** the `dist` folder to the `gh-pages` branch of your GitHub repository.

## Manual Steps (if you want to do it manually)

If you prefer to run the steps individually:

1.  **Build the project**:
    ```bash
    npm run build
    ```

2.  **Deploy the build folder**:
    ```bash
    npx gh-pages -d dist
    ```

## Troubleshooting

-   **"Repo not found"**: Make sure you have added a remote origin:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    ```
-   **Permissions**: Ensure you are logged in to git and have write access to the repository.
