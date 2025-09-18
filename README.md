# LiveChat Analytics (Node.js + React + MongoDB + Socket.io)

## Run with Docker
```bash
docker compose up --build
```
- Server: http://localhost:4000
- Web: http://localhost:5174

## Features
- Real-time chat using Socket.io
- Stores messages in MongoDB
- Naive sentiment scoring for dashboards

## Local Dev
- Start MongoDB (or use docker `mongo`)
- Run server:
  ```bash
  cd server && npm i && npm run dev
  ```
- Run web:
  ```bash
  cd web && npm i && npm run dev
  ```
