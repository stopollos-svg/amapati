# Deploying Amapati to Vercel

Follow these steps to deploy **Amapati.com** to Vercel with zero downtime and all features preserved.

---

## ⚡ Method 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: Amapati technology marketplace"
   git remote add origin https://github.com/your-username/amapati-marketplace.git
   git branch -M main
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your `amapati-marketplace` repository.
   - Framework Preset: **Vite** (auto-detected).
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `./`

3. **Configure Environment Variables in Vercel** (Project Settings > Environment Variables):
   - `VITE_SUPABASE_URL`: (Optional) Your Supabase Project URL (`https://xyz.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY`: (Optional) Your Supabase public anon key
   - `APP_URL`: Your Vercel domain (e.g. `https://amapati.vercel.app`)

4. **Click Deploy**:
   - Vercel will build and deploy your marketplace in under 60 seconds.
   - `vercel.json` already handles all SPA client routes (`/(.*) -> /index.html`) so refreshing on `/admin` or product pages will not return 404.

---

## 💻 Method 2: Deploy via Vercel CLI

If you have the Vercel CLI installed:

```bash
# 1. Install CLI (if not already installed)
npm install -g vercel

# 2. Deploy preview
vercel

# 3. Deploy to production
vercel --prod
```

---

## 🗄️ Database Setup (Supabase)

1. Open your project on [supabase.com](https://supabase.com).
2. Go to the **SQL Editor**.
3. Copy the script from `supabase/migrations/20240101000000_init_amapati.sql` (or from the **Settings & Supabase RLS** tab in the Amapati Admin panel).
4. Run the query. It provisions all tables, RLS policies, the 20-active-editors limit trigger, and seeds superuser privileges for `stopollos@gmail.com`.
