## ADDED Requirements

### Requirement: Borrado definitivo de una tarea

El sistema SHALL permitir a cualquier cuenta con sesión iniciada borrar cualquier tarea mediante `DELETE /api/v1/tasks/:id`, sea o no su responsable, respondiendo `204` sin cuerpo. El borrado SHALL ser definitivo: la tarea SHALL dejar de existir para todo el espacio y NO SHALL haber forma de recuperarla.

#### Scenario: Borrar una tarea

- **WHEN** una cuenta con sesión solicita `DELETE /api/v1/tasks/:id` sobre una tarea existente
- **THEN** la respuesta es `204` sin cuerpo y la tarea deja de existir y de aparecer en la lista

#### Scenario: Borrar una tarea de otra persona

- **WHEN** la tarea tiene como responsable a otra cuenta
- **THEN** se borra igualmente, sin permiso especial

#### Scenario: Borrar sin haber entrado

- **WHEN** se solicita el borrado sin token válido
- **THEN** la respuesta es `401` y la tarea sigue existiendo

#### Scenario: Borrar lo que ya no existe

- **WHEN** se solicita el borrado de una tarea que otra persona ya ha borrado
- **THEN** la respuesta es `404`, no un error del sistema

#### Scenario: Un identificador que no es un número

- **WHEN** se solicita el borrado con un identificador que no es un número
- **THEN** la respuesta es `404` y no se borra nada
