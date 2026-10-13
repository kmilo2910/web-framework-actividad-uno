# Guía de ejecución local

Esta guía explica cómo ejecutar Nexus Campus Digital en un computador local sin utilizar las credenciales de producción.

## 1. Requisitos

- Node.js 20 o superior.
- npm.
- PostgreSQL local o una base de desarrollo en Neon.
- Una aplicación Auth0 configurada para desarrollo.

Verifica las herramientas:

```bash
node --version
npm --version
psql --version
```

## 2. Entrar al proyecto

```bash
cd app
npm install
```

## 3. Crear las variables locales

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y completa como mínimo:

```env
AUTH0_DOMAIN=tu-tenant.us.auth0.com
AUTH0_CLIENT_ID=tu-client-id
AUTH0_CLIENT_SECRET=tu-client-secret
AUTH0_SECRET=una-cadena-aleatoria-de-al-menos-32-caracteres
APP_BASE_URL=http://localhost:3000
AUTH0_AUDIENCE=https://nexus-api
DATABASE_URL=postgresql://usuario:password@localhost:5432/nexus_demo
```

Genera un secreto para Auth0 con:

```bash
openssl rand -base64 32
```

No copies el `.env.local` al repositorio ni lo compartas.

## 4. Crear la base de datos local

Si utilizas PostgreSQL local:

```bash
createdb nexus_demo
```

Configura la conexión correspondiente en `DATABASE_URL`.

Si utilizas Neon, crea una rama o proyecto de desarrollo y usa su cadena de conexión. No utilices la conexión de producción.

## 5. Cargar datos de prueba

Desde la carpeta `app`:

```bash
npm run seed
```

El seed crea la tabla `nexus_records` y carga:

- 10 libros.
- 3 espacios de coworking.

No genera usuarios, compras ni reservas. Estos registros se crean durante las pruebas de la aplicación.

> Advertencia: el seed reemplaza las colecciones `books` y `spaces`. No lo ejecutes contra producción.

## 6. Configurar Auth0

En la aplicación de desarrollo de Auth0 agrega estas URLs:

```text
Allowed Callback URLs:
http://localhost:3000/auth/callback

Allowed Logout URLs:
http://localhost:3000

Allowed Web Origins:
http://localhost:3000
```

La aplicación utiliza Google mediante Auth0. El usuario debe estar autorizado en la conexión configurada.

## 7. Levantar la aplicación

```bash
npm run dev
```

Abre:

```text
http://localhost:3000
```

## 8. Flujo de prueba

1. Abre la página principal.
2. Entra a `http://localhost:3000/login`.
3. Inicia sesión con Auth0.
4. Consulta la biblioteca.
5. Compra un libro de prueba.
6. Revisa la sección de adquisiciones.
7. Descarga la publicación y el comprobante.
8. Reserva un espacio de coworking.
9. Cancela la reserva desde “Mis reservas”.

## 9. Comandos de validación

```bash
npm run lint
npm run format:check
npm run build
```

## 10. Problemas frecuentes

### `Usuario no encontrado`

Verifica que el usuario tenga correo electrónico en Auth0. Al realizar la primera compra o reserva, la aplicación crea su registro local.

### `ECONNREFUSED` o conexión a PostgreSQL fallida

Comprueba que PostgreSQL esté activo y que `DATABASE_URL` tenga el host, puerto, base, usuario y contraseña correctos.

### `Invalid URL`

Revisa que `DATABASE_URL` sea una cadena PostgreSQL real y no un valor de ejemplo:

```text
postgresql://usuario:password@host:5432/base?sslmode=require
```

### Error de callback Auth0

Confirma que la URL sea exactamente:

```text
http://localhost:3000/auth/callback
```

## 11. Detener la aplicación

En la terminal donde se ejecuta Next.js presiona:

```text
Ctrl + C
```
