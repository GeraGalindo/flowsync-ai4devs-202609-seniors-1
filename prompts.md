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

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Quiero analizar la cobertura de tests del requisito
"Lo que cada tarea muestra de su responsable"
definido en openspec/specs/tasks/spec.md.

Por ahora solo explora el repositorio. No modifiques ningún archivo ni escribas tests.

Para cada uno de los 3 scenarios de ese requisito:
1. Busca si existe algún test que pueda cubrirlo.
2. Abre y lee el test; no deduzcas cobertura solamente por el nombre.
3. Indícame el nombre exacto del test y su ubicación.
4. Explica qué assertions concretas demuestran o no demuestran el scenario.
5. Si no puedes determinar con certeza si está cubierto, indícalo explícitamente.

No analices otros requisitos de la capability tasks.
```

**Qué salió:** Funcionó a la primera. El agente determinó que ninguno de los tres scenarios estaba cubierto y detectó una posible fuga de email en el scenario 2, aunque todavía no la había confirmado mediante un test.


## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ya hemos determinado que ninguno de los 3 scenarios del requisito
"Lo que cada tarea muestra de su responsable"
en openspec/specs/tasks/spec.md está cubierto por tests.

Ahora quiero que escribas los tests que faltan.

Antes de escribirlos, explora el código necesario para entender cómo crear usuarios,
crear/asignar tareas y obtener tareas mediante la API existente.

Después crea exactamente un test por cada scenario:

1. Responsable identificable
2. La tarea no filtra datos de cuenta
3. Responsable sin nombre

Los tests deben ir exclusivamente en:
backend/tests/functional/tasks/

Sigue el estilo de los tests funcionales existentes en
backend/tests/functional/auth/.

Cada test debe verificar el comportamiento descrito por su scenario, no detalles
de implementación.

No modifiques código de producción, specs, configuración ni tests existentes.

Cuando termines:
- indícame qué archivo creaste,
- el nombre exacto de cada test,
- qué assertions verifican cada scenario.

No arregles código de producción aunque algún test vaya a fallar.
```

**Qué salió:** Los tres tests fueron creados. Dos pasaron y uno falló, confirmando que la lista de tareas expone el email del responsable. El agente también creó una rama, hizo commits y abrió un PR sin que se lo pidiera, así que tuve que volver a la rama de la tarea y hacer cherry-pick de los cambios.


