# 🚀 योजना पोर्टल — Setup Guide (Step by Step)

## ✅ STEP 1 — Supabase Database Setup

### 1a. Create a free Supabase account
1. Open browser → go to **https://supabase.com**
2. Click **"Start your project"** → Sign up with Google or email
3. Click **"New Project"**
4. Fill in:
   - **Name:** `yojana-portal`
   - **Database Password:** choose a strong password (save it!)
   - **Region:** `Southeast Asia (Singapore)` (closest to India)
5. Click **"Create new project"** → wait 2–3 minutes

---

### 1b. Create the database table
1. In Supabase dashboard → click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Paste this code and click **"Run"**:

```sql
CREATE TABLE schemes (
  id        BIGSERIAL PRIMARY KEY,
  naam      TEXT,
  vivaran   TEXT,
  paatrata  TEXT,
  dastavez  TEXT,
  labh      TEXT,
  vibhag    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON schemes
  FOR SELECT TO anon USING (true);
```

You should see: **"Success. No rows returned"**

---

### 1c. Import your scheme data
1. In Supabase dashboard → click **"Table Editor"** (left sidebar)
2. Click the **"schemes"** table
3. Click **"Insert"** button (top right) → **"Import data from CSV"**
4. Upload the file: `yojana-portal/schemes_data.csv`
5. Make sure column mapping shows: naam → naam, vivaran → vivaran, etc.
6. Click **"Import"**

You should see 50 rows imported ✅

---

### 1d. Get your API keys
1. In Supabase dashboard → click **"Settings"** (gear icon, left sidebar)
2. Click **"API"**
3. You will see two things — **copy both**:
   - **Project URL** → looks like `https://abcdef.supabase.co`
   - **anon public** key → a long string starting with `eyJ...`

---

## ✅ STEP 2 — Add Supabase keys to the project

1. Open the file: `yojana-portal/.env.local`
2. Replace the placeholder text:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

With your actual keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdef.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✅ STEP 3 — Test locally

1. Open **Terminal** (press Cmd+Space → type Terminal → Enter)
2. Type these commands one by one:

```bash
export PATH="/tmp/node-v20.19.1-darwin-arm64/bin:$PATH"
cd /Users/sunflower/yojana-portal
npm run dev
```

3. Open browser → go to **http://localhost:3000**
4. You should see the portal with 7 department cards!
5. Click "योजना खोजें" → schemes should load from Supabase

**To stop:** press `Ctrl+C` in Terminal

---

## ✅ STEP 4 — GitHub Setup

### 4a. Create a GitHub account (if you don't have one)
1. Go to **https://github.com** → Sign up (free)

### 4b. Create a new repository
1. Click **"+"** (top right) → **"New repository"**
2. **Repository name:** `yojana-portal`
3. Set to **Public**
4. Do NOT check "Add README"
5. Click **"Create repository"**
6. **Copy the URL shown** (e.g., `https://github.com/YOUR_NAME/yojana-portal.git`)

### 4c. Push your code
Open Terminal and run these commands one by one:

```bash
export PATH="/tmp/node-v20.19.1-darwin-arm64/bin:$PATH"
cd /Users/sunflower/yojana-portal

git init
git add .
git commit -m "Initial commit: Yojana Portal"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/yojana-portal.git
git push -u origin main
```

> ⚠️ Replace `YOUR_NAME` with your actual GitHub username

When asked for password, use a **GitHub Personal Access Token** (not your GitHub password):
- GitHub → Settings → Developer settings → Personal access tokens → Generate new token → check "repo" scope

---

## ✅ STEP 5 — Deploy on Vercel (FREE)

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **"Add New Project"**
3. Find and click **"Import"** next to `yojana-portal`
4. **Before clicking Deploy** → expand **"Environment Variables"**
5. Add these two variables:
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
6. Click **"Deploy"**
7. Wait 2–3 minutes → 🎉 Your site is LIVE!

Vercel gives you a free URL like: **`yojana-portal.vercel.app`**

---

## 📁 File Summary

| File | Purpose |
|------|---------|
| `app/page.js` | Home page with department cards |
| `app/schemes/page.js` | Search + filter all schemes |
| `app/schemes/[id]/page.js` | Full detail of one scheme |
| `components/Navbar.js` | Top navigation bar |
| `components/SchemeCard.js` | Card shown in listing |
| `components/Footer.js` | Bottom footer |
| `lib/supabase.js` | Database connection |
| `.env.local` | Your secret API keys (never share!) |
| `schemes_data.csv` | Excel data ready to import into Supabase |

---

## ❓ FAQ

**Q: The schemes are not loading?**
→ Check `.env.local` has correct keys (no spaces, no quotes)

**Q: I see "Error" on the detail page?**
→ Make sure CSV was imported into Supabase correctly

**Q: Can I add more schemes later?**
→ Yes! Go to Supabase → Table Editor → schemes → Insert row

**Q: How to update the live site after changes?**
→ Run `git add . && git commit -m "update" && git push` — Vercel auto-deploys!
