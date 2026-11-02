# ReThread — Clothing Exchange & Swap Marketplace

A full-stack implementation matching the project PRD: Django REST Framework
backend, React (Vite) frontend, swap request lifecycle, negotiation chat,
value calculator, and an admin panel.

Tested end-to-end (auth, listing CRUD, value calculator, swap propose →
accept → chat → complete) before delivery.

## Stack

- **Backend:** Django 5 + Django REST Framework, JWT auth (SimpleJWT),
  SQLite by default / PostgreSQL-ready
- **Frontend:** React 18 + Vite, React Router, plain CSS (no build-heavy
  UI framework, matches the earlier design system)

## Project structure

```
rethread-fullstack/
├── server/
│   ├── rethread/          # Django project settings/urls
│   ├── accounts/          # Custom User model, auth, admin stats
│   ├── listings/          # Listing model, value calculator, CRUD API
│   ├── swaps/              # SwapRequest + ChatMessage, lifecycle actions
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
└── client/
    ├── src/
    │   ├── pages/          # Browse, ItemDetail, AddListing, Dashboard,
    │   │                     SwapChat, Admin, Auth
    │   ├── components/     # Nav, ListingCard
    │   ├── context/        # AuthContext (JWT session)
    │   ├── api.js           # fetch wrapper w/ token refresh
    │   └── index.css        # design system (paper/thread theme)
    ├── package.json
    └── .env.example
```

## 1. Backend setup

```bash
cd server
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # defaults to SQLite, works out of the box

python manage.py migrate
python manage.py createsuperuser # optional, for /admin/ access
python manage.py seed_demo       # optional: 3 demo users + 6 demo listings
python manage.py runserver 8000
```

Backend now runs at `http://127.0.0.1:8000`. Django's built-in admin site
(`/admin/`) is the platform's Admin Module — manage users, listings, and
swaps, resolve disputes, and view records with full detail.

Demo accounts created by `seed_demo` (password `seed12345` for all):
- meera@example.com
- arjun@example.com
- divya@example.com

**The first person to register through the app (not via seed_demo) note:**
admin access in the React "Admin" tab is granted via Django's `is_staff`
flag — set it on a user via `createsuperuser` or the Django admin site.

### Switching to PostgreSQL

Set in `.env`:
```
USE_POSTGRES=True
POSTGRES_DB=rethread
POSTGRES_USER=rethread
POSTGRES_PASSWORD=your-password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```
Then re-run `python manage.py migrate`.

## 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env    # points at http://127.0.0.1:8000/api by default
npm run dev
```

Frontend runs at `http://localhost:5173` and talks to the Django API.
CORS is already configured on the backend for this origin.

For production build: `npm run build` outputs to `client/dist/`.

## API overview

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/register/` | POST | Create account |
| `/api/auth/login/` | POST | Get JWT access/refresh tokens |
| `/api/auth/refresh/` | POST | Refresh access token |
| `/api/auth/me/` | GET | Current user |
| `/api/listings/` | GET, POST | Browse / create listings |
| `/api/listings/<id>/` | GET, DELETE | Item detail / delist |
| `/api/listings/value-preview/` | POST | Live value calculator |
| `/api/swaps/` | GET, POST | My swaps / propose a swap |
| `/api/swaps/<id>/accept/` | POST | Owner accepts |
| `/api/swaps/<id>/reject/` | POST | Owner declines |
| `/api/swaps/<id>/complete/` | POST | Mark swap complete |
| `/api/swaps/<id>/send_message/` | POST | Chat message on a swap |
| `/api/admin/stats/` | GET | Platform stats (staff only) |

## Value calculator logic

`listings/utils.py` — `compute_swap_value(category, brand_tier, condition)`:
a base value per category, plus a brand-tier bonus, multiplied by a
condition factor. Runs both server-side (on save, and on the live preview
endpoint) so the value shown while listing always matches what's stored.

## Deployment notes (for the "live deployed link" requirement)

- **Backend:** Render, Railway, or Fly.io all support Django + Postgres
  cleanly. Set `DJANGO_DEBUG=False`, add your domain to
  `DJANGO_ALLOWED_HOSTS`, and add your frontend's deployed URL to
  `CORS_ALLOWED_ORIGINS`.
- **Frontend:** Vercel or Netlify — just point `VITE_API_BASE` at your
  deployed backend's `/api` URL and run `npm run build`.
