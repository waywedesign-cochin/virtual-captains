# Virtual Captains

Marketing website for **Virtual Captains** and **SalesX** — sales training, AI sales simulation and sales floor management.

Live: <https://virtualcaptains.vercel.app>

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS v4, DM Sans via `next/font` |
| Animation | GSAP + ScrollTrigger, Motion, Lenis smooth scroll |
| CMS | [Sanity](https://www.sanity.io) (blogs, news, YouTube videos) — studio embedded at `/studio` |
| Payments | Razorpay (program enrolment) |
| Hosting | Vercel |

> **Note:** this project uses Next.js 16, which has breaking changes from earlier versions. Check the bundled docs in `node_modules/next/dist/docs/` before relying on older patterns (see `AGENTS.md`).

## Getting Started

**Requirements:** Node.js 20+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment file and fill in the values
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Open <http://localhost:3000>.

## Environment Variables

Copy `.env.example` to `.env.local` (never commit `.env.local`). On Vercel, add the same keys under **Project → Settings → Environment Variables**.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Sanity dataset, e.g. `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | Sanity API version date (defaults to `2026-01-15`) |
| `NEXT_PUBLIC_SITE_URL` | Production | Public site URL used for canonical links, sitemap and share cards. Defaults to `https://virtualcaptains.vercel.app` |
| `RAZORPAY_KEY_ID` | For payments | Razorpay Key ID (`rzp_test_…` / `rzp_live_…`) |
| `RAZORPAY_KEY_SECRET` | For payments | Razorpay Key Secret — **server only, never expose** |
| `NEXT_PUBLIC_UNDER_DEVELOPMENT` | No | `true` redirects every page except Home to `/under-development` (see `proxy.ts`) |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `node scripts/generate-globe-dots.mjs` | Regenerate the dotted world map used by the Cross Country section |

## Project Structure

```
app/
├── (pages)               about, salesx, individuals, organisations, programs,
│                          partner, contact, blogs, news-and-updates, resources,
│                          privacy, terms, refund …  — one folder per route
├── api/
│   ├── contact/          Contact form endpoint
│   └── razorpay/         create-order + verify payment
├── components/           Section components, grouped by page (home/, salesx/, about/ …)
│   └── common/           Shared pieces (PhoneField, footers, BackToTop …)
├── lib/
│   ├── animations/       Shared animation presets (headingReveal …)
│   └── seo.ts            pageMetadata() helper + site URL
├── layout.tsx            Root layout: fonts, smooth scroll, site-wide SEO
├── sitemap.ts            Generated sitemap (static pages + Sanity posts)
├── robots.ts             robots.txt
└── opengraph-image.tsx   Default social share image
sanity/                   Sanity schemas, queries and client
public/                   Images, videos and fonts
proxy.ts                  "Under development" redirect toggle
```

## Content Management (Sanity)

The Sanity Studio runs inside the app at **`/studio`** (log in with a Sanity account that has access to the project).

| Content | Where it shows |
| --- | --- |
| Blog posts, categories, authors | `/blogs` |
| News posts, news categories | `/news-and-updates` |
| YouTube videos (recent / upcoming) | About page video section — updates live on publish |

When deploying to a new domain, add it under **sanity.io/manage → API → CORS origins** (credentials **off**) so live updates work in the browser.

## SEO

- Every page sets its metadata with `pageMetadata()` from `app/lib/seo.ts` (title, description, canonical URL, Open Graph and Twitter cards).
- Titles automatically get the ` | Virtual Captains` suffix from the root layout.
- `sitemap.xml` and `robots.txt` are generated from `app/sitemap.ts` and `app/robots.ts`.
- Blog and news SEO fields are managed in Sanity.

## Conventions

- **Headings use Title Case** — capitalise every main word; keep short words (a, an, the, and, of, to, in, on, for, by, with) lowercase unless first.
- **Font:** DM Sans everywhere (`font-sans`, `font-serif` and `font-display` all map to it).
- **Brand colours:** navy `#020B25`, blue `#2563eb`, sky `#38bdf8`, lime accent `#e7ff3d`.
- **Animations:** respect `prefers-reduced-motion`; on phones/tablets (< 1024px) avoid scroll-pinning — sections flow normally.
- Section headings share the entrance animation in `app/lib/animations/headingReveal.ts` / `useHeadingZoom`.

## Payments (Razorpay)

1. Generate **Test Mode** keys in the Razorpay dashboard (**Account & Settings → API Keys**) and add them to `.env.local`.
2. Test the enrolment flow on `/programs` with Razorpay test cards.
3. Once the account is activated, switch to **Live Mode** keys in Vercel.

Razorpay's website review requires these pages to be live: Contact, Terms, Privacy, Refund & Cancellation, and Shipping & Delivery.

## Deployment

The site deploys to **Vercel** from GitHub. Pushes to `main` deploy to production; other branches get preview deployments.

Before going live on a custom domain:

1. Set `NEXT_PUBLIC_SITE_URL` to the new domain.
2. Add the domain to Sanity CORS origins.
3. Make sure `NEXT_PUBLIC_UNDER_DEVELOPMENT` is not `true`.
4. Submit `https://<domain>/sitemap.xml` in Google Search Console.
