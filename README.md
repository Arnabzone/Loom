# Loom

Loom is a full-stack task management application with a modern frontend and a production-style backend. It supports authentication, task organization, task status tracking, and a kanban-style workflow for managing day-to-day work.

## Demo

Project demo:

https://www.youtube.com/watch?v=homWlNSsEEg

## Tech Stack

- Frontend: React, TypeScript, Vite, Zustand, React Router
- Backend: Node.js, TypeScript, Express
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT access token + refresh token
- Validation: Zod

## Features

- Secure authentication with register, login, logout, and refresh token flow
- Core task management with create, update, delete, search, and status tracking
- Kanban-style workflow with `todo`, `in-progress`, and `done` columns
- Production-style backend with Express, Prisma, PostgreSQL, validation, and error handling

## Prerequisites

Make sure you have these installed:

- Node.js 20+
- npm
- Docker Desktop

## Environment Setup

### Backend

Create `server/.env` from `server/.env.example`.

Recommended local backend config:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/loom_db?schema=public"
PORT=4000
NODE_ENV=development
CLIENT_ORIGIN="http://localhost:3000"
JWT_ACCESS_SECRET="replace-with-a-long-access-secret"
JWT_REFRESH_SECRET="replace-with-a-long-refresh-secret"
ACCESS_TOKEN_TTL="15m"
REFRESH_TOKEN_TTL_DAYS=30
```

### Frontend

Create `web/.env` from `web/.env.example`.

```env
VITE_API_URL="http://localhost:4000"
```

## How To Run The Project

### 1. Start PostgreSQL

From the `server` folder:

```bash
docker compose up -d postgres
```

This project is configured to use PostgreSQL from Docker on:

- Host: `localhost`
- Port: `5433`
- Database: `loom_db`

### 2. Install Dependencies

Backend:

```bash
cd server
npm install
```

Frontend:

```bash
cd web
npm install
```

### 3. Create The Database Schema

If Prisma is working normally in your environment, run:

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
```

If you already created the schema manually or are continuing from an existing local setup, you can skip migration if the tables already exist.

### 4. Run The Backend

```bash
cd server
npm run dev
```

Backend runs at:

```text
http://localhost:4000
```

Health check:

```text
http://localhost:4000/health
```

### 5. Run The Frontend

```bash
cd web
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```


## Default Local Flow

Once both frontend and backend are running:

1. Open `http://localhost:3000`
2. Register a new account
3. Log in
4. Create and manage tasks from the dashboard

## Main API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### Tasks

- `GET /tasks`
- `POST /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `PATCH /tasks/:id/toggle`

## Example Task Query

```text
/tasks?page=1&limit=10&status=done&search=design
```

## Troubleshooting

### App stays on login page

- Make sure backend is running on `http://localhost:4000`
- Make sure frontend is using `VITE_API_URL=http://localhost:4000`
- Make sure PostgreSQL container is running on `localhost:5433`
- Make sure `loom_db` exists
- If login fails, register a new account first

### Backend cannot connect to database

Check that `server/.env` uses:

```env
DATABASE_URL="postgresql://<db_user>:<db_password>@localhost:5433/loom_db?schema=public"
```

Then confirm Docker is running:

```bash
cd server
docker compose ps
```

### Backend health check

If the backend is up, this should respond:

```bash
curl http://localhost:4000/health
```

## Scripts

### Backend

- `npm run dev` - start development server
- `npm run build` - build backend
- `npm run start` - start built backend
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - run Prisma migration

### Frontend

- `npm run dev` - start Vite dev server
- `npm run build` - build frontend
- `npm run lint` - TypeScript check

## Notes

- The backend expects JWT access tokens in the `Authorization` header.
- Refresh token flow uses cookies.
- CORS is configured for the frontend origin defined in `CLIENT_ORIGIN`.
