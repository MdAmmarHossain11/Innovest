# Innovest

Innovest is a React and Django platform for startup discovery, investment
management, company profiles, community posts, and administration.

## Project layout

- `frontend/` - React single-page application.
- `Innovest/` - Django project settings and URL configuration.
- `authentication/`, `companies/`, `community_backend/`, and the other root
  Python packages - Django application modules.
- `ml_api/` - startup analysis and prediction endpoints.

## Local development

1. Create and activate a Python virtual environment, then install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Copy `.env.example` to `.env`, set local email/payment credentials only if
   those integrations are needed, and set a unique local `SECRET_KEY`.
3. Apply migrations and start the API:

   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

4. Install and start the frontend:

   ```bash
   cd frontend
   npm ci
   npm start
   ```

The frontend uses `http://localhost:8000` by default. Set
`REACT_APP_API_URL` to the backend origin when running it outside local
development.

## Free hosting

The intended free demo setup is Vercel for the React frontend, Render for the
Django API (`render.yaml`), and Supabase Free for PostgreSQL. Vercel and Render
provide shareable `*.vercel.app` and `*.onrender.com` URLs; free-tier uptime and
database availability are not guaranteed.

1. Create a Supabase Free project and copy its PostgreSQL connection string.
   Set that value as `DATABASE_URL` in Render. Do not use the local SQLite
   database for a public deployment.
2. Deploy this repository to Render using its blueprint. Set
   `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, and `FRONTEND_URL` in the
   Render environment; these values depend on the Vercel URL.
3. Deploy the same repository to Vercel using the repository-root
   `vercel.json`. Set `REACT_APP_API_URL` to the Render API origin (for example,
   `https://innovest-api.onrender.com`).
4. Add the Vercel production origin to Render's `CORS_ALLOWED_ORIGINS` and
   `CSRF_TRUSTED_ORIGINS`, set `FRONTEND_URL` to that origin, and redeploy the
   API.
5. Render's free filesystem is ephemeral. For durable uploaded files, configure
   Cloudflare R2 using `AWS_STORAGE_BUCKET_NAME`, `AWS_S3_ENDPOINT_URL`,
   `AWS_S3_REGION_NAME`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` in
   Render's secret settings. Never put credentials in this repository.
6. Configure SMTP and SSLCommerz credentials in Render only if email or payment
   features are needed. The application defaults to payment sandbox mode.

Render's free API service can sleep while idle, so its first request afterward
can take about a minute. Supabase Free projects have a 500 MB database limit
and can pause after a week without activity. Keep a separate backup of important
data and review provider limits before using this demo with real users or
documents. Free-plan URLs remain provider-managed and are not a service-level
guarantee of permanent availability.

## Checks

```bash
python manage.py check
python manage.py test community_backend
cd frontend && npm run build
```
