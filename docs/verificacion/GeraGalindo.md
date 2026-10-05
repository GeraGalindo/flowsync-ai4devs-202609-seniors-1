# Matriz de trazabilidad

**Scenarios en el requisito: 3 · Cubiertos: 0**

| Scenario | Test que lo cubre | Estado | Qué te faltó |
|---|---|---|---|
| Responsable identificable: una tarea con responsable "Ada Lovelace" muestra su nombre e iniciales | | No cubierto | — |
| La tarea no filtra datos de cuenta: el assignee no expone email ni datos de acceso | | No cubierto | — |
| Responsable sin nombre: el assignee tiene nombre nulo pero conserva iniciales | | No cubierto | — |

# Las tres lineas
1. Antes de revisar creía que 0 de 3 scenarios estaban cubiertos; al revisar, 0 de 3 estaban cubiertos.
2. En “La tarea no filtra datos de cuenta”, dudé qué significaba exactamente “cualquier tarea, suelta o dentro de la lista”: no tenía claro qué lista era ni si también debía comprobar otras respuestas que contienen una tarea.
3. En “Responsable sin nombre”, el scenario decía que las iniciales debían seguir llegando, pero no especificaba cómo debían calcularse; decidí comprobar únicamente que fueran un string no vacío, sin imponer un formato concreto.
