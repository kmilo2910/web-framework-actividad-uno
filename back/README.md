# Nexus Backend

API REST para la aplicación Nexus. Usa Express y arquitectura hexagonal limpia. La persistencia local en `data/db.json` es un adaptador reemplazable; los datos iniciales están en `data/seed.json`.

## Arquitectura

- `domain`: errores y reglas independientes de Express.
- `application`: casos de uso y servicios.
- `adapters/http`: controladores, rutas y middleware HTTP.
- `adapters/json`: adaptador de persistencia local.
- `adapters/firebase`: adaptador de Firebase Admin para validar tokens.
- `application/auth.service.js`: caso de uso de autenticación y usuarios.
- `app.js`: composición de dependencias.
- `server.js`: punto de entrada del proceso.

## Ejecutar

```bash
npm install
cp .env.example .env
npm run dev
```

La API queda disponible en `http://localhost:4000`.

## Recursos

`books`, `users`, `spaces`, `purchases` y `reservations` tienen endpoints `GET`, `GET /:id`, `POST`, `PATCH /:id` y `DELETE /:id`.

Endpoints adicionales: `GET /api/books/bestsellers/top`, `GET /api/health`, `GET /api/auth/google`, `GET /api/auth/me` y `POST /api/auth/logout`.

## Firebase Authentication

Coloca la clave privada descargada desde Firebase en:

`back/secrets/firebase-service-account.json`

O configura otra ruta con `FIREBASE_SERVICE_ACCOUNT_PATH`. El backend valida los tokens Firebase enviados en:

`Authorization: Bearer <ID_TOKEN>`

El endpoint `GET /api/auth/me` verifica el token y crea o actualiza el usuario local. Nunca subas la clave privada, el archivo `.env` ni la carpeta `secrets` al repositorio.
