# Matrix Of Trading — website

A static site (HTML, CSS, JS). No build step, no server needed. Works on GitHub Pages.

## 1. Fill in your details
Open `config.js` and fill in: YouTube channel ID, Telegram link, checkout link, seats left, launch date and (optional) a Formspree endpoint for email signups.
Put indicator screenshots in `assets/` as `chronos.png`, `ares.png`, `selene.png`.

## 2. Put it on GitHub
1. Create a free account at github.com.
2. Click **New repository**, name it e.g. `matrix-of-trading`, set it to **Public**, create it.
3. Click **uploading an existing file**, drag in everything from this folder (including the hidden `.nojekyll` file and the `assets` folder), then **Commit changes**.
4. Go to **Settings → Pages**. Under *Source* choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
5. After a minute the site is live at `https://YOUR-USERNAME.github.io/matrix-of-trading/`.

## 3. Connect your domain
1. Buy the domain (e.g. at Cloudflare, Namecheap or Porkbun).
2. In GitHub: **Settings → Pages → Custom domain**, type your domain (e.g. `matrixoftrading.com`), **Save**.
3. At your domain registrar, add these DNS records:
   - Four **A** records for `@` pointing to:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One **CNAME** record for `www` pointing to `YOUR-USERNAME.github.io`
4. Wait for DNS to update (usually minutes, up to 24 h), then tick **Enforce HTTPS** in GitHub Pages settings.

## Updating later
Edit a file on GitHub (pencil icon) or upload a new version, commit, and the site updates within about a minute.
