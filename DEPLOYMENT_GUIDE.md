# Indusnet AI — Production Deployment Guide

This guide details instructions for setting up, configuring, and deploying the Indusnet AI platform (Next.js frontend + FastAPI backend) in production environments.

---

## 🔒 1. Security & Key Secrets Configuration

### Generating a Secure JWT Secret
Do **NOT** use default or placeholder keys in production. Generate a strong 64-character random key using OpenSSL or Python:

```bash
openssl rand -hex 32
```
Or via Python:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Save this value as `JWT_SECRET` in `backend/.env` or server environment variables.

---

## ⚙️ 2. Environment Variables Reference

| Variable Name | Required | Default / Description |
|---|---|---|
| `JWT_SECRET` | **Yes** | 64-char secret key for JWT token signing. **No default; app will fail to start without it.** |
| `DATABASE_URL` | Yes | `sqlite:///./copilot.db` (Default SQLite) or Supabase PostgreSQL URI `postgresql://user:pass@host:5432/dbname`. |
| `OPENAI_API_KEY` | Optional | OpenAI API key (`sk-...`). If empty, AI resume parsing and tender matrix extraction return clear unavailable status instead of fake data. |
| `RESEND_API_KEY` | Optional | Resend transactional email API key (`re_...`). If omitted, contact submissions write to DB and log diagnostic email previews safely. |
| `BACKEND_CORS_ORIGINS` | Optional | Comma-separated CORS origins (e.g. `http://localhost:3000,http://localhost:3005,https://indusnetai.com`). |
| `BACKEND_INTERNAL_URL` | Optional | Internal URL for Next.js API gateway proxy (e.g. `http://127.0.0.1:8000`). |

---

## 👤 3. Staff & Internal User Provisioning

Public user registration produces **Bidder** accounts with isolated company IDs. Staff users (**HR Manager** and **Internal Evaluator**) cannot be registered publicly and must be created via CLI:

### Creating HR Managers or Internal Evaluators

```bash
cd backend
python scripts/create_staff_user.py --email hr.admin@indusnet-ai.com --password "SecurePassword123!" --role hr_manager --name "HR Manager"
```

For Internal Evaluators:
```bash
python scripts/create_staff_user.py --email evaluator@indusnet-ai.com --password "SecurePassword123!" --role internal_evaluator --name "Technical Evaluator"
```

---

## 🐳 4. Docker Compose Production Deployment

### 1. Configure Production Environment Files
Create `.env` inside `backend/`:
```env
DATABASE_URL=sqlite:///./copilot.db
JWT_SECRET=YOUR_64_CHAR_GENERATED_JWT_SECRET
OPENAI_API_KEY=sk-...
BACKEND_CORS_ORIGINS=https://indusnetai.com,https://www.indusnetai.com
```

### 2. Build & Launch Containers
```bash
docker compose up -d --build
```

### 3. Verify Container Health
```bash
docker compose ps
```

---

## 🌐 5. Nginx Reverse Proxy & SSL Configuration

Example Nginx server block for `indusnetai.com`:

```nginx
server {
    listen 80;
    server_name indusnetai.com www.indusnetai.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name indusnetai.com www.indusnetai.com;

    ssl_certificate /etc/letsencrypt/live/indusnetai.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/indusnetai.com/privkey.pem;

    # Forward all traffic to Next.js (port 3005 or 3000)
    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
