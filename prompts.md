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

**Modelo:** Opus 5.5 xHigh
**Herramienta:** Claude Code

```
Actúa como auditor de procesos de desarrollo de software.

Contexto: estoy realizando el ejercicio sobre guardarraíles y verificación de reglas de proceso.

Objetivo: auditar exclusivamente las reglas de la sección 'Reglas de proceso' de CLAUDE.md, contrastándolas con los últimos 15 commits de HEAD y el estado actual del repositorio.

Instrucciones:
1. Lee CLAUDE.md y separa las reglas de proceso en unidades verificables.
2. Ejecuta git log -15 --format=fuller --name-status y los comandos adicionales de solo lectura que necesites.
3. Comprueba cada regla usando evidencia concreta: commits, rutas de archivos, configuración o historial disponible.
4. Para cada regla, proporciona: qué pide, qué comando o archivo revisaste, veredicto, evidencia en una línea y recomendación.
5. Los únicos veredictos permitidos son: 'se cumple', 'no se cumple' y 'no se puede comprobar con la información disponible'.
6. Las únicas recomendaciones permitidas son: 'dejarla', 'borrarla' y 'convertirla en una comprobación automática'.
7. No interpretes ausencia de evidencia como incumplimiento. Si Git no permite demostrar algo, indícalo expresamente.
8. No modifiques ningún archivo, no ejecutes comandos que alteren el repositorio, no crees commits ni abras PR.
9. Devuelve una tabla breve en el chat, sin escribirla en archivos.

Importante: mis expectativas iniciales ya están registradas y no debes modificarlas. No intentes corregir los problemas que encuentres.
```

**Qué salió:** Claude identificó nueve reglas verificables. Inicialmente clasificó R2 como incumplida por el nombre de la rama.


## Prompt 2

**Modelo:** Opus 5.5 xHigh
**Herramienta:** Claude Code

```
Continúa la auditoría anterior sin modificar ningún archivo.

Hemos verificado manualmente que el commit cbe9617 modifica tres controladores de tasks y docs/capabilities/tasks/README.md en el mismo commit.

También hemos comprobado que la regla de documentación sincronizada se introdujo en 160fbc7 y que, entre los últimos 15 commits globales, cbe9617 es el único commit posterior que modifica los archivos cubiertos por R5a.

Revisa especialmente R2: la rama auditoria-GeraGalindo se creó siguiendo las instrucciones específicas del ejercicio. No uses únicamente su nombre o su configuración upstream como prueba de incumplimiento histórico del agente. Distingue entre desviación de la convención e incumplimiento demostrado.

Consolida las nueve reglas identificadas anteriormente en una tabla con cinco columnas: qué pide, qué se revisó, veredicto, evidencia y qué harías con ella.

Utiliza exclusivamente estos veredictos: se cumple, no se cumple, no se puede comprobar con la información disponible.

Utiliza exclusivamente estas recomendaciones: dejarla, borrarla, convertirla en una comprobación automática.

No inventes evidencia. Mantén explícitas las limitaciones de Git para verificar invocaciones de skills, PRs, agentes y respuestas del chat.

Devuelve únicamente la tabla en el chat. No edites archivos, no hagas commits ni abras PR.
```

**Qué salió:** Reconsideró R2 como no verificable y consolidó la auditoría: una regla cumplida y ocho no verificables.


## Prompt 3

**Modelo:** Opus 5.5 xHigh
**Herramienta:** Claude Code

```
Continúa con la auditoría de FlowSync.

Ahora sí puedes editar exclusivamente docs/auditoria/GG.md.

Conserva intactas las expectativas iniciales que ya están escritas en ese archivo.

En la sección Parte A, incorpora la tabla consolidada de las nueve reglas R1, R2, R3, R4, R5a, R5b, R6, R7 y R8 que acabamos de auditar.

La tabla debe contener cinco columnas:
1. Qué pide la regla.
2. Qué se revisó.
3. Veredicto.
4. Evidencia.
5. Qué harías con ella.

Mantén exactamente los veredictos y recomendaciones de la última auditoría consolidada. Resume la evidencia sin inventar información.

Para R5a, indica que se cumple dentro de la ventana auditada: cbe9617 es el único commit aplicable posterior a la introducción de la regla en 160fbc7. Hemos verificado manualmente con git show que modifica tres controladores de tasks y docs/capabilities/tasks/README.md en el mismo commit.

En la sección Parte B, escribe estas tres reflexiones:

1. La regla en la que más me equivoqué:
Pensaba que la creación del PR y la revisión adversarial se estaban cumpliendo, pero descubrí que el historial de Git no permite demostrar cuándo se ejecutó el agente ni si se hizo como último paso. Mi expectativa se basaba en confiar en las instrucciones, no en evidencia verificable.

2. Una regla que no se puede comprobar:
No puedo verificar que adversarial-reviewer se ejecute al terminar cada unidad de trabajo. Para hacerlo comprobable, lo integraría en el pipeline de CI del pull request y publicaría un informe con su resultado.

3. La regla que eliminaría:
Eliminaría la regla que obliga al agente a responder únicamente con la URL del PR. No protege la calidad del código ni aporta una comprobación técnica, y la información importante ya queda registrada en el propio PR. Pertenece al caso de una regla cuyo valor ya está cubierto por otra herramienta.

No modifiques CLAUDE.md, código fuente, tests, configuración ni ningún otro archivo.
No hagas commits ni abras pull requests.

Al terminar, muestra un resumen de los cambios realizados y el resultado de git status --short.
```

**Qué salió:** Generó el archivo de auditoría y las tres reflexiones. Detectó una inconsistencia entre la numeración y otra entre R8 y la reflexión final.


## Prompt 4
**Modelo:** Opus 5.5 xHigh
**Herramienta:** Claude Code

```
Revisa y corrige exclusivamente docs/auditoria/GG.md.

Realiza estos cambios:

1. Conserva exactamente como están las expectativas iniciales R1–R5. No modifiques sus respuestas.

2. Antes de la tabla de auditoría, añade una tabla breve de correspondencias:
- Expectativa R1 (Gestión de ramas) → Auditoría R1, R2, R3.
- Expectativa R2 (Uso de /commit) → Auditoría R4.
- Expectativa R3 (Documentación sincronizada) → Auditoría R5a, R5b.
- Expectativa R4 (PR y revisión adversarial) → Auditoría R6, R7.
- Expectativa R5 (Respuesta final con URL) → Auditoría R8.

3. En la fila R8 cambia exclusivamente la recomendación de 'dejarla' a 'borrarla', para que sea coherente con la reflexión final.

4. Elimina cualquier texto residual 'Pendiente.' de las partes A y B.

5. Comprueba que la tabla Markdown tenga nueve filas y seis columnas contando el identificador de regla, que ninguna celda esté rota y que las tres reflexiones estén completas.

6. No cambies los veredictos ni inventes evidencia adicional.

No modifiques ningún otro archivo, no hagas commits y no abras pull requests.

Al terminar, muestra el resultado de git status --short y confirma las correcciones.
```

**Qué salió:** Añadió la correspondencia entre expectativas y reglas auditadas, corrigió R8 a borrarla y verificó la estructura del documento.
