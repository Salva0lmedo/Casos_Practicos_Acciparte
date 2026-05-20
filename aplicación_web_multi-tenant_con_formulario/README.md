# Aplicación Web Multi-Tenant con Formulario

Aplicación web con autenticación, soporte multi-tenant y formulario en dos pasos.  
Stack: **React** (frontend) · **Node.js + Express** (backend) · **PostgreSQL** (base de datos)

---

## Requisitos previos

Antes de empezar, instala estos programas si no los tienes:

| Programa | Para qué sirve | Descarga |
|----------|---------------|---------|
| **Node.js 18+** | Ejecutar el backend y el frontend | https://nodejs.org → botón "LTS" |
| **PostgreSQL 16** | Base de datos | https://www.enterprisedb.com/downloads/postgres-postgresql-downloads → Windows x86-64 |

> Durante la instalación de PostgreSQL, anota bien la contraseña que pongas al usuario `postgres`. La necesitarás más adelante.

---

## Instalación paso a paso

### Paso 1 — Abrir PowerShell

Pulsa `Win + X` → selecciona **Terminal Windows** o **PowerShell**.  
Navega hasta la carpeta del proyecto:

```powershell
cd "C:\ruta\donde\descargaste\el\proyecto"
```

---

### Paso 2 — Crear la base de datos

Ejecuta estos dos comandos **uno a uno** en PowerShell.  
Reemplaza `TU_PASSWORD` por la contraseña que pusiste al instalar PostgreSQL.

```powershell
$env:PGPASSWORD = "TU_PASSWORD"
```

```powershell
& "C:\Program Files\PostgreSQL\16\bin\createdb.exe" -U postgres multitenant
```

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d multitenant -f "backend\migrations\001_init.sql"
```

**Resultado esperado** del último comando:
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE INDEX
```

Si ves eso, la base de datos está lista.

---

### Paso 3 — Configurar el backend

Crea el archivo de configuración copiando el ejemplo:

```powershell
Copy-Item "backend\.env.example" "backend\.env"
```

Abre el archivo `backend\.env` con el Bloc de notas:

```powershell
notepad "backend\.env"
```

Edita las tres líneas con tus datos:

```
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/multitenant
JWT_SECRET=pon_aqui_cualquier_frase_larga_y_secreta
PORT=3001
```

Guarda y cierra el Bloc de notas.

---

### Paso 4 — Instalar y arrancar el backend

Abre **una nueva ventana de PowerShell** y ejecuta:

```powershell
cd "C:\ruta\del\proyecto\backend"
npm install
npm run dev
```

**Resultado esperado:**
```
Server on port 3001
```

Deja esta ventana abierta.

---

### Paso 5 — Instalar y arrancar el frontend

Abre **otra ventana de PowerShell nueva** y ejecuta:

```powershell
cd "C:\ruta\del\proyecto\frontend"
npm install
npm run dev
```

