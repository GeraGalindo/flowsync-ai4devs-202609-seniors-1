# FlowSync

Proyecto de práctica del curso: gestión de tareas en equipo. API en AdonisJS (`backend/`) + frontend en React + Vite (`frontend/`).

## Empezar

Trabajas sobre **tu fork**, no sobre el repositorio del curso: aquí vas a crear una rama, commitear y abrir un pull request, y sobre un clon directo no tienes permiso de escritura.

Si ya tienes tu fork de un módulo anterior, con el remoto `upstream` apuntando al repositorio del curso, basta con traer la rama nueva:

```bash
git fetch upstream
git checkout -b s2/start upstream/s2/start
git push -u origin s2/start
```

Si empiezas de cero:

```bash
# 1. Fork desde la web: botón "Fork" en github.com/LIDR-academy/flowsync-ai4devs

# 2. Clona TU fork y añade el del curso como "upstream"
git clone git@github.com:<tu-usuario>/flowsync-ai4devs.git
cd flowsync-ai4devs
git remote add upstream git@github.com:LIDR-academy/flowsync-ai4devs.git
git remote -v          # origin = tu fork, upstream = el del curso

# 3. Colócate en la rama de partida
git fetch upstream
git checkout -b s2/start upstream/s2/start
git push -u origin s2/start
```

> Si te sale `Permission denied (publickey)`, es SSH y no el fork. O subes una clave a tu cuenta de GitHub, o cambias las dos URLs por su versión HTTPS. Si el `clone` falla por otra cosa, avisa a tu TA.

## Arrancar la app

El repositorio trae un `Makefile` con los atajos de desarrollo. Con dos comandos tienes todo en marcha:

```bash
make setup   # solo la primera vez: instala deps, crea los .env y migra
make start   # levanta backend (:3333) y frontend (:5173) a la vez
```

`make start` arranca los dos servidores juntos; `Ctrl-C` los para. `make help` lista todos los targets. Si ya hiciste el `setup` antes, con `make start` basta.

- Backend en `http://localhost:3333`.
- Frontend en `http://localhost:5173`. Apunta al backend por defecto; para cambiarlo, ajusta `VITE_API_URL` en `frontend/.env`.

> Necesitas Node.js, npm y GNU Make. En macOS `make` viene con las Command Line Tools de Xcode; en Linux o WSL, `sudo apt install make` o el equivalente de tu distribución. Windows sin WSL no está soportado.

---

# El ejercicio

**Recorta un MVP hasta que puedas defenderlo.** Unos 45 minutos, con el reloj puesto, antes del directo.

El enunciado completo, con su formato y sus tres líneas de cierre, está en la lección **"Ejercicio FlowSync"** del Módulo 2. Esto es el resumen operativo.

Partes de este párrafo vago, del tipo que llega de verdad:

> «Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.»

## Parte A: el alcance, con reloj

Tres tramos, en este orden, en un solo archivo versionado. Es el mismo recorrido que hace el mentor en la primera demo del directo, con los mismos datos de partida; los prompts los escribes tú.

1. **El terreno que ya existe (3-5 líneas).** El proyecto no es una carpeta vacía. Que el agente te devuelva qué capabilities hay construidas y cómo es el modelo de datos actual, antes de especificar nada.

2. **El interrogatorio.** Que la IA te haga **las cinco preguntas** que más reducirían la incertidumbre, en **una sola ronda** y sin bajar al modelo de datos ni a los endpoints. **No inventes las respuestas**: pégale entera la **ficha de hechos** que trae la lección **"Ejercicio FlowSync"**, que son las respuestas del producto ya decididas, las mismas del directo.

3. **El alcance en cinco bloques.** Problema · usuarios · propuesta de valor · alcance · **NO-alcance**. Que sea agresiva recortando y que **justifique cada exclusión**. Después recorta tú otra vez: ese recorte es tuyo.

> Un documento de producto **no lleva tablas, ni endpoints, ni arquitectura**. Si lo ves crecer hacia ahí, súbelo de nivel y anótalo: es el hallazgo más útil del rato.
>
> Cuando suene el reloj, para. Un bloque a medias es información; uno rellenado de memoria, no.

## Parte B: las tres líneas

Debajo del alcance, en el mismo archivo. **Esta parte no se puede fallar.**

1. Los dos números: cuántas cosas propuso la IA meter dentro, y cuántas quedaron después de tu recorte.
2. Tres cosas que dejaste fuera y por qué cada una, en la forma *"esto fuera, porque no ayuda a validar que…"*. *"No da tiempo"* no vale.
3. La exclusión de la que menos seguro estás, y qué tendría que pasar para que entrara.

---

# Cómo se entrega

**Un pull request desde tu fork**, con dos cosas dentro y ni una más:

1. **Tu archivo de alcance**, en `docs/prd/alcance-mvp-<tus-iniciales>.md`. Ese directorio no existe todavía: créalo.
2. **`prompts.md`**, en la raíz. Ya está aquí con la plantilla puesta: cada prompt en su bloque de código, tal cual lo lanzaste, con su modelo y su herramienta. Incluye también los que no funcionaron.

```bash
git checkout -b alcance-<tus-iniciales>
git add docs/prd prompts.md
git commit -m "alcance: MVP mas prompts"
git push -u origin alcance-<tus-iniciales>
```

Con la rama empujada, GitHub te ofrece el botón para abrir el pull request. Va **contra el repositorio del curso**, no contra tu fork.

**Plazo: antes del directo.** Lo que llegue a tiempo lo revisa tu TA antes de la sesión, que es el único momento en que ese feedback te sirve. Lo que llegue después se marca como recibido, pero ya no se revisa.

> Entrégalo con lo que tenga, sin maquillarlo: lo que le falta es la mitad de lo interesante.

---

La checklist completa de entorno está en la última lección del Módulo 2 del curso, junto con el enunciado entero de la tarea.
