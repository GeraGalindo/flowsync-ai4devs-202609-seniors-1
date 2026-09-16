# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Sonnet 5
**Herramienta:** Claude Code

```
Show me my open Jira tickets
```

**Qué salió:** funcionó a la primera


## Prompt 2

**Modelo:** Sonnet 5
**Herramienta:** Claude Code

```
I want to create AGENTS.md and CLAUDE.md (that references AGENTS.md). I don't know where these files are supposed to be, so just create the bare minimum and I will edit AGENTS.md manually. Additionally, let me know where these files are located.
```

**Qué salió:** funcionó a la primera - luego modifique manualmente el AGENTS.md


## Prompt 3

**Modelo:** Sonnet 5
**Herramienta:** Claude Code

```
  De las tareas que tengo abiertasen Jira, quiero que implementes FLOW-5 consumiendo el backend de auth ya existente. Sabes que ya terminaste cuando: - El
  regstro llama a 'POST /api/v1/auth/signup' y el login a 'POST /api/v1/auth/login'. - Tras login exitoso, redirige a una vista protegida que consuma GET
  /api/v1/account/profile. - Credenciales inválidas o email ya registrado muestran un mensaje claro, no un error genérico. No toques el backend - el auth ya
  existe. No instales ninguna libreria de formularios sin justificarlo. Usa los componentes de shadcn/ui. Convenciones en AGENTS.md. Si el ticket no
  especifica un campo del formulario, revisa el validador real del backend antes de asumir.
```

**Qué salió:** funcionó a la primera - Verificado en Chrome real contra el backend corriendo en :3333: registro → autologin → redirección a /profile (consume GET /api/v1/account/profile), logout, login con contraseña incorrecta, email duplicado, y acceso directo a /profile sin sesión redirige a /login. tsc -b, npm run lint (oxlint) y npm run build pasan limpios.
