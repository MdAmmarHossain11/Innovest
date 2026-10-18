# InnoVest - Startup Investment & Fundraising Platform

![React](https://img.shields.io/badge/React-JavaScript-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.x-blue.svg)
![Django](https://img.shields.io/badge/Django-Framework-092E20?logo=django)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Profitability%20Prediction-orange)
![Status](https://img.shields.io/badge/Status-Completed-success)
![License](https://img.shields.io/badge/License-MIT-green.svg)

InnoVest is a web-based startup investment platform designed to address funding challenges by connecting entrepreneurs and startup founders with potential investors. The platform provides an interactive environment where users can launch fundraising campaigns, explore investment opportunities, communicate with stakeholders, and make informed investment decisions through machine learning-based profitability prediction.

Live Demo: https://innovest-md-ammar.vercel.app

## Key Features

- **Fundraising Management:** Entrepreneurs can create fundraising campaigns, present their startup ideas, and track fundraising progress.
- **Investor Connectivity:** Investors can explore startup opportunities, review project details, and evaluate potential investments.
- **ML-Based Profitability Prediction:** Integrates machine learning to predict startup profitability, helping investors assess opportunities and make data-informed decisions.
- **Real-Time Chat System:** Enables direct communication between entrepreneurs and investors for discussing projects, investment opportunities, and funding requirements.
- **Progress Tracking:** Fundraisers can monitor campaign progress and keep stakeholders informed about funding activities.
- **Community Posts & Discussions:** Users can publish community posts to share ideas, experiences, updates, and questions. Other users can comment on posts and reply to comments, supporting interactive discussions and community engagement.
- **AI-Powered Mini Chatbot:** An integrated chatbot that allows users to ask questions and receive helpful guidance, relevant information, and directions on using the platform, exploring investment opportunities, and accessing key features.
- **Admin Dashboard & Support:** Administrators oversee platform activities, manage users, provide support, and review fundraising campaigns. Campaigns require admin approval before publication, while admin-created campaigns follow a separate approval process.
- **Event Management & Registration:** Administrators can create and publish events related to startups, entrepreneurship, and investment opportunities. Users can explore upcoming events and register to participate, encouraging community engagement, networking, and knowledge sharing.

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
6. Configure email delivery in Render before accepting registrations. The
   preferred option is Resend's HTTPS API: set `RESEND_API_KEY` and
   `DEFAULT_FROM_EMAIL` to an address on a verified sending domain. The
   application automatically uses Resend when the API key is present. Render's
   free web services may not be able to send through SMTP; SMTP remains
   available by setting `EMAIL_BACKEND`,
   `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, and `DEFAULT_FROM_EMAIL`.
   Add credentials in the Render dashboard only; never commit them.
   Registration requires email verification, and pending accounts can request
   another verification message by submitting the same email again.
7. Configure SSLCommerz credentials in Render only if payment features are
   needed. The application defaults to payment sandbox mode.

## License

MIT
