# Deployment Guide - Render.com

Your portfolio is ready to deploy to Render! This guide walks you through the process.

## Prerequisites

✅ Render account (you already have one)
✅ GitHub repository with your project
✅ All project files ready

## Step-by-Step Deployment to Render

### Step 1: Push Your Code to GitHub

First, make sure your portfolio is in a GitHub repository.

```bash
# Navigate to your project directory
cd C:/Users/Shai/web-projects/portfolio-refactored

# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Portfolio: Complete setup ready for deployment"

# Add remote (replace with your actual GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/portfolio-refactored.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Log In to Render

1. Go to https://render.com
2. Sign in with your account
3. Click **New +** button in top right
4. Select **Static Site**

### Step 3: Connect GitHub Repository

1. Click **Connect Repository**
2. Select the `portfolio-refactored` repository
3. Click **Connect**

### Step 4: Configure Build Settings

Fill in the deployment settings:

| Field | Value |
|-------|-------|
| **Name** | portfolio-shai (or your preferred name) |
| **Root Directory** | `src` |
| **Build Command** | (leave empty - it's a static site) |
| **Publish Directory** | `.` (current directory, since we're using src as root) |
| **Environment** | (can leave as default) |

### Step 5: Deploy

1. Click **Create Static Site**
2. Render will automatically build and deploy your site
3. You'll see a build log showing the process
4. Once complete, you'll get a live URL like: `https://portfolio-shai.onrender.com`

### Step 6: Custom Domain (Optional)

To use your own domain:

1. In Render dashboard, go to your site
2. Click **Settings**
3. Scroll to **Custom Domains**
4. Add your domain
5. Follow DNS configuration instructions

## Important Notes

### About Your Avatar Image

Your avatar image at `assets/images/avatar.jpg` will be deployed with your site. Make sure:

✅ The file exists in the correct location: `src/assets/images/avatar.jpg`
✅ The path in HTML is relative: `assets/images/avatar.jpg`
✅ Image is optimized for web (reasonable file size)

### Environment Variables (if needed)

Your site doesn't use environment variables currently. If you add backend features later, you can add them through:
1. Render Dashboard → Your Site → Environment
2. Add environment variables there

### Automatic Deployments

Once connected to GitHub:
- **Any push to main branch** automatically redeploys your site
- No manual deployment needed
- Build logs available in Render dashboard

## Testing Before Deployment

Test your site locally first:

```bash
# Option 1: Using Python
python -m http.server 8000 --directory src

# Option 2: Using npm (if installed)
npm start

# Visit http://localhost:8000 in your browser
```

## Post-Deployment Checklist

After deployment, verify:

- [ ] Site loads at your Render URL
- [ ] All pages visible
- [ ] Navigation works
- [ ] Avatar image displays
- [ ] Contact form loads (validation should work)
- [ ] Links work correctly
- [ ] Mobile responsive view works
- [ ] Performance acceptable

## Troubleshooting

### Site Shows 404 Error

**Solution:** Ensure "Root Directory" in Render is set to `src`

### Image Not Loading

**Check:**
1. Avatar file exists at `src/assets/images/avatar.jpg`
2. Path in HTML is correct: `assets/images/avatar.jpg` (relative path)
3. File permissions allow reading

### Form Not Working

**Note:** Contact form uses mailto: links
- Works locally and in production
- Opens user's email client
- No backend required

### Slow Load Time

**Solutions:**
- Compress images
- Minimize CSS/JS
- Use CDN for external resources (already using Google Fonts and Font Awesome CDN)

## File Structure for Render

```
portfolio-refactored/
├── src/                          ← Set as Root Directory
│   ├── index.html
│   ├── assets/
│   │   ├── css/styles.css
│   │   ├── js/main.js
│   │   └── images/
│   │       └── avatar.jpg
├── package.json
├── .gitignore
└── Documentation files...
```

## Support & Documentation

- **Render Docs:** https://render.com/docs
- **Static Site Docs:** https://render.com/docs/static-sites
- **GitHub Connection:** https://render.com/docs/github

## Success!

Once deployed, your portfolio will be live and automatically update with every GitHub push! 🚀

Visit your live site at: `https://YOUR-SITE-NAME.onrender.com`

Share this URL with potential employers and clients!
