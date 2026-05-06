# Frontend

This is the React + Vite frontend app.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

## API Connection

- If the backend is running separately on another URL, create `frontend/.env`
- Add `VITE_API_URL=http://localhost:5000`
- If `VITE_API_URL` is empty, Vite uses the local `/api` proxy
