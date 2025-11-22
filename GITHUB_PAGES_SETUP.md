# GitHub Pages Setup Instructions

Your portfolio code is now on GitHub! Follow these steps to enable GitHub Pages deployment.

## Step-by-Step Setup

### 1. Go to Repository Settings

1. Open: https://github.com/Sh-dott/portfolio-ShaiKahlon
2. Click the **Settings** tab (gear icon)
3. In the left sidebar, click **Pages**

### 2. Configure GitHub Pages

In the **Pages** section:

**Build and deployment:**
- **Source:** Select "Deploy from a branch"
- **Branch:** Select `main` 
- **Folder:** Select `/ (root)` for now (we'll test with root first)
- Click **Save**

### 3. Wait for Deployment

GitHub will start building your site automatically. You'll see:
- "GitHub Pages is being built from the main branch"
- After 1-2 minutes: "Your site is live at https://Sh-dott.github.io/portfolio-ShaiKahlon"

### Step 4: Test Your Site

Visit: https://Sh-dott.github.io/portfolio-ShaiKahlon

Check that everything works:
- [ ] Page loads
- [ ] Hero section displays
- [ ] Avatar image shows
- [ ] Navigation works
- [ ] Form validates
- [ ] Email link works
- [ ] Mobile looks good

## Important Note About Folder Structure

GitHub Pages serves files from the root of your branch by default.

**Your current structure:**
```
portfolio-ShaiKahlon/
├── src/
│   ├── index.html
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
├── package.json
└── docs/
```

**For GitHub Pages to work correctly with `/src` folder:**

Option A: Deploy from `/(root)` then access via `/src/` subfolder
- URL: https://Sh-dott.github.io/portfolio-ShaiKahlon/src/

Option B: Move files to root (recommended for cleaner URL)
- This would make your URL: https://Sh-dott.github.io/portfolio-ShaiKahlon/

## Recommended: Setup with Root Deploy

For the cleanest URL, you could restructure to:
```
portfolio-ShaiKahlon/
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── images/avatar.jpg
└── docs/ (optional - documentation)
```

Then GitHub Pages deploys from root automatically.

## Your Live Portfolio URLs

**Current structure (with /src):**
https://Sh-dott.github.io/portfolio-ShaiKahlon/src/

**After restructuring (recommended):**
https://Sh-dott.github.io/portfolio-ShaiKahlon/

## Next Steps

1. Visit your GitHub repository settings page
2. Enable GitHub Pages
3. Test the live URL
4. Share with potential employers!

---

**Your portfolio is now live on the internet!** 🚀
