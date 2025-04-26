# language: es
Característica: Gestión de divisiones
Módulo responsable de administrar a las divisiones (espacios físicos) de una escuela

  Esquema del escenario: ingresar nueva división
    Dada la el espacio físico división con <año> <número> <orientación> <turno>
    Cuando se presiona el botón de guardar para división
    Entonces se espera el siguiente <status> con la "<respuesta>"

    Ejemplos:
      | año | número | orientación | turno  | status | respuesta                                           |
      |   5 |      2 | Biológicas  | Mañana |    200 | División 5º 2º turno Mañana ingresada correctamente |
      |   3 |      1 | Sociales    | Tarde  |    200 | División 3º 1º turno Tarde ingresada correctamente  |
      |   3 |      1 | Sociales    | Tarde  |    200 | División 3º 1º turno Tarde ingresada correctamente  |
