<<<<<<< HEAD
# TaskFlow — Full-Stack Task Management System

A full-stack task manager built for the Founders Key LLP assignment. It includes account registration, JWT authentication, user-specific task CRUD, status filtering, search, PostgreSQL persistence, and a responsive React interface.

## Tech stack

- **Frontend:** React 18, TypeScript, Vite, Axios, React Router
- **Backend:** Node.js, Express, TypeScript, Zod validation
- **Database / ORM:** PostgreSQL, Prisma
- **Authentication:** JWT + bcrypt password hashing
- **Security basics:** Helmet, CORS allowlist, authentication rate limit, per-user task ownership checks
- **Deployment:** Netlify frontend; Render (or another Node host) backend; managed PostgreSQL database

## Project structure

```text
task-management-system/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── lib/prisma.ts
│   │   ├── middleware/auth.ts
│   │   ├── routes/auth.ts
│   │   ├── routes/tasks.ts
│   │   ├── server.ts
│   │   └── types.d.ts
│   ├── .env.example
│   ├── package.json
│   └── render.yaml
├── frontend/
│   ├── src/components/
│   ├── src/context/AuthContext.tsx
│   ├── src/pages/
│   ├── src/services/api.ts
│   ├── src/main.tsx
│   ├── src/styles.css
│   ├── .env.example
│   └── netlify.toml
└── README.md
```

## Prerequisites

- Node.js 20 or newer and npm
- PostgreSQL 14 or newer (local or hosted)

## 1. Configure PostgreSQL

Create a database named `task_manager` in PostgreSQL, or create a hosted PostgreSQL database and copy its connection string.

## 2. Configure and start the backend

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env`, then set:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/task_manager?schema=public"
JWT_SECRET="a-long-random-secret-at-least-32-characters"
JWT_EXPIRES_IN="7d"
PORT=5000
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
```

Generate Prisma Client and create the database tables:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Start the API:

```bash
npm run dev
```

API runs at `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

## 3. Configure and start the frontend

In a second terminal:

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start Vite:

```bash
npm run dev
```

Open `http://localhost:5173`.

## API endpoints

All request and response bodies use JSON. Task routes require `Authorization: Bearer <JWT>`.

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create user account | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/tasks` | List current user's tasks; optional `?status=TODO`, `IN_PROGRESS`, `COMPLETED`, or `ALL` | Yes |
| POST | `/api/tasks` | Create task | Yes |
| PUT | `/api/tasks/:id` | Update task title, description, and/or status | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |
| GET | `/api/health` | API health check | No |

### Example task payload

```json
{
  "title": "Prepare project demo",
  "description": "Test registration, login and task actions",
  "status": "IN_PROGRESS"
}
```

Valid statuses are `TODO`, `IN_PROGRESS`, and `COMPLETED`.

## 4. Deploy backend

1. Push this project to a GitLab repository.
2. Create a managed PostgreSQL database (for example, Render PostgreSQL or Neon).
3. Create a Render Web Service from the repository and set its root directory to `backend`.
4. Build command: `npm install && npx prisma generate && npm run build`
5. Start command: `npx prisma migrate deploy && npm start`
6. Add environment variables `DATABASE_URL`, `JWT_SECRET` (use a long random value), `JWT_EXPIRES_IN=7d`, `NODE_ENV=production`, and `CLIENT_URL` set to your deployed Netlify URL.
7. Deploy and test `https://YOUR-API-HOST/api/health`.

The included `backend/render.yaml` can be used as a starting point. Confirm the root directory and environment variables in the Render dashboard.

## 5. Deploy frontend to Netlify

1. Create a Netlify site from the GitLab repository (or deploy the `frontend` folder as the site base directory).
2. Set base directory to `frontend`, build command to `npm run build`, and publish directory to `dist`.
3. Add the environment variable `VITE_API_URL=https://YOUR-API-HOST/api`.
4. Deploy the site.
5. Add the exact Netlify site URL to backend `CLIENT_URL` and redeploy the backend.
6. Test signup, login, task creation, editing, status changes, filtering and deletion on the deployed URL.

`frontend/netlify.toml` includes the SPA redirect needed by React Router.

## 6. GitLab submission

Create a **public GitLab repository** (the assignment asks for GitLab, not GitHub), push the project, then invite `sourcecode445@gmail.com` with the access level requested by the recruiter (Developer or higher if they need to inspect the code). Do not submit a GitHub URL in place of the GitLab URL.

Example commands:

```bash
git init
git add .
git commit -m "Build full-stack task management system"
git branch -M main
git remote add origin https://gitlab.com/YOUR-USERNAME/task-management-system.git
git push -u origin main
```

## 7. Final submission checklist

- [ ] ZIP of source code
- [ ] Live Netlify frontend URL
- [ ] GitLab repository URL, with `sourcecode445@gmail.com` invited
- [ ] Screen recording showing the **deployed website**, not localhost

Suggested recording: register a new account, log out and log in, create a task, edit its details, change its status, filter by each status, search for a task, delete a task, and show that a second user cannot see the first user's tasks.

## Notes

- The JWT is stored in browser `localStorage` because the assignment explicitly permits it. For a production system with a higher security requirement, consider secure, HttpOnly, SameSite cookies and CSRF protection.
- Never commit `.env` files, real database credentials, or production JWT secrets.
- The backend must be deployed separately from Netlify because Netlify is hosting the React static frontend in this setup.
- This project includes source code and deployment configuration; it does not create hosting accounts, publish a live site, or push to GitLab automatically.
=======
# Task-Management-System-
>>>>>>> 8757f14b92d27a3ca166701fb925af9ed9140e28
