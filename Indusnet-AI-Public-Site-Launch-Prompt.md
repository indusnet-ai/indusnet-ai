# Developer Prompt: Public Website Polish (Indusnet AI)

> Copy everything below this line and give it to your developer or AI coding assistant.

---

## Context and scope

The site at **indusnet-ai.com is already live and publicly reachable**. This round is about the **public marketing website only** — making it trustworthy, measurable and fast for visiting customers.

**In scope:** Home, About, Services, Generative AI, Industries, Training, AI Scoper, Portfolio, Blog, Contact, Careers, Privacy, Terms, and site-wide concerns (forms, database, navigation, analytics, performance, SEO).

**Out of scope for now:** the Tender Portal (`/portal`), the bid workspace, and the HR module. They stay in the codebase and keep working at their URLs, but they are being deferred, so they must not be advertised in the public UI.

**Rules:** work on a branch, one commit per section, never commit secrets, don't redesign the visual style, and tell me anything you chose not to do and why. Before reporting back, actually load the pages in a browser — desktop and phone width, light and dark — not just `npm run build`.

---

## 1. Move off the Supabase free tier (the forms are the priority)

The contact form, newsletter box and AI Scoper currently write to Supabase, whose free project pauses after about a week of low activity, and `RESEND_API_KEY` is still placeholder text. Right now a visitor who fills a form gets an error and we get no lead. That is the single most expensive bug on the site.

1. **Create a Neon Postgres project** (free plan: permanently free, no card, scales to zero instead of pausing). Use the **pooled** connection string.
2. **Export the existing Supabase data** for `leads`, `consultations`, `newsletter`, `assessments` before anything else, and import it into Neon. Keep the SQL in `supabase/schema.sql` (rename the folder to `db/` if you like) so the schema is reproducible.
3. **Rewrite the three Next.js route handlers** — `app/api/consultations/route.ts`, `app/api/newsletter/route.ts`, `app/api/assessments/route.ts` — to insert directly into Neon from the server using `pg` (or Drizzle), reading a **server-only** `DATABASE_URL`. Remove `@supabase/supabase-js`, `lib/supabase.ts` and every `NEXT_PUBLIC_SUPABASE_*` variable. Keep the honest error handling: if the insert fails, return 500 and show the visitor a real message, never a fake success.
4. **Add a fallback so a lead is never lost:** if the database write fails, still send the notification email and log the payload; tell the visitor their message was received by email.
5. **Email:** set `RESEND_API_KEY` and send from a verified domain (e.g. `hello@indusnet-ai.com`), not `onboarding@resend.dev`, which only delivers to the account owner. Notifications go to `info@indusnet-ai.com`. Add an **autoresponder** to the person who submitted the form — a short "we received your enquiry, we'll reply within one business day".
6. **Test end to end on the live site** after deploying: submit the contact form, the newsletter and an AI Scoper report, and confirm the row lands in Neon and both emails arrive.

Also keep the FastAPI backend's `DATABASE_URL` pointing at its own Neon database (or the same one, separate schema) so the portal work later doesn't depend on Supabase either.

## 2. Hide what isn't ready

- Remove **Tender Portal** from the navbar and any footer/About links to `/portal` and `/portal/hr`. The routes stay live for internal use; they just aren't advertised.
- Move **AI Scoper** under Services (or into the hero call-to-action) so the top navigation is at most 7 items. In the current build the nav wraps onto two lines at normal laptop width — that alone reads as unfinished.
- **Careers:** the page fetches live jobs from the FastAPI backend. Unless that backend is deployed and reachable from the public site, make Careers a static page — a short "we're hiring, send your CV to careers@indusnet-ai.com" — behind a simple flag (`NEXT_PUBLIC_CAREERS_MODE=static|live`) so it can switch back later. An empty jobs list on a live site looks broken.

## 3. Claims the site can't back up

- The hero badge **"RAG SEARCH — 98.4% Accuracy"** is a precise, checkable-sounding number with nothing behind it. Replace it with something true (a capability statement, or a benchmark you can publish), or remove it. Same for any similar metric elsewhere.
- The **three homepage testimonials** ("Dr. Rajesh Mukhopadhyay / Metro Financial Group", "Sarah Jenkins / OmniTech Solutions", "Kenji Sato / Sato Heavy Industries") and the **four portfolio client names** ("Metro Financial Group", "Sato Heavy Industries", "GlobalPay Commerce", "CareAll Healthcare System") are presented as real customers. **Do not invent replacements.** Until the owner supplies real, permissioned quotes, hide those sections behind a flag, or rewrite them as clearly-labelled illustrative scenarios ("Example engagement: financial services") with no invented person's name or company.
- Check the rest of the copy for the same pattern: numbers of clients, years in business, team size, certifications. Anything not verifiable comes out.

## 4. Make it measurable

- Add **Google Analytics 4** (or Plausible, which is lighter and privacy-friendly) via `next/script` with `strategy="afterInteractive"`, behind an env var so it doesn't run in development.
- Verify the domain in **Google Search Console** and submit `https://indusnet-ai.com/sitemap.xml`.
- Track the three conversion events: contact form submit, AI Scoper completion, newsletter signup.
- Mention analytics in the Privacy page — it currently doesn't say anything about it.

## 5. Sharing, speed and assets

- **Open Graph image:** create a 1200×630 branded image and wire it into `app/layout.tsx` metadata (`openGraph.images` and `twitter.images`), with per-page overrides for blog articles. Right now shared links show plain text in WhatsApp and LinkedIn.
- **Favicon:** `app/favicon.ico` and `public/favicon.ico` are 380 KB. Regenerate a proper 32×32 / 180×180 set (a few KB) plus `apple-touch-icon.png`.
- **Logo:** `public/logo.jpg` is 213 KB and `logo.png` 28 KB; the footer uses a plain `<img>`. Convert to an optimised PNG/WebP and render with `next/image` so it's sized and lazy-loaded properly.
- **Fonts:** confirm Inter and Outfit load with `display: swap` and that the heading font is actually applied (`--font-heading` was mapped to the sans font until recently).
- Run **Lighthouse on the live site, mobile profile**, and report the four scores. Target 90+ for Performance and 95+ for Accessibility and SEO. Fix whatever it flags in images, contrast and layout shift.

## 6. Trust and correctness details

- Confirm the site is served over **HTTPS** with a valid certificate, that `http://` and `www.` both redirect to the canonical `https://indusnet-ai.com`, and that HSTS is on.
- Add basic **security headers** in `next.config.ts`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and a reasonable `Permissions-Policy`.
- Add a styled **404 page** (`app/not-found.tsx`) — an unstyled default on a company site looks broken.
- Check every page at **360px width** and in **light mode**; the theme now follows the visitor's system setting, so roughly half of visitors will see light.
- Verify the **contact details** are consistent everywhere (Chennai and Singapore addresses, phone numbers, email) and that the phone numbers dial correctly on mobile.
- Confirm with the owner whether the **CEO banner and personal mobile number** should stay on a public page.

## 7. Before you report back

Deploy, then on the **live site** check and tell me the result of each:

1. Contact form → row in Neon, notification email received, autoresponder received.
2. Newsletter signup → row in Neon.
3. AI Scoper → completes and delivers its report.
4. Careers page → shows the static (or live) content, no empty state.
5. Navigation → 7 items or fewer, no wrapping at 1366px, no Tender Portal link.
6. Shared link in WhatsApp → shows the OG image.
7. Lighthouse mobile → four scores.
8. Light mode and 360px width → no unreadable text, no horizontal scroll.

List anything you skipped and why, plus any env variable I need to set.
