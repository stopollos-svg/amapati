# Deploying Amapati to Vercel

Follow these steps to deploy **Amapati.com** to Vercel with zero errors and all features preserved.

---

## 🛠️ Resolved Build Configuration

- **`installCommand`**: `npm install --legacy-peer-deps` (configured in `vercel.json` and `.npmrc` to eliminate npm `ERESOLVE` peer dependency conflicts with `esbuild`/`vite`).
- **`buildCommand`**: `npm run build`
- **`outputDirectory`**: `dist`
- **`framework`**: `vite`

---

## 📱 Developer Website & app-ads.txt Verification (IAB Tech Lab)

Your developer website is pre-configured with `/app-ads.txt` and `/robots.txt` for Google Play Store, Apple App Store, and Google AdMob verification:

- **Root Location**: `/app-ads.txt`
- **Specification Snippet**:
  ```text
  google.com, pub-2596010858935461, DIRECT, f08c47fec0942fa0
  ```
- **Vercel Routing**: Configured in `vercel.json` to be served as `text/plain; charset=utf-8` with permissive CORS headers.
- **In-App Crawler Verification**: Go to **Admin Hub > Settings > Developer Website & app-ads.txt** to run a real-time crawler audit and inspect status checks.

### App Store Setup:
1. **Google Play Console**: In **Store presence > Store settings > Website**, enter your domain (e.g., `https://amapati.vercel.app` or your custom domain).
2. **Apple App Store Connect**: In **App Information > General Information**, enter the website under **Marketing URL** or **Support URL**.

---

## ⚡ Method 1: Deploy via GitHub (Recommended)

1. **Commit & push your updated code**:
   ```bash
   git add .
   git commit -m "feat: add IAB Tech Lab app-ads.txt and verifier"
   git push origin main
   ```

2. **Trigger Vercel Build**:
   - Vercel will automatically deploy with `--legacy-peer-deps`.
   - The build will succeed without any `ERESOLVE` errors.

3. **Configure Environment Variables in Vercel** (Project Settings > Environment Variables):
   - `VITE_SUPABASE_URL`: (Optional) Your Supabase Project URL (`https://xyz.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY`: (Optional) Your Supabase public anon key
   - `APP_URL`: Your Vercel domain (e.g. `https://amapati.vercel.app`)

---

## 💻 Method 2: Deploy via Vercel CLI

```bash
# Deploy to production directly
vercel --prod
```

---

## 🗄️ Database Setup (Supabase)

1. Open your project on [supabase.com](https://supabase.com).
2. Go to the **SQL Editor**.
3. Copy the script from `supabase/migrations/20240101000000_init_amapati.sql` (or from the **Settings & Supabase RLS** tab in the Amapati Admin panel).
4. Run the query. It provisions all tables, RLS policies, the 20-active-editors limit trigger, and seeds superuser privileges for `stopollos@gmail.com`.
