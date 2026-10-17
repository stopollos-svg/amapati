# Deploying Amapati to Vercel

Follow these steps to deploy **Amapati.com** to Vercel with zero errors and all features preserved.

---

## 🛠️ Resolved Build Configuration

- **`installCommand`**: `npm install --legacy-peer-deps` (configured in `vercel.json` and `.npmrc` to eliminate npm `ERESOLVE` peer dependency conflicts with `esbuild`/`vite`).
- **`buildCommand`**: `npm run build`
- **`outputDirectory`**: `dist`
- **`framework`**: `vite`

---

## ⚡ Method 1: Deploy via GitHub (Recommended)

1. **Commit & push your updated code**:
   ```bash
   git add .
   git commit -m "fix: resolve npm ERESOLVE peer dependencies for Vercel"
   git push origin main
   ```

2. **Trigger Vercel Build**:
   - Vercel will automatically re-deploy your commit with `--legacy-peer-deps`.
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