**Resultado esperado:**
```
VITE v5.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Deja esta ventana abierta también.

---

### Paso 6 — Abrir la aplicación

Abre el navegador y ve a:

```
http://localhost:5173
```

---

## Cómo usar la aplicación

### Registrarse por primera vez

1. En el campo **Organización**, escribe el nombre de tu empresa (ej: `mi-empresa`). Este es el identificador del tenant.
2. Introduce un **email** y una **contraseña** (mínimo 8 caracteres).
3. Pulsa **Registrarse**.

> Puedes crear varias organizaciones distintas. Los datos de cada una están completamente separados.

### Iniciar sesión

1. Introduce la misma **Organización**, **email** y **contraseña** que usaste al registrarte.
2. Pulsa **Entrar**.

### Rellenar el formulario

- **Paso 1:** Nombre, apellidos y lugar del incidente → pulsa **Siguiente**.
- **Paso 2:** Selecciona el tipo de intervención haciendo clic en una de las tarjetas → pulsa **Enviar formulario**.

### Promover usuario a admin

Por defecto todos los usuarios se crean con `role='user'`. Para dar permisos de admin (acceso a todos los submissions del tenant), ejecuta en PowerShell (cambia `TU_PASSWORD` y el email):

```powershell
$env:PGPASSWORD = "TU_PASSWORD"
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d multitenant -c "UPDATE users SET role='admin' WHERE email='admin@empresa.com';"
```

El usuario verá todos los submissions del tenant en el GET `/api/submissions` tras su próximo login.

---

## Verificar registros guardados

Para ver los datos almacenados en la base de datos, copia y pega este bloque completo en PowerShell (cambia `TU_PASSWORD`):

```powershell
$env:PGPASSWORD = "TU_PASSWORD"; $psql = "C:\Program Files\PostgreSQL\16\bin\psql.exe"; Write-Host "`n=== TENANTS ===" -ForegroundColor Cyan; & $psql -U postgres -d multitenant -c "SELECT * FROM tenants;"; Write-Host "`n=== USUARIOS ===" -ForegroundColor Cyan; & $psql -U postgres -d multitenant -c "SELECT u.id, u.email, t.slug AS tenant, u.role, u.created_at FROM users u JOIN tenants t ON t.id = u.tenant_id;"; Write-Host "`n=== SUBMISSIONS ===" -ForegroundColor Cyan; & $psql -U postgres -d multitenant -c "SELECT id, tenant_id, user_id, nombre, apellidos, lugar, tipo_intervencion, created_at FROM submissions ORDER BY created_at DESC;"
```

También puedes verlos en **pgAdmin** (se instala junto a PostgreSQL):  
`Servers → PostgreSQL 16 → Databases → multitenant → Schemas → public → Tables → submissions`  
Clic derecho → **View/Edit Data → All Rows**

---

## Solución de errores frecuentes

| Error | Causa | Solución |
|-------|-------|---------|
| `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL no está arrancado | Abre `services.msc` → busca `postgresql-x64-16` → Start |
| `password authentication failed` | Contraseña incorrecta en `.env` | Comprueba `DATABASE_URL` en `backend\.env` |
| `"vite" no se reconoce` | No se ejecutó `npm install` | Ejecuta `npm install` dentro de la carpeta `frontend` |
| `"nodemon" no se reconoce` | No se ejecutó `npm install` | Ejecuta `npm install` dentro de la carpeta `backend` |
| Puerto 3001 ocupado | Otro proceso usa ese puerto | Cambia `PORT=3002` en `backend\.env` |

---

## Documentación técnica

### Modelo de datos

```
tenants
  id           SERIAL PRIMARY KEY
  name         VARCHAR(100)
  slug         VARCHAR(50) UNIQUE      ← identificador del tenant (ej: "mi-empresa")
  created_at   TIMESTAMPTZ

users
  id           SERIAL PRIMARY KEY
  tenant_id    FK → tenants(id)
  email        VARCHAR(255)
  password_hash VARCHAR(255)           ← nunca se guarda la contraseña en texto plano
  role         VARCHAR(20) DEFAULT 'user'
  created_at   TIMESTAMPTZ
  UNIQUE(tenant_id, email)             ← mismo email puede existir en 2 tenants distintos

submissions
  id                SERIAL PRIMARY KEY
  tenant_id         FK → tenants(id)
  user_id           FK → users(id)
  nombre            VARCHAR(100)
  apellidos         VARCHAR(100)
  lugar             VARCHAR(100)
  tipo_intervencion VARCHAR(100)
  created_at        TIMESTAMPTZ
```

---

### Endpoints de la API

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|-------------|
| POST | `/api/auth/register` | No | Crea tenant (si no existe) + usuario |
| POST | `/api/auth/login` | No | Autentica y devuelve cookie JWT `httpOnly` |
| POST | `/api/auth/logout` | No | Borra la cookie JWT |
| POST | `/api/submissions` | Cookie JWT | Guarda un formulario |
| GET  | `/api/submissions` | Cookie JWT | Lista submissions: admin → todos del tenant · user → solo los suyos |

**Ejemplo — Login:**
```json
POST /api/auth/login
{
  "email": "usuario@empresa.com",
  "password": "micontraseña",
  "tenantSlug": "mi-empresa"
}
→ Set-Cookie: token=<jwt>; HttpOnly; SameSite=Strict
→ { "tenantSlug": "mi-empresa" }
```

**Ejemplo — Enviar formulario (cookie se envía automáticamente):**
```json
POST /api/submissions
{
  "nombre": "Juan",
  "apellidos": "García López",
  "lugar": "Calle Mayor 12, Madrid",
  "tipo_intervencion": "Urgencia médica"
}
```

---

### Aislamiento multi-tenant

