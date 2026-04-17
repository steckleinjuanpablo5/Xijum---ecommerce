# Xijúm Ecommerce

Plataforma de comercio electrónico full-stack para una marca de papelería creativa.  
Incluye frontend estático listo para GitHub Pages, backend API con Node.js/Express, base de datos PostgreSQL, autenticación con JWT, recuperación de contraseña, carrito, checkout con Stripe en modo prueba, perfil de usuario, historial de pedidos y panel de administración.

---

## 1. Stack tecnológico

### Frontend
- HTML semántico
- CSS responsivo
- JavaScript modular (vanilla ES Modules)

### Backend
- Node.js + Express
- JWT para autenticación
- bcryptjs para contraseñas
- Stripe Checkout para cobros de prueba
- Nodemailer para recuperación de contraseña

### Base de datos
- PostgreSQL
- Scripts SQL de esquema y semilla

---

## 2. Estructura del proyecto

```txt
xijum-ecommerce/
├── frontend/
│   ├── index.html
│   ├── css/
│   └── js/
├── backend/
│   ├── package.json
│   └── src/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── config/
│   └── .env.example
├── public/
│   ├── logo.svg
│   └── images/
├── docs/
│   └── README.md
├── .github/
│   └── workflows/
├── .gitignore
└── package.json
```

---

## 3. Qué incluye funcionalmente

### Tienda
- Catálogo con búsqueda, filtros y ordenamiento
- Fichas de producto con descripción, precio, stock y reseñas
- Carrito con actualización de cantidades
- Resumen de compra con subtotal, envío, impuestos y total
- Checkout con Stripe Checkout en modo prueba

### Usuarios
- Registro
- Inicio de sesión
- Recuperación de contraseña
- Actualización de perfil
- Historial de pedidos

### Administración
- Dashboard con métricas
- Gestión de pedidos y estatus
- Gestión de productos
- Gestión de usuarios y roles

---

## 4. Requisitos previos

Instala lo siguiente:

- Node.js 20+ (Node 22 funciona bien)
- PostgreSQL 14+
- Cuenta de Stripe para modo prueba
- Opcional: una cuenta SMTP para correos reales
- Opcional: Render para desplegar el backend

---

## 5. Configuración local

