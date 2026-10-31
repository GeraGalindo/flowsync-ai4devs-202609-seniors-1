## Why

La historia E2-10 pide poder quitar del espacio las tareas que ya no tienen sentido, y la spec viva no tiene ningún requisito de borrado. Este change añade la operación a la API.

## What Changes

- `DELETE /api/v1/tasks/:id` destruye la tarea y responde `204` sin cuerpo.
- Cualquier cuenta con sesión puede borrar cualquier tarea (CA-3); sin sesión, `401` (CA-10).
- Borrar lo que ya no existe responde `404` (CA-11).

### Fuera de alcance

- **La interfaz.** No se añade ningún control de borrado, así que la confirmación explícita de CA-4 a CA-7 **sigue sin construirse**. La historia E2-10 no queda completa con este change: esa confirmación tiene que llegar con el control de borrado.
- **PA-8**: qué ve quien tiene abierta una tarea que otra persona borra sigue abierta en el PRD.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `tasks`: añade el requisito *Borrado definitivo de una tarea*.

## Impact

Ruta nueva en el grupo de `tasks`, método `destroy` en `TasksController`, documento OpenAPI, tipos generados de `.adonisjs/` y README de la capability. Sin migraciones.
