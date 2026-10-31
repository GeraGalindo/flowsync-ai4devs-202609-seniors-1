## Context

El grupo de rutas de `tasks` ya exige sesión y `findOrFail` ya traduce una tarea inexistente a `404`. Nada referencia a `tasks` por clave foránea, así que borrar la fila no arrastra otros datos.

## Goals / Non-Goals

**Goals:** borrar una tarea por la API con un contrato sin cuerpo.

**Non-Goals:** la interfaz de borrado y su confirmación; papelera o borrado lógico; permisos por responsable.

## Decisions

### 1. Borrado físico

Se elimina la fila. E2-10 exige que no exista forma de recuperar la tarea (CA-8), y un borrado lógico obligaría además a filtrar todas las lecturas.

### 2. El método vive en `TasksController`

Actúa sobre la tarea entera, no sobre un atributo con controlador propio como el estado o la fecha.

### 3. La respuesta no pasa por `serialize()`

`204` no lleva cuerpo, y el serializer lo envolvería en `{ data }`.

## Risks / Trade-offs

- **La API permite borrar sin confirmación** → la confirmación de CA-4 es de producto y corresponde al cliente; hoy ningún cliente ofrece la acción.
