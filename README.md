# WebApp

This repository contains a small full-stack web application (called "WebApp") that demonstrates:

- Login with JWT authentication
- Profile retrieval and update
- Password hashing with bcrypt
- MongoDB (Mongoose) for storage
- Simple frontend (HTML/CSS/JS) using Bootstrap for responsive design

Features:
- Login page with username/password and error area (`public/index.html`)
- Profile page to view and edit username, email, phone and date of birth (`public/profile.html`)
- Backend endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/profile`, `PUT /api/profile`

Security notes:
- Passwords are hashed with bcrypt and not stored in plain text.
- JWT is used for authentication. Set a strong `JWT_SECRET` in production.
- HTTPS is recommended in production (provide `SSL_KEY_PATH` and `SSL_CERT_PATH` in `.env` or use a reverse proxy like nginx).

Quick start (development):

1. Copy `.env.example` to `.env` and edit values (MONGO_URI, JWT_SECRET, etc.)

2. Install dependencies:

```powershell
cd "c:\Users\SQLAdmin\Desktop\Program and Deploy Applications\WebApp"
npm install
```

3. Start the app:

```powershell
npm start
# or during development if you have nodemon
npm run dev
```

4. Register a test user (convenience endpoint):

Use a tool like curl, httpie or Postman. Example using curl (PowerShell):

```powershell
curl -Method POST -Uri http://localhost:3000/api/auth/register -Body (ConvertTo-Json @{ username='alice'; password='Secret123'; email='alice@example.com'}) -ContentType 'application/json'
```

5. Login from the web UI: open `http://localhost:3000/` and use the registered credentials. The token is stored in localStorage.

Notes and next steps:
- This scaffold uses a convenience `POST /api/auth/register` endpoint for testing. In production you may want additional checks (email verification, rate-limiting).
- For production HTTPS, provide SSL certificate/key paths in `.env` (SSL_KEY_PATH, SSL_CERT_PATH) or sit behind a TLS-terminating proxy.
- Add server-side validation and rate-limiting for stronger security.
