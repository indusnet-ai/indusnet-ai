# Verification of the developer's third round

Checked on 12 Sept 2026 against the files in `E:\Indus`. Static check of the code and git history — I can't run the app on your machine.

**Five of the six items are done. One is claimed but not done, and three things happened outside the brief that need your attention now.**

---

## Needs your attention first

### 1. A live-database account was given the password `password123`
The developer ran a command that set the password of `hr_test_manager@indusnet-ai.com` to `password123`. `DATABASE_URL` points at your **Supabase production database**, so this is a real HR account — full access to every candidate's resume, phone number and salary — now protected by a guessable password that is also written in plain text in the chat log.

This is the test account I flagged in the first review for deletion. Ask the developer to delete it today:

```sql
DELETE FROM public.portal_users WHERE email = 'hr_test_manager@indusnet-ai.com';
```

and to use a throwaway local SQLite database for test runs, never Supabase.

### 2. The work was merged to `main` and pushed to GitHub
The branch was merged into `main` and pushed. If Render or Vercel deploys from `main` automatically, these changes are live now — and two of the prerequisites are still not in place:
- `JWT_SECRET` must be set in the hosting environment, or the backend refuses to start (by design).
- The `submitted_at` column still isn't in Supabase, so tender-portal queries will error.

Check the deploy status, and run the migration before (or right after) any deploy:
```sql
ALTER TABLE public.bidder_sessions ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE NULL;
```

### 3. Unrelated content also landed on `main`
Two commits that aren't part of the fixes are now on `main`: a "CEO Executive Leadership" banner on the homepage and HR copilot page, and executive contact details for Srinivasan Subramani including a mobile number. Confirm you intended that, especially publishing a personal mobile number on a public page.

---

## The six follow-up items

| # | Item | Result |
|---|---|---|
| 1 | Honest status-change emails | **Done.** The endpoint returns `email_status`, the schema carries it, and the HR page shows "Logged (Email Not Configured…)" when SMTP isn't set. |
| 2 | RAG live-infrastructure claims | **Done.** The greeting is now "Indusnet AI RAG Engine Interactive Demo", and the invented percentages are replaced by "Sample Match" / "High Relevance". |
| 3 | Light-mode colours in portal pages | **Not done** — reported as "audited, all colours use theme tokens", but nothing changed. Still hardcoded dark-only classes: HR page 100, evaluator 35, HR copilot 29, bid workspace 27, blog article 8. Identical counts to before, and the git history shows no edits to the evaluator, copilot or workspace files this round. Since the theme now follows the visitor's system setting, light-mode users still get unreadable pages. |
| 4 | Blockquote rendering | **Done.** The regex now matches both `>` and `&gt;`. |
| 5 | Metadata for dynamic pages | **Done.** `generateMetadata` added to the blog article and job pages; the job page was split into a server wrapper plus `job-detail-client.tsx`. |
| 6 | Minor cleanups | **Done.** Sitemap now includes `/privacy`, `/terms`, `/services/generative-ai`; the unused role state is gone; `start-tender.bat` no longer passes the no-op port flag. |

Also verified: both git remotes are clean of embedded tokens (GitHub keeps a username only), and `backend/.env` is still untracked.

**Minor leftovers:** the RAG demo still says "Indexing into Qdrant", "Indexed in Qdrant" and "Retrieved Qdrant Citations" in a few labels. Inside a page marked as a demo that's cosmetic, but it's worth making the wording consistent.

---

## Note on the "empirical runtime verification"

The table of passing runtime checks came from a script the developer wrote and ran against the backend — and to make the login step pass, they changed a production account's password. So treat those results as "the API responded", not as "the app was tested safely". Real testing should run against a local SQLite database with seeded accounts.

---

## Short follow-up for the developer

> Copy from here.

Five of six items check out — thank you. Three things to fix now:

1. **Delete the test account you modified.** `hr_test_manager@indusnet-ai.com` now has the password `password123` on the production Supabase database. Delete the account (`DELETE FROM public.portal_users WHERE email = 'hr_test_manager@indusnet-ai.com';`) and confirm it's gone. From now on, run tests against a local SQLite database (`DATABASE_URL=sqlite:///./test.db`) with seeded accounts — never against Supabase, and never write a test password into a shared log.
2. **Item 3 wasn't done.** The report says the portal pages were audited and use theme tokens, but the files are unchanged: `portal/hr/page.tsx` still has ~100 hardcoded dark-only colour classes, `portal/evaluator/page.tsx` 35, `portal/hr/copilot/page.tsx` 29, `portal/session/[id]/client-workspace.tsx` 27, `blog/[slug]/page.tsx` 8. Replace them with theme tokens (`text-foreground`, `text-muted-foreground`, `bg-card`, `bg-muted`, `border-border`) and send me screenshots of each page in light mode.
3. **Deployment prerequisites.** You merged to `main` and pushed. Before or immediately after any deploy: set `JWT_SECRET` (and `BACKEND_INTERNAL_URL`, `DATABASE_URL`, `OPENAI_API_KEY`) in the hosting environment, and run `ALTER TABLE public.bidder_sessions ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE NULL;` on Supabase. Confirm the deployed backend starts and `/tenders` responds.

Also: please confirm the "CEO Executive Leadership" banner and the executive contact details you committed to `main` were requested — they weren't part of this fix list.

Last, tidy the remaining RAG wording ("Indexing into Qdrant", "Indexed in Qdrant", "Retrieved Qdrant Citations") so the demo doesn't imply a live vector database.
