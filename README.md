# Midnight Bakehouse Quick Shop

Bright pastel, mobile-first storefront celebrating the 50%-off Midnight Bakehouse drop. Plain HTML/CSS/JS drives the catalog, slick cart, and curated modal prompts, while a single serverless function keeps Stripe Checkout secure and pricing enforced.

## Stack overview
- `index.html`, `styles.css`, `app.js`: browser-only UI with product catalog, sticky cart, popup prompts, and the Stripe checkout trigger.
- `functions/create-checkout-session.js`: lightweight Netlify/Vercel function that verifies the menu, calculates line items, and issues a Stripe Checkout session.
- Deploy anywhere that can host static files and a simple serverless function (Netlify, Vercel, Cloudflare Pages, etc.).

## Getting started locally
1. Install dependencies for the function:
   ```bash
   npm init -y
   npm install stripe
   ```
2. Run the static files through a simple server (e.g., `npx serve .` or your favorite static host).
3. Emulate the function locally (Netlify CLI, Vercel dev, or `netlify dev` if you add Netlify config).
4. Set `STRIPE_SECRET_KEY` in your environment when invoking the function.

## Deploy notes
- Push the files to a static host, then add the serverless function under `functions/create-checkout-session.js`.
- Configure the `STRIPE_SECRET_KEY` environment variable inside the platform’s dashboard.
- The storefront calls the function at `/.netlify/functions/create-checkout-session`. Adjust the path (`/api/create-checkout-session`) if your provider uses a different prefix.
- Success/cancel URLs point back to the home page; change `success_url` in the function if you make a thank-you page (`success.html`).

## Next steps
1. Replace placeholder product photos or add theme-specific imagery.
2. Flesh out the pop-ups (timing, copy) if you want more staged drop feels.
3. Extend the catalog or hook up a CMS if the menu should be editable.
