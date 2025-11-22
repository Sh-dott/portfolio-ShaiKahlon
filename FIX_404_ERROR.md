# Fix GitHub Pages 404 Error

The 404 error means GitHub Pages isn't correctly serving your site. Here's how to fix it:

## Quick Fix Steps

### 1. Go to Repository Settings
Visit: https://github.com/Sh-dott/portfolio-ShaiKahlon/settings/pages

### 2. Check Current Settings
Look at the "Build and deployment" section. 

**You should see:**
- Source: `Deploy from a branch`
- Branch: `main` 
- Folder: `/ (root)`

### 3. If Settings Are Wrong
- Change Source to: `Deploy from a branch`
- Change Branch to: `main`
- Change Folder to: `/ (root)`
- Click **Save**

### 4. Wait for Rebuild
GitHub will rebuild automatically. Takes 1-2 minutes.

### 5. Check Your URL
Try: https://Sh-dott.github.io/portfolio-ShaiKahlon/

## If Still Getting 404

### Clear GitHub Cache
1. Go to: https://github.com/Sh-dott/portfolio-ShaiKahlon/settings/pages
2. Change Source to: "GitHub Actions"
3. Wait a moment
4. Change back to: "Deploy from a branch"
5. Select main / (root)
6. Click Save

### Check File Structure
Files should be at the root of the repository:
- ✅ `index.html` (at root)
- ✅ `assets/css/styles.css`
- ✅ `assets/js/main.js`
- ✅ `assets/images/avatar.jpg`

NOT in `/src/` folder anymore

## Verify Files Are on GitHub

Visit these URLs directly to verify files exist:
- Main: https://github.com/Sh-dott/portfolio-ShaiKahlon/blob/main/index.html
- CSS: https://github.com/Sh-dott/portfolio-ShaiKahlon/blob/main/assets/css/styles.css
- JS: https://github.com/Sh-dott/portfolio-ShaiKahlon/blob/main/assets/js/main.js
- Avatar: https://github.com/Sh-dott/portfolio-ShaiKahlon/blob/main/assets/images/avatar.jpg

If any of these show "404" on GitHub, the files aren't properly synced.

## Force Refresh
After making changes:
1. Wait 2-3 minutes for GitHub to rebuild
2. Hard refresh your browser: `Ctrl + Shift + Delete` (clear cache)
3. Then refresh the page: `Ctrl + F5`

## Debug Tips

**Check the live site:**
- https://Sh-dott.github.io/portfolio-ShaiKahlon/ (should load)
- https://Sh-dott.github.io/portfolio-ShaiKahlon/assets/css/styles.css (should show CSS code)
- https://Sh-dott.github.io/portfolio-ShaiKahlon/assets/js/main.js (should show JS code)

If CSS/JS URLs 404, the path structure is wrong.

## Still Not Working?

Try rebuilding:
1. Settings → Pages
2. Under "Build and deployment", check the rebuild status
3. If stuck, try:
   - Adding a dummy file and pushing
   - This triggers a new build
   - Remove the dummy file after

```bash
cd C:/Users/Shai/web-projects/portfolio-refactored
touch .rebuild
git add .rebuild
git commit -m "Trigger rebuild"
git push origin main
```

Then remove it:
```bash
rm .rebuild
git add .rebuild
git commit -m "Remove rebuild trigger"
git push origin main
```

---

Let me know the current status and I'll help debug further!
