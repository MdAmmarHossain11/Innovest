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

The repository includes a Render blueprint for the Django API (`render.yaml`)
and a Vercel configuration for the React application (`vercel.json`).

1. Create a PostgreSQL database with a provider that supplies a PostgreSQL
   connection URL. Do not use the local SQLite database for a public deployment.
2. Create a Cloudflare R2 bucket for uploaded media. Render's free web-service
   filesystem is ephemeral, so uploads stored on its local disk are not durable.
3. Deploy this repository to Render using its blueprint. Configure the API's
   `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, and
   `FRONTEND_URL` environment variables. Set the R2 variables
   `AWS_STORAGE_BUCKET_NAME`, `AWS_S3_ENDPOINT_URL`, `AWS_S3_REGION_NAME`,
   `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` in Render's secret settings.
   Never put credentials in this repository.
4. Deploy the same repository to Vercel. Set the project's root directory to
   the repository root and set `REACT_APP_API_URL` to the Render API origin
   (for example, `https://innovest-api.onrender.com`).
5. Add the Vercel production origin to Render's `CORS_ALLOWED_ORIGINS` and
   `CSRF_TRUSTED_ORIGINS`; set `FRONTEND_URL` to that same origin, then redeploy
   the API.
6. Configure SMTP and SSLCommerz credentials in the Render environment if
   email or payment features are needed. Payment credentials must come from the
   site's payment account; the application defaults to sandbox mode.

The free Render API instance may sleep while idle. Its first request after an
idle period can take longer to respond. Database and object-storage providers
have their own free-tier limits and retention policies; review those before
using the deployment with real users or documents.

## Checks

```bash
python manage.py check
python manage.py test community_backend
cd frontend && npm run build
```
