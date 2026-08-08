# Instructions for AI Agents / Antigravity Assistant

If the user asks to **run**, **start**, or **launch** this application, follow these exact steps:

---

## Step 1: Install Dependencies & Start Backend (NestJS + SQLite)

1. Open a background task in `sample-project/backend`:
   ```bash
   cd backend
   npm install
   node node_modules/typescript/bin/tsc
   node dist/main.js
   ```
2. Verify that the backend server is running on `http://localhost:3000/api`.

---

## Step 2: Install Dependencies & Start Frontend (React + Vite)

1. Open a background task in `sample-project/frontend`:
   ```bash
   cd frontend
   npm install
   npx vite --port 5173
   ```
2. Check the output log to confirm which port Vite bound to (usually `http://localhost:5173` or `http://localhost:5174`).

---

## Step 3: Provide the URL Link to the User

Respond clearly to the user with a clickable link to access the running application interface, for example:

> "La aplicación ha sido iniciada exitosamente. Puedes acceder al frontend en el siguiente enlace: **[http://localhost:5173](http://localhost:5173)**"
