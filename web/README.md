# Loom Frontend

This folder contains the frontend for Loom, a task management web application.

## Stack

- React
- TypeScript
- Vite
- Zustand
- React Router

## Features

- Authentication flow
- Task dashboard and kanban board
- Task creation and updates
- Backend API integration

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
