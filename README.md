# FlowSync

Proyecto de práctica del curso: gestión de tareas en equipo. API en AdonisJS 7 (`backend/`) + frontend en React 19 + Vite (`frontend/`).

## Empezar

Trabajas sobre **tu fork**, no sobre el repositorio del curso: aquí vas a crear una rama, commitear y abrir un pull request, y sobre un clon directo no tienes permiso de escritura.

```bash
# 1. Fork desde la web: botón "Fork" en github.com/LIDR-academy/flowsync-ai4devs

# 2. Clona TU fork y añade el del curso como "upstream"
git clone git@github.com:<tu-usuario>/flowsync-ai4devs.git
cd flowsync-ai4devs
git checkout s2/start   # o la rama del módulo que estés cursando (te la indica el prework)
```

> Si te sale `Permission denied (publickey)`, es SSH y no el fork. O subes una clave a tu cuenta de GitHub, o cambias las dos URLs por su versión HTTPS. Si el `clone` falla por otra cosa, avisa a tu TA.

## Arrancar la app

El repo trae un `Makefile` con los atajos de desarrollo (nace en el Módulo 1). Con dos comandos tienes todo en marcha:

```bash
make setup   # solo la primera vez: instala deps, crea los .env y migra
make start   # levanta backend (:3333) y frontend (:5173) a la vez
```

`make start` arranca los dos servidores juntos; `Ctrl-C` los para. `make help` lista todos los targets.

- Backend en `http://localhost:3333`.
- Frontend en `http://localhost:5173`. Apunta al backend por defecto; para cambiarlo, ajusta `VITE_API_URL` en `frontend/.env`.

> ¿Prefieres arrancar a mano, sin `make`? Los pasos por servidor (`npm install`, `.env`, migraciones, `npm run dev`) están en el Módulo 1 del asíncrono del curso.

Las instrucciones completas de prework (checklist + priming) están en el asíncrono del curso.
