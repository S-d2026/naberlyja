# Step-by-Step Deployment Guide for Naberly JA

## Part 1: prepare the repo
1. Download the ZIP.
2. Unzip it on your computer.
3. Open the folder in VS Code.
4. Open terminal in that folder.
5. Run:
   npm install

## Part 2: create GitHub repo
1. Go to GitHub.
2. Click New Repository.
3. Name it something like:
   naberlyja
4. Create the repo.
5. In terminal, run:
   git init
   git add .
   git commit -m "Initial Naberly JA deploy"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main

## Part 3: create Supabase project
1. Go to Supabase.
2. Create a new project.
3. Wait until it finishes provisioning.
4. Go to SQL Editor.
5. Open `supabase/schema.sql`.
6. Paste the full SQL into the editor.
7. Run it.

## Part 4: configure Supabase
1. In Supabase, go to Project Settings -> API.
2. Copy:
   - Project URL
   - anon public key
   - service role key
3. In Supabase Auth:
   - enable Email sign-in
   - add Site URL:
     https://naberlyja.com
   - add redirect URLs for:
     https://naberlyja.com
     https://www.naberlyja.com
     your Vercel preview URL
4. In Storage:
   - create bucket: listing-images

## Part 5: add env vars locally
1. Duplicate `.env.example` as `.env.local`
2. Fill in:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   NEXT_PUBLIC_SITE_URL=https://naberlyja.com
   NEXT_PUBLIC_WIPAY_PUBLIC_KEY
   WIPAY_SECRET_KEY
   NEXT_PUBLIC_LYNK_INFO_URL

## Part 6: test locally
1. Run:
   npm run dev
2. Open:
   http://localhost:3000
3. Test:
   - homepage loads
   - category buttons filter correctly
   - Sell / Offer Anything opens post flow
   - district field is present
   - login page opens
   - signup page opens

## Part 7: deploy to Vercel
1. Go to Vercel.
2. Click Add New Project.
3. Import your GitHub repo.
4. Framework preset should detect Next.js automatically.
5. Add all environment variables from `.env.local`.
6. Click Deploy.

## Part 8: connect domain
1. In Vercel project, go to Settings -> Domains.
2. Add:
   naberlyja.com
3. Add:
   www.naberlyja.com
4. Follow Vercel’s DNS instructions at your domain registrar.
5. Once verified, set root domain as primary.

## Part 9: final checks
1. Open live site.
2. Test category buttons.
3. Test login and signup.
4. Test posting flow.
5. Test parish and district inputs.
6. Test mobile view.
7. Add real payment links for Featured page.

## Part 10: after deploy
1. Connect real Supabase queries to admin, favorites, and post pages.
2. Add image upload with Supabase Storage.
3. Add WiPay hosted payment links on Featured page.
4. Soft launch Kingston, St Andrew, Portmore, Montego Bay.