Cada usuario pertenece a un tenant. Los datos de un tenant nunca son visibles para otro.

**Cómo funciona:**

1. Al hacer login se incluye `tenantSlug` → el backend verifica que email + tenant coincidan en BD.
2. El JWT firmado contiene `{ userId, tenantId, role }`. El cliente no puede modificarlo (está firmado con `JWT_SECRET`).
3. El middleware `auth.js` verifica el JWT en cada petición protegida.
4. Todas las queries usan `WHERE tenant_id = $1` con el `tenantId` extraído del token, **nunca del body**:

```js
const { userId, tenantId } = req.user;  // viene del JWT verificado
db.query('SELECT * FROM submissions WHERE tenant_id = $1', [tenantId]);
```

5. `UNIQUE(tenant_id, email)` permite que `admin@empresa.com` exista en dos tenants distintos sin conflicto.

---

### Criterios de evaluación

#### Organización del código

Separación en dos capas independientes con responsabilidad única por archivo:

```
backend/
  src/
    config/db.js          ← conexión PostgreSQL (Pool)
    middleware/auth.js    ← verificación JWT, único punto de entrada protegido
    routes/auth.js        ← POST /register, POST /login
    routes/submissions.js ← POST /, GET / (protegidas por middleware)
  migrations/001_init.sql ← esquema SQL versionado
  .env                    ← secretos fuera del código

frontend/
  src/
    api.js                ← todas las llamadas HTTP centralizadas
    pages/Login.jsx       ← autenticación con validación Zod
    pages/FormPage.jsx    ← stepper + lógica de envío
    components/StepOne    ← campos de texto con React Hook Form
    components/StepTwo    ← radio cards de selección
    App.jsx               ← routing y protección de rutas privadas
```

#### Diseño de la base de datos

- Tres tablas normalizadas con claves foráneas y `ON DELETE CASCADE`.
- `UNIQUE(tenant_id, email)`: el email es único dentro del tenant, no globalmente.
- Índices en `tenant_id` de `users` y `submissions` para acelerar consultas filtradas.
- `TIMESTAMPTZ` para timestamps con zona horaria correcta.

#### Seguridad de la autenticación y autorización

- Contraseñas hasheadas con `bcryptjs` (cost factor 10). Nunca se almacena texto plano.
- Longitud mínima de contraseña (≥8 caracteres) validada en backend — no depende del frontend.
- JWT con expiración de 24h firmado con secreto de entorno. Payload: `{ userId, tenantId, role }`.
- `tenantId` en las queries siempre del token verificado, nunca aceptado del cliente.
- Autorización por rol: `role=admin` accede a todos los submissions del tenant; `role=user` solo a los propios.
- Validación de campos en backend independiente del frontend (el frontend puede ser manipulado).

#### Decisiones técnicas clave

- **JWT en cookie `httpOnly`, no `localStorage`**: JS del cliente no puede leer la cookie → inmune a XSS. `localStorage` es accesible desde cualquier script inyectado en la página.
- **Sin ORM (sin Sequelize/Prisma)**: queries SQL directas son legibles, auditables y sin comportamiento implícito. Para este tamaño de proyecto, un ORM añade complejidad sin beneficio real.
- **`tenantId` del JWT verificado, nunca del body**: si aceptáramos `tenantId` del cliente, cualquier usuario podría cambiar su tenant en la petición. El token está firmado con `JWT_SECRET` — el cliente no puede modificarlo.
- **bcrypt cost factor 10**: por debajo es demasiado rápido (vulnerable a fuerza bruta); por encima el login se vuelve lento para el usuario. 10 es el balance estándar en aplicaciones web.
- **`pg.Pool`, no una conexión por query**: abrir una conexión TCP + autenticación PostgreSQL por cada request sería un cuello de botella bajo carga. El pool reutiliza conexiones ya abiertas.
- **`UNIQUE(tenant_id, email)`, no `UNIQUE(email)` global**: el mismo email puede existir en dos organizaciones distintas. Un unique global impediría que `admin@empresa.com` se registre en dos tenants diferentes.

#### Claridad general de la solución

Stack mínimo sin abstracciones innecesarias: Express sin ORM (queries SQL directas y legibles), React sin Redux (estado local), PostgreSQL sin configuración adicional de RLS (el filtro explícito por `tenant_id` es suficiente y auditable).
