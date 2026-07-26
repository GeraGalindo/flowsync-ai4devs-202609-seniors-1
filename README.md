# FlowSync

Proyecto de práctica del curso: gestión de tareas en equipo. API en AdonisJS 7 (`backend/`) + frontend en React 19 + Vite (`frontend/`).

## Empezar

Trabajas sobre **tu fork**, no sobre el repositorio del curso: aquí vas a crear una rama, commitear y abrir un pull request, y sobre un clon directo no tienes permiso de escritura.

```bash
# 1. Fork desde la web: botón "Fork" en github.com/LIDR-academy/flowsync-ai4devs

# 2. Clona TU fork y añade el del curso como "upstream"
git clone git@github.com:<tu-usuario>/flowsync-ai4devs.git
cd flowsync-ai4devs
git remote add upstream git@github.com:LIDR-academy/flowsync-ai4devs.git
git remote -v          # origin = tu fork, upstream = el del curso

# 3. Colócate en la rama de partida
git fetch upstream
git checkout -b s1/start upstream/s1/start
git push -u origin s1/start
```

> Si te sale `Permission denied (publickey)`, es SSH y no el fork. O subes una clave a tu cuenta de GitHub, o cambias las dos URLs por su versión HTTPS. Si el `clone` falla por otra cosa, avisa a tu TA.

## Backend (`backend/`)

```bash
cd backend
npm install
cp .env.example .env
node ace generate:key
node ace migration:run
npm run dev
```

Arranca en `http://localhost:3333`.

## Frontend (`frontend/`)

Abre otra terminal en la raíz del repo (el backend se queda corriendo en la primera):

```bash
cd frontend
npm install
npm run dev
```

Arranca en `http://localhost:5173`.

Apunta al backend de `http://localhost:3333` por defecto. Para cambiarlo, copia
`.env.example` a `.env` y ajusta `VITE_API_URL`.

Las instrucciones completas de prework (checklist + priming) están en el Módulo 1 del asíncrono del curso.
