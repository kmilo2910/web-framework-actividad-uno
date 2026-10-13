# Nexus Campus Digital

Aplicación web universitaria construida con Next.js 15, React, Tailwind CSS, Auth0 y PostgreSQL. Incluye biblioteca, adquisiciones, descargas PDF, coworking, reservas e internacionalización.

## Requisitos

- Node.js 20 o superior.
- npm.
- PostgreSQL accesible.
- Aplicación Auth0 para desarrollo.

## Instalación

```bash
git clone https://github.com/kmilo2910/web-framework-frontend.git
cd web-framework-frontend/app
npm install
cp .env.local.example .env.local
```

## Variables de entorno

Completa `app/.env.local` con valores de desarrollo:

```env
AUTH0_DOMAIN=tu-tenant.us.auth0.com
AUTH0_CLIENT_ID=tu-client-id
AUTH0_CLIENT_SECRET=tu-client-secret
AUTH0_SECRET=una-cadena-aleatoria-de-al-menos-32-caracteres
APP_BASE_URL=http://localhost:3000
AUTH0_AUDIENCE=https://nexus-api
DATABASE_URL=postgresql://usuario:password@host:5432/base_de_datos?sslmode=require
```

### Dónde obtenerlas

- **Auth0:** Dashboard → Applications → aplicación de desarrollo → Settings.
- **`AUTH0_SECRET`:** `openssl rand -base64 32`.
- **PostgreSQL/Neon:** Dashboard → proyecto → Connection Details.

Usa una base de datos de desarrollo. No compartas credenciales de producción.

## Configurar Auth0 para localhost

En la aplicación de desarrollo de Auth0 agrega:

```text
Allowed Callback URLs:
http://localhost:3000/auth/callback

Allowed Logout URLs:
http://localhost:3000

Allowed Web Origins:
http://localhost:3000
```

El login utiliza Google mediante Auth0. El usuario debe estar autorizado en esa conexión.

## Ejecutar

```bash
npm run dev
```

Abre `http://localhost:3000` y prueba el login, biblioteca, compras, descargas, coworking y reservas.

En Vercel, configura `app` como **Root Directory** del proyecto.

## Comandos útiles

```bash
npm run lint
npm run format
npm run format:check
npm run build
npm start
```

## Arquitectura

- `src/app`: páginas y Route Handlers de Next.js.
- `src/components`: componentes reutilizables.
- `src/application`: casos de uso.
- `src/core`: contratos y lógica central.
- `src/infrastructure`: adaptadores HTTP.
- `src/server`: acceso a PostgreSQL y servicios del servidor.
- `src/i18n`: diccionarios y proveedor de idiomas.

Las rutas `/api/*` son Route Handlers de Next.js y devuelven respuestas con `code`, `message` y `data`.

## Base de datos

La aplicación usa la tabla `nexus_records`. Para crear la tabla y cargar libros y espacios de prueba:

```bash
npm run seed
```

El seed elimina y vuelve a crear únicamente las colecciones `books` y `spaces`. No crea usuarios, compras ni reservas. No lo ejecutes sobre producción porque reemplaza esas dos colecciones.

## Seguridad

Nunca subas ni compartas:

```text
.env.local
node_modules/
.next/
```

El archivo `.env.local` está ignorado por Git. Comparte únicamente `.env.local.example` y valores de desarrollo.

## Git

```bash
git checkout -b feature/nombre-del-cambio
git add .
git commit -m "describir cambio"
git push origin feature/nombre-del-cambio
```

Integra cambios mediante pull request hacia `main` después de ejecutar lint y build.
