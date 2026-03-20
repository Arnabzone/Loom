# Loom Frontend

This folder contains the frontend for Loom, a task management web application.

## Stack

- React
- TypeScript
- Vite
- Zustand
- React Router

## Features

- Login and registration pages
- Protected dashboard routes
- Task dashboard
- Kanban-style task board
- Task creation and updates
- API integration with the backend server

## Run Frontend

Create `web/.env`:

```env
VITE_API_URL="http://localhost:4000"
```

Then run:

```bash
npm install
npm run dev
```

Frontend will be available at:

```text
http://localhost:3000
```

## Backend Requirement

The frontend depends on the backend API running at `http://localhost:4000`.

See the main project README at [README.md](/c:/Users/KIIT/Downloads/Loom/README.md) for the full project setup.

## Deploy To Vercel

Use these Vercel settings:

- Framework Preset: `Vite`
- Root Directory: `web`
- Build Command: `npm run build`
- Output Directory: `dist`

Set:

```env
VITE_API_URL="https://your-backend-url"
```

The file [vercel.json](/c:/Users/KIIT/Downloads/Loom/web/vercel.json) is included so frontend routes work correctly with React Router.