### 5.1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/xijum-ecommerce.git
cd xijum-ecommerce
```

### 5.2. Configurar variables de entorno
Copia `config/.env.example` a `config/.env` y ajusta valores:

```bash
cp config/.env.example config/.env
```

Variables importantes:
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

---

## 6. Base de datos

### 6.1. Crear la base
Ejemplo en PostgreSQL:

```sql
CREATE DATABASE xijum_store;
```

### 6.2. Cargar esquema y datos semilla
```bash
psql "postgres://postgres:postgres@localhost:5432/xijum_store" -f database/schema.sql
psql "postgres://postgres:postgres@localhost:5432/xijum_store" -f database/seed.sql
```

Eso crea:
- tablas
- índices
- usuarios demo
- categorías
- productos reales con precios de venta
- reseñas de ejemplo

---

## 7. Levantar backend

### 7.1. Instalar dependencias
```bash
npm run backend:install
```

### 7.2. Ejecutar en desarrollo
```bash
npm run backend:dev
```

La API quedará en:
```txt
http://localhost:4000/api
```

Health check:
```txt
http://localhost:4000/api/health
```

---

## 8. Levantar frontend

Como es estático, tienes dos opciones:

### Opción A: abrir directamente
Puedes abrir `frontend/index.html`, pero para evitar problemas de CORS en algunos navegadores conviene servirlo localmente.

### Opción B: con Live Server en VS Code
1. Instala la extensión **Live Server**
2. Abre `frontend/index.html`
3. Ejecuta **Open with Live Server**

Asegúrate de que `FRONTEND_URL` en tu `.env` coincida con la URL local que usarás.

---

## 9. Credenciales demo

### Administrador
- Correo: `admin@xijum.com`
- Contraseña: `Admin12345!`

### Cliente
- Correo: `cliente@xijum.com`
- Contraseña: `Cliente12345!`

---

## 10. Stripe en modo prueba

1. Crea una cuenta de Stripe.
2. Usa tus llaves de **modo prueba**.
3. Coloca `STRIPE_SECRET_KEY` en `config/.env`.
4. Para webhooks locales, usa Stripe CLI:

```bash
stripe listen --forward-to localhost:4000/api/checkout/webhook
```

Copia el `whsec_...` que te entregue Stripe CLI y colócalo como:
```txt
STRIPE_WEBHOOK_SECRET=whsec_...
```

Tarjeta de prueba recomendada por Stripe:
```txt
4242 4242 4242 4242
```

---

## 11. Recuperación de contraseña

La app soporta dos modos:

### Modo consola
Si no configuras SMTP, el enlace de recuperación se imprime en consola del backend.

### Modo correo real
Configura:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

---

## 12. Despliegue

## 12.1. Frontend en GitHub Pages
Este repositorio ya incluye el workflow:
```txt
.github/workflows/deploy-pages.yml
```

### Pasos
1. Sube el repo a GitHub
2. Activa **GitHub Pages** en el repositorio
3. Selecciona **GitHub Actions** como source
4. Haz push a `main`

El workflow toma:
- `frontend/`
- `public/`

y publica una versión estática del sitio.

### Importante
Antes de publicar, edita:
```txt
frontend/js/config.js
```

Cambia:
```js
API_BASE_URL: 'http://localhost:4000/api'
```

por la URL real del backend, por ejemplo:
```js
API_BASE_URL: 'https://xijum-api.onrender.com/api'
```

---

## 12.2. Backend en Render
### Recomendación
Despliega la carpeta `backend` como Web Service Node.js y conecta una base PostgreSQL gestionada.

### Variables de entorno mínimas
- `NODE_ENV=production`
- `PORT=10000` o el que Render asigne
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Build y Start Command
Build:
```bash
npm install
```

Start:
```bash
npm start
```

Root directory:
```txt
backend
```

---

## 13. Catálogo real cargado en el proyecto

Los siguientes productos y precios de venta ya vienen incluidos tanto en:
- `database/seed.sql`
- `frontend/js/catalog-data.js`

| Producto | Precio |
|---|---|
| Agenda semanal | $500 MXN |
| Agenda diaria | $665 MXN |
| Agenda citas | $550 MXN |
| Planner mini | $250 MXN |
| Agenda docentes | $520 MXN |
| Agenda mini | $350 MXN |
| Agenda emprendedores | $490 MXN |
| Libreta hojas blancas | $220 MXN |
| Libreta hojas de raya | $280 MXN |
| Libreta journal | $310 MXN |
| Libreta chica | $140 MXN |
| Libreta chica crema | $125 MXN |
| Libreta mini | $45 MXN |
| Libreta cosida | $80 MXN |
| Libreta post it | $65 MXN |
| Libreta post it chica | $45 MXN |
| Adventure book | $500 MXN |
| Tarjetas | $30 MXN |
| Juego | $290 MXN |
| Portaretratos | $280 MXN |
| Stickers Planilla | $40 MXN |
| Stickers 10 pack | $35 MXN |
| Organizador escritorio | $365 MXN |
| Planner carta | $220 MXN |
| Planner media carta | $140 MXN |
| Separadores de imán | $60 MXN |
| Calendario Refri | $40 MXN |
| Planner mensual | $140 MXN |

---

## 14. Accesibilidad y UX

La interfaz ya contempla:
- HTML semántico
- etiquetas en formularios
- contraste alto
- navegación por teclado
- focus visible
- texto alternativo en imágenes
- diseño responsivo para móvil, tablet y escritorio

---

## 15. Notas de arquitectura

- El frontend puede mostrarse incluso si el backend no está disponible, gracias a un catálogo local de respaldo.
- Autenticación, pedidos, perfil, reseñas, checkout y panel admin sí requieren backend activo.
- El carrito se persiste en `localStorage`.

---

## 16. Qué podrías agregar después

- Wishlists
- cupones
- inventario por variantes
- panel de reportes
- imágenes reales por producto
- integración con PayPal sandbox
- dashboard más completo
- emails transaccionales de pedido

---

## 17. Ruta recomendada de lanzamiento

1. Probar localmente
2. Confirmar login, carrito y checkout
3. Desplegar backend
4. Actualizar `frontend/js/config.js`
5. Publicar frontend en GitHub Pages
6. Configurar webhook de Stripe en producción
7. Validar compra de punta a punta

---

## 18. Observación práctica

GitHub Pages solo publica la parte estática del frontend.  
Para que el sitio sea completamente funcional como ecommerce, el backend debe vivir en una plataforma separada compatible con Node.js y PostgreSQL.
