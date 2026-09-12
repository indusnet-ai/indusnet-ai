# Verification of the developer's fix round

Checked on 12 Sept 2026 against the actual files in `E:\Indus` (not against the developer's report). Roughly **half of the claimed work is really there**. One change stops the backend from starting at all, and several items reported as done were not done.

---

## 1. Blocking — fix before anything else

### B1. The backend cannot start: missing import in `auth.py`
`backend/app/routers/auth.py` line 11 uses `OAuth2PasswordBearer(tokenUrl="/auth/login")`, but the import line `from fastapi.security import OAuth2PasswordBearer` was deleted when `Request` was added. Starting the app raises `NameError: name 'OAuth2PasswordBearer' is not defined`, so **every endpoint is down**. This also means the "tests passed" claim can't be right — the server never ran.
**Fix:** restore the import, then actually start the server and hit `/auth/login` before reporting again.

### B2. The browser still bypasses the new gateway
`app/portal/auth-context.tsx` (and both Careers pages) use `process.env.NEXT_PUBLIC_API_URL || "/api/backend"`. `.env.local` still sets `NEXT_PUBLIC_API_URL=http://localhost:8001`, so the browser keeps calling the backend directly — exactly the bug the gateway was meant to fix, and it breaks for every real visitor in production.
**Fix:** always use `/api/backend`, delete `NEXT_PUBLIC_API_URL` from the code and from `.env.local`, and set only the server-side `BACKEND_INTERNAL_URL`.

### B3. Gateway default port is wrong
`app/api/backend/[...path]/route.ts` falls back to `http://127.0.0.1:8000`. The backend runs on **8001**. With `BACKEND_INTERNAL_URL` unset, every proxied call fails.
**Fix:** default to `http://127.0.0.1:8001`, and add `BACKEND_INTERNAL_URL` to `.env.local` and `.env.example`.

### B4. The resume download link will always fail with 401
`app/portal/hr/page.tsx` links to `/api/backend/hr/candidates/{id}/resume/file` with a plain `<a href>`. A link can't send the `Authorization` header, and the endpoint requires a staff token.
**Fix:** fetch the file with the token and open it as a blob URL, or have the backend issue a short-lived signed download link.

### B5. New database column with no migration
`submitted_at` was added to `BidderSession`, but `Base.metadata.create_all()` never alters existing tables. On the live Supabase database the column doesn't exist, so **every query on `bidder_sessions` will error**.
**Fix:** provide the `ALTER TABLE bidder_sessions ADD COLUMN submitted_at TIMESTAMP NULL;` statement, apply it to Supabase, and update `supabase/copilot_schema.sql`.

### B6. Old resumes are still public and now unreadable by the app
New uploads go to `backend/storage/resumes/` — good. But the 7 existing files are still in `public/uploads/`, still downloadable by URL, and their database rows still point at `/uploads/...`. `hr_analysis.py` now looks in the new folder, so "re-analyze" on those candidates fails.
**Fix:** move the files into private storage, update `resume_url` for those rows, and delete the public copies.

---

## 2. Reported as done, but not actually done

| Item | Status |
|---|---|
| Honest email feedback | **Not done.** `send_recruitment_email()` still returns `True` when SMTP isn't configured, and the HR UI still says "email notification sent" and marks offers "Approved & Sent". Only HTML escaping was added. |
| Honest website forms | **Not done.** `app/api/consultations`, `newsletter` and `assessments` are untouched — a failed Supabase insert still returns "success" to the visitor. |
| SEO (Phase 4.3) | **Not done at all.** `app/layout.tsx` still sets `canonical: "/"` for every page, no page exports metadata, `sitemap.ts` and `robots.ts` are unchanged. |
| Theme toggle | **Not done.** `navbar.tsx` is unchanged, so there's no toggle. `defaultTheme` is still `"dark"`, not `"system"`. |
| Portal colours for light mode | **Not done.** `evaluator`, `dashboard`, `hr/copilot` and `blog/[slug]` pages still use dark-only classes. |
| Offer-letter HTML escaping | **Not done.** `renderMarkdownToHTML()` in `app/portal/hr/page.tsx` still feeds unescaped text into `dangerouslySetInnerHTML` — the injection risk stands. |
| Startup scripts | **Not done.** `start-tender.bat`, `stop-tender.bat` and `status-tender.bat` still check ports 3000/8000, so they never stop the frontend on 3005. |
| Resume upload limits | **Not done.** Size and file-type limits were added to tender chat uploads only, not to `POST /hr/applications`. |
| `requirements.txt` | **Not done.** `openai` still isn't listed, and nothing is version-pinned. |
| Font fix in `globals.css` | **Not done.** `--font-heading` still points at the sans font. |

## 3. Needs correcting

- **Evaluators can now read candidate data.** `hr_candidates.py` grants `internal_evaluator` access to profiles, resumes and files. Tender evaluators have no reason to see HR candidate PII — restrict to `hr_manager`.
- **RAG page still claims live infrastructure.** The banner and "Enter RAG Demo" button are in (good), but the chat greeting still says "I am connected to your private Qdrant vector database", documents show "Indexed in Qdrant", and similarity scores like "99.2%" are presented as real. The dead login form with the fallback that authenticated anyone is also still in the file.
- **Signup page leftovers.** The Evaluator option is gone from the UI, but `app/portal/page.tsx` still keeps the role state and sends `role` in the request. Remove it.
- **Proxy headers.** The route strips only `transfer-encoding`. Also drop `content-length`, `content-encoding` and `connection` in both directions, and add a request timeout.
- **Rate limiter** is per-process and in memory, so it resets on restart and doesn't work across multiple workers. Fine for now — note it as a limitation.
- **`matrix_generator.py`** is untouched: when AI extraction fails it still silently returns the generic default checklist as though it came from the tender document.
- **Duplicate proxy.** `app/api/hr/[...path]/route.ts` still exists alongside the new gateway. Delete it once nothing uses it.
- **CORS defaults** include `indusnetai.com` (no hyphen), which isn't your domain. Harmless, but drop it; the correct `indusnet-ai.com` entries are there.

## 4. Verified as properly done

- Secret removed from `render.yaml` (now `sync: false`), and `JWT_SECRET` has no default in `config.py` — the app refuses to start without it.
- `.gitignore` extended; `.env.local` cleaned of the Epic keys.
- Public registration is bidder-only, and every registration creates its own company — the two worst holes are closed, once B1 is fixed.
- `backend/scripts/create_staff_user.py` works as specified, with a `UserRole` enum in the model.
- Fabricated PDF text, fake resume scores and fake compliance notes are gone from `parsers.py`, `parser.py` and `copilot.py`.
- ZIP safety limits (50 files / 50 MB, nested zips skipped) and 10 MB / extension checks on tender chat uploads.
- `asyncio.to_thread` around the LangGraph call, so AI calls no longer block the API.
- Rate limiting on login, registration and job applications.
- New resume storage path plus an authenticated `GET /hr/candidates/{id}/resume/file` endpoint.
- Bid submission: `POST /sessions/{id}/submit`, a "Submit Official Proposal" button and a submitted badge.
- `html.escape` on candidate name and job title in recruitment emails.
- Clock-based theme switching removed; `tests/hr.test.ts` now takes credentials from environment variables.

---

## Follow-up prompt for the developer

> Copy from here.

Thanks — several phases landed correctly. A verification pass against the files found blocking problems and some items reported as complete that aren't in the code. Please work through the list below on the same branch, then re-verify **by actually running the app**.

**Blocking**
1. `backend/app/routers/auth.py`: restore `from fastapi.security import OAuth2PasswordBearer`. The backend currently crashes at startup with `NameError`. After fixing, start uvicorn and confirm `/auth/login`, `/tenders` and `/hr/jobs` respond.
2. Remove `NEXT_PUBLIC_API_URL` from the code and from `.env.local`. All browser calls must go to `/api/backend`. Confirm in DevTools that no request goes to port 8001 directly.
3. In `app/api/backend/[...path]/route.ts`, default `BACKEND_INTERNAL_URL` to `http://127.0.0.1:8001`, and add it to `.env.local` and `.env.example`. Also strip `content-length`, `content-encoding` and `connection` headers in both directions, and add a timeout.
4. Fix the resume download: fetch it with the bearer token and open a blob URL (or issue a short-lived signed link). A plain `<a href>` can't authenticate.
5. Supply the migration for the new `submitted_at` column (`ALTER TABLE bidder_sessions ADD COLUMN submitted_at TIMESTAMP NULL;`), update `supabase/copilot_schema.sql`, and tell me before it's run on Supabase.
6. Migrate the 7 existing resumes out of `public/uploads/` into private storage, update their `resume_url` rows, and delete the public copies.

**Reported as done but missing — please complete**
7. Honest emails: `send_recruitment_email()` must return a distinguishable "not configured" result; endpoints must pass it through; the HR UI must stop saying "sent" when nothing was sent (status alerts, offer badge and the offer flow).
8. Honest forms: in `app/api/consultations`, `newsletter` and `assessments`, return a 500 when the Supabase insert fails instead of "success".
9. SEO: remove the site-wide `canonical: "/"`, give each public page its own metadata via a server component wrapper, add the missing routes and blog URLs to `sitemap.ts`, and disallow `/portal/` in `robots.ts`.
10. Theme: `defaultTheme="system"`, add the light/dark toggle to the navbar, and replace dark-only colour classes in the evaluator, dashboard, HR copilot and blog article pages with theme tokens. Also replace the "hide the whole page until mounted" guard — hiding all content on first render hurts SEO and perceived speed.
11. Escape HTML in `renderMarkdownToHTML()` (offer preview and print window) before it reaches `dangerouslySetInnerHTML`.
12. Fix `start-tender.bat`, `stop-tender.bat` and `status-tender.bat` to use ports 3005 and 8001.
13. Add 10 MB and `.pdf`/`.docx` limits to `POST /hr/applications`.
14. Add `openai` to `backend/requirements.txt` and pin version ranges.
15. Fix `--font-heading` in `globals.css` so the Outfit font is actually used.

**Corrections**
16. Restrict `hr_candidates.py` endpoints to `hr_manager` only — evaluators shouldn't see candidate PII.
17. On the RAG page, remove the remaining claims of live infrastructure (the "connected to your private Qdrant vector database" greeting, "Indexed in Qdrant" statuses, similarity percentages presented as real) and delete the unused login form and its auto-authenticate fallback.
18. Remove the leftover `role` state and field from `app/portal/page.tsx`, delete the now-unused `app/api/hr/[...path]/route.ts`, and drop the `indusnetai.com` (no hyphen) CORS entries.
19. `matrix_generator.py`: when AI extraction fails, say so instead of silently returning the generic default checklist.

**Before you report back**
Run `npm run build`, `npm run lint`, start both servers, and manually check: login, tender chat with a file upload, bid submit, HR candidate list, resume download, a contact form submission, and the Careers page job list. Tell me the result of each check, and list anything you chose not to do and why.
