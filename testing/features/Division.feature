# language: es
Característica: Gestión de divisiones
Módulo responsable de administrar a las divisiones (espacios físicos) de una escuela

  Esquema del escenario: ingresar nueva división
    Dada la el espacio físico división con <año> <número> <orientación> <turno>
    Cuando se presiona el botón de guardar para división
    Entonces se espera el siguiente <status> con la "<respuesta>"

    Ejemplos:
      | año | número | orientación | turno  | status | respuesta                                           |
      |   5 |      2 | Sociales    | Mañana |    200 | División 5º 2º turno Mañana ingresada correctamente |
      |   3 |      1 | Sociales    | Tarde  |    200 | División 3º 1º turno Tarde ingresada correctamente  |
      |   3 |      1 | Sociales    | Mañana |    200 | División 3º 1º turno Mañana ingresada correctamente |
      |   1 |      1 | Humanidades | Tarde  |    200 | División 1º 1º turno Tarde ingresada correctamente  |
      |   2 |      3 | Ciencias    | Mañana |    200 | División 2º 3º turno Mañana ingresada correctamente |
      |   4 |      3 | Tecnológica | Mañana |    200 | División 4º 3º turno Mañana ingresada correctamente |
      |   1 |      2 | Gimnasio    | Mañana |    200 | División 1º 2º turno Mañana ingresada correctamente |
      |   2 |      1 | Ciencias    | Tarde  |    200 | División 2º 1º turno Tarde ingresada correctamente  |
      |   3 |      2 | Humanidades | Mañana |    200 | División 3º 2º turno Mañana ingresada correctamente |
      |   4 |      1 | Ciencias    | Tarde  |    200 | División 4º 1º turno Tarde ingresada correctamente  |
      |   2 |      2 | Sociales    | Tarde  |    200 | División 2º 2º turno Tarde ingresada correctamente  |
      |   1 |      3 | Arte        | Mañana |    200 | División 1º 3º turno Mañana ingresada correctamente |
      |   5 |      1 | Arte        | Tarde  |    200 | División 5º 1º turno Tarde ingresada correctamente  |
      |   3 |      3 | Tecnológica | Tarde  |    200 | División 3º 3º turno Tarde ingresada correctamente  |
      |   4 |      2 | Arte        | Mañana |    200 | División 4º 2º turno Mañana ingresada correctamente |
