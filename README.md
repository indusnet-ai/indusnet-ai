# Indusnet AI — Enterprise AI Solutions & Portals

Production-ready modern enterprise application for **Indusnet AI** (https://indusnetai.com/). Features public enterprise marketing pages, Smart Tender Bidding Copilot, HR Candidate Portal, and RAG Prototype Engine.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide Icons
- **Backend**: FastAPI (Python 3.11), SQLAlchemy, Pydantic v2, PyJWT, LangGraph
- **Database**: SQLite (`copilot.db`) or Supabase PostgreSQL
- **Gateway**: Next.js Same-Origin API Gateway (`/api/backend/*`)

---

## 👥 User Roles & Access Control

1. **Bidder (`bidder`)**:
   - Registered publicly via portal.
   - Tied to isolated `BiddingCompany`.
   - Access to bid scoping workspace (`/portal/session/[id]`) and official proposal submission (`POST /sessions/{id}/submit`).
2. **Internal Evaluator (`internal_evaluator`)**:
   - Created via CLI (`python backend/scripts/create_staff_user.py`).
   - Access to comparative matrix evaluation dashboard (`/portal/evaluator`).
3. **HR Manager (`hr_manager`)**:
   - Created via CLI (`python backend/scripts/create_staff_user.py`).
   - Access to candidate pipelines, job posting management, automated resume scoring, and candidate offer generation (`/portal/hr`).

---

## 📂 Repository Structure

```bash
/app                        # Next.js 16 App Router
  /api/backend/[...path]   # Unified Same-Origin API Gateway
  /careers                  # Public careers and application portal
  /portal                   # Authentication & role-based portals
    /dashboard              # Bidder dashboard
    /evaluator              # Internal Evaluator dashboard
    /hr                     # HR Manager Candidate & Offer portal
    /rag                    # RAG Workstation (Demo / Prototype)
    /session/[id]           # Smart Tender Scoping Workspace
/backend                    # FastAPI Application
  /app
    /agents                 # LangGraph compliance copilot
    /routers                # Auth, Tenders, HR, RAG endpoints
    /utils                  # Storage, Parsers, Rate limiting, Email
    config.py               # Environment configuration
    main.py                 # FastAPI application root & CORS
  /scripts                  # CLI management utilities (create_staff_user.py)
/components                 # UI components and ThemeProvider
/tests                      # Test suites (hr.test.ts)
DEPLOYMENT_GUIDE.md         # Production deployment & Docker setup
```

---

## 🛠️ Local Development Quickstart

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/Mac:
source .venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env`:
```env
DATABASE_URL=sqlite:///./copilot.db
JWT_SECRET=your_generated_64_char_random_secret_key
OPENAI_API_KEY=sk-your-openai-api-key
```

Run FastAPI server on port 8000 (or 8001):
```bash
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
In project root:
```bash
npm install
npm run dev -- -p 3005
```

Open [http://localhost:3005](http://localhost:3005) in browser.
