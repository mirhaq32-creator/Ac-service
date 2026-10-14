# Cloudflare Workers par deploy (OpenNext)

## 1) Pehli baar, apne computer par
    npm install          # naya package-lock.json banega -> usay GitHub par commit karein
    npm run build        # check
    npm run preview      # local Cloudflare-style preview (optional)

## 2) Cloudflare -> Workers & Pages -> aapka Worker -> Settings -> Build
- Build command:   npx opennextjs-cloudflare build
- Deploy command:  npx opennextjs-cloudflare deploy
- Root directory:  /  (repo ka root)
- Worker ka naam `wrangler.jsonc` ke `name` (aur `services[0].service`) se EXACT match hona chahiye.

## 3) Variables
Build variables (NEXT_PUBLIC_* build ke waqt site mein bake hote hain):
- NODE_VERSION = 22
- NEXT_PUBLIC_SITE_URL = https://riyadhacservice.site
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY   (optional)
- NEXT_PUBLIC_GSC_VERIFICATION                             (optional)

Runtime secrets (Settings -> Variables and Secrets -> Secret):
- SUPABASE_SERVICE_ROLE_KEY, ADMIN_LOGIN_EMAIL             (sirf agar admin panel/Supabase use karna ho)

Supabase ke bina bhi site built-in content se poori chalti hai.

## 4) Domain
Worker -> Settings -> Domains & Routes -> riyadhacservice.site aur www add karein.

## Agar build mein error aaye
- "middleware" ya "proxy" ka error: README mein likha tareeqa dekhein / mujhe error ka text bhejein.
- Pehle `npm run build` local par chalayein; jo error aaye wahi bhejein.
