# للتبريد والتكييف — riyadhacservice.site

Next.js 16 + Tailwind 4 + Supabase CMS (admin at /admin). Arabic (default) + English.

## Run
    cp .env.example .env.local   # fill Supabase values (optional: site works with seed content)
    npm ci
    npm run dev

## Check before deploy
    npm run typecheck && npm run lint && npm run build

Never commit .env.local. Put secrets in Cloudflare/Vercel Environment Variables.

## Deploy
Cloudflare Workers via OpenNext — see DEPLOY.md.

## Brand assets
Real logo emblem + icons live in `public/brand`, `public/icons`, `src/app/icon.png`. Work photos in `public/images`.
