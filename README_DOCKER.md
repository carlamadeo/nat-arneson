# Docker quickstart

## 1) Backend env vars
Copiá `server/.env.example` a `server/.env` y completá:
- GOOGLE_CLIENT_EMAIL
- GOOGLE_PRIVATE_KEY (con los \n escapados)
- GOOGLE_CALENDAR_ID
- TIMEZONE (ej: America/Argentina/Buenos_Aires)
- PORT=3001

## 2) Levantar todo
```bash
docker compose up --build
```
- Frontend: http://localhost:5173
- Backend:  http://localhost:3001

El frontend hace fetch a `http://localhost:3001` (definido en `VITE_API_BASE`).

## 3) Desarrollo sin Docker (opcional)
- Terminal A:
  ```bash
  cd server && npm i && npm start
  ```
- Terminal B:
  ```bash
  npm i && npm run dev
  ```