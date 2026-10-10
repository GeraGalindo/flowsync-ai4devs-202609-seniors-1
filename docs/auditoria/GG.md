# Auditoría de reglas de proceso — GG

## Expectativas iniciales

Registradas antes de consultar el historial de Git.

| Regla | Expectativa |
|---|---|
| R1 — Gestión de ramas | Sí |
| R2 — Uso de /commit | No |
| R3 — Documentación sincronizada | Ni idea |
| R4 — PR y revisión adversarial | Sí |
| R5 — Respuesta final con URL | Sí |

## Parte A — Auditoría

Contraste de la sección «Reglas de proceso» de `CLAUDE.md` con los últimos 15 commits de HEAD (`git log -15 --format=fuller --name-status`) y el estado actual del repositorio, solo con comandos de lectura.

Correspondencia entre las expectativas iniciales y las reglas auditadas:

| Expectativa | Reglas auditadas |
|---|---|
| R1 — Gestión de ramas | R1, R2, R3 |
| R2 — Uso de /commit | R4 |
| R3 — Documentación sincronizada | R5a, R5b |
| R4 — PR y revisión adversarial | R6, R7 |
| R5 — Respuesta final con URL | R8 |

| # | Qué pide la regla | Qué se revisó | Veredicto | Evidencia | Qué harías con ella |
|---|---|---|---|---|---|
| R1 | Si ya estás en una rama de trabajo (ni `main` ni `sN/*`), seguir en ella y no crear otra | `git branch -a`, `git reflog` | no se puede comprobar con la información disponible | La rama actual, `auditoria-GeraGalindo`, es una rama de trabajo. Git no guarda qué es una «unidad de trabajo» ni en qué rama se escribió cada commit. | dejarla |
| R2 | Desde `main` o `sN/*`, crear la rama con `git checkout -b feat/<slug>` | `git config --get-regexp '^branch\.'`, `git branch -a`, `git reflog` | no se puede comprobar con la información disponible | `auditoria-GeraGalindo` sigue a `s5/start` y no lleva el prefijo `feat/`. Es una desviación de la convención, no un incumplimiento demostrado: la rama se creó siguiendo las instrucciones del ejercicio, y Git no registra quién creó una rama ni bajo qué regla. | convertirla en una comprobación automática |
| R3 | Nunca commitear directamente en `main` ni en una `sN/*` | `git branch -a --contains <sha>`, `git log --merges` | no se puede comprobar con la información disponible | Los 15 commits forman una historia lineal sin merges y están en `upstream/s4/end` y `upstream/s5/start`. Git no distingue un commit directo de un fast-forward o de un rebase. | convertirla en una comprobación automática |
| R4 | Un commit por petición, hecho con la skill `/commit` | `git log -15`, `.claude/skills/commit/SKILL.md` | no se puede comprobar con la información disponible | Git no registra peticiones ni invocaciones de skills. Solo el formato es visible: 14 de 15 siguen `tipo(scope):` y `a3bb962` («docs: …») no lleva scope. | dejarla |
| R5a | Si un cambio toca rutas, controladores, validadores o transformers de una capability, su README se actualiza en el mismo commit | `git log -15 --name-status` desde `160fbc7`, `git show cbe9617` | se cumple | Se cumple dentro de la ventana auditada: `cbe9617` es el único commit aplicable posterior a la introducción de la regla en `160fbc7`. Verificado a mano con `git show`: modifica 3 controladores de tasks y `docs/capabilities/tasks/README.md` en el mismo commit. | convertirla en una comprobación automática |
| R5b | El diff regenerado de `.adonisjs/` va en ese mismo commit | `git show cbe9617 --name-status` | no se puede comprobar con la información disponible | `cbe9617` no incluye `.adonisjs/`. No añade rutas ni controladores, así que puede que no hubiera diff que regenerar. Comprobarlo exige arrancar el servidor o pasar los tests, y eso altera el árbol. | convertirla en una comprobación automática |
| R6 | `gh pr create` una sola vez al terminar la unidad, con una descripción completa | `gh pr list --state all --search <sha>` en upstream y en origin | no se puede comprobar con la información disponible | No aparece ningún PR con los SHA auditados. Git no registra PRs, y hay un remoto `mentors-local` (visible en el merge `9987cf0`) que no se pudo consultar, así que no encontrar ninguno no prueba que no exista. | dejarla |
| R7 | Pasar el subagente `adversarial-reviewer` sobre el PR, como último paso | `.claude/agents/adversarial-reviewer.md`, `git log` | no se puede comprobar con la información disponible | El subagente existe (`8f9e715`), pero Git no registra cuándo se invoca un agente y este no deja ningún artefacto en el repo. | dejarla |
| R8 | Al abrir el PR, responder en el chat solo con la URL | — | no se puede comprobar con la información disponible | Las respuestas del chat no quedan en Git ni en el repo. | borrarla |

## Parte B — Reflexión

### 1. La regla en la que más me equivoqué

Pensaba que la creación del PR y la revisión adversarial se estaban cumpliendo, pero descubrí que el historial de Git no permite demostrar cuándo se ejecutó el agente ni si se hizo como último paso. Mi expectativa se basaba en confiar en las instrucciones, no en evidencia verificable.

### 2. Una regla que no se puede comprobar

No puedo verificar que `adversarial-reviewer` se ejecute al terminar cada unidad de trabajo. Para hacerlo comprobable, lo integraría en el pipeline de CI del pull request y publicaría un informe con su resultado.

### 3. La regla que eliminaría

Eliminaría la regla que obliga al agente a responder únicamente con la URL del PR. No protege la calidad del código ni aporta una comprobación técnica, y la información importante ya queda registrada en el propio PR. Pertenece al caso de una regla cuyo valor ya está cubierto por otra herramienta.
