# How to Publish Your Website for Free (Netlify)

Great news! Your website is built and ready to publish.

The easiest way to publish for free is using **Netlify Drop**.

## Step 1: Locate Your Build Folder
I have already built your project. The files are in a folder named `dist` inside your project folder:
`c:\Users\JAY SWAMINARAYAN\.gemini\antigravity\scratch\choco\dist`

## Step 2: Publish to Netlify (Drag & Drop)

1.  Open your browser and go to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2.  Open your file explorer to your project folder:
    `c:\Users\JAY SWAMINARAYAN\.gemini\antigravity\scratch\choco`
3.  Find the folder named **`dist`**.
4.  **Drag and drop** the `dist` folder onto the Netlify page where it says "Drag and drop your site output folder here".

## Step 3: That's it!
*   Netlify will upload your site in a few seconds.
*   It will give you a **random URL** (like `brave-curie-12345.netlify.app`).
*   Click that link to see your live website!

## Important Note for Google Sheets
Once you have your live Netlify URL:
1.  Go to your **Google Apps Script**.
2.  (Optional) You might want to restrict access, but since we set it to "Anyone", it will work fine with your new site too.
3.  Your order tracking will work on the live site just like it did locally!

## How to Shut Down Temporarily

If you want to take your website offline (e.g., you are out of stock or on vacation):

1.  **Log in** to your Netlify dashboard.
2.  Click on your site.
3.  Go to **Site Settings**.
4.  Scroll to the bottom ("Danger Zone").
5.  Click **Delete this site**.

**To Turn It Back On:**
Just follow the "Publish" steps above again! Drag and drop your `dist` folder, and you are back online instantly.

## How to Enable Maintenance Mode

If you want to keep the site online but show a "Under Maintenance" message with your contact number:

1.  Open `main.js` in your code editor.
2.  Find line 10: `const MAINTENANCE_MODE = false;`
3.  Change it to: `const MAINTENANCE_MODE = true;`
4.  Save the file.
5.  Run `npm run build` in the terminal.
6.  Deploy the new `dist` folder to Netlify.

Your customers will see a beautiful maintenance screen with your contact number! To disable it, just change it back to `false` and re-deploy.
