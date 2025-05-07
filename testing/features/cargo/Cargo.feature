# language: es
Característica: Gestión de cargos institucionales
  Módulo responsable de administrar los cargos y espacios curriculares en una escuela.

  Esquema del escenario: ingresar nuevo cargo institucional
    Dado el cargo institucional cuyo "<nombre>" que da título al mismo
    Y que es del tipo de designación "<tipoDesignación>"
    Y que tiene una carga horaria de <cargaHoraria> horas, con vigencia desde "<fechaDesdeCargo>" hasta "<fechaHastaCargo>"
    Y que si el tipo es espacio curricular, opcionalmente se asigna a la división "<año>" "<número>" "<turno>"
    Cuando se presiona el botón de guardar
    Entonces se espera el siguiente <status> con la "<respuesta>"

    Ejemplos:
      | nombre         | tipoDesignación    | cargaHoraria | fechaDesdeCargo | fechaHastaCargo | año | número | turno   | status | respuesta                                                                                 |
      | Vicedirector/a | Cargo              |           36 |      2020-03-01 |                 |     |        |         |    200 | Cargo de Vicedirector/a ingresado correctamente                                           |
      | Preceptor/a    | Cargo              |           36 |      2020-03-01 |                 |     |        |         |    200 | Cargo de Preceptor/a ingresado correctamente                                              |
      | Historia       | Espacio Curricular |            4 |      2020-03-01 |                 |   5 |      2 | MANIANA |    200 | Espacio Curricular Historia para la división 5º 2º Turno Mañana ingresado correctamente   |
      | Geografía      | Espacio Curricular |            3 |      2020-03-01 |                 |   3 |      1 | TARDE   |    200 | Espacio Curricular Geografía para la división 3º 1º Turno Tarde ingresado correctamente   |
      | Auxiliar ADM   | Cargo              |           30 |      2020-03-01 |                 |     |        |         |    200 | Cargo de Auxiliar ADM ingresado correctamente                                             |
      | Auxiliar ACAD  | Cargo              |           30 |      2020-03-01 |                 |   3 |      1 | TARDE   |    422 | Cargo de Auxiliar ACAD es CARGO y no corresponde asignar división                         |
      | Auxiliar ACAD  | Cargo              |           30 |      2020-03-01 |                 |     |        |         |    200 | Cargo de Auxiliar ACAD ingresado correctamente                                            |
      | Matemática     | Espacio Curricular |            6 |      2020-03-01 |                 |     |        |         |    422 | Espacio Curricular Matemática falta asignar división                                      |
      | Matemática     | Espacio Curricular |            6 |      2020-03-01 |                 |   1 |      1 | TARDE   |    200 | Espacio Curricular Matemática para la división 1º 1º Turno Tarde ingresado correctamente  |
      | Física         | Espacio Curricular |            6 |      2020-03-01 |                 |   2 |      3 | MANIANA |    200 | Espacio Curricular Física para la división 2º 3º Turno Mañana ingresado correctamente     |
      | Tecnología     | Espacio Curricular |            6 |      2020-03-01 |                 |   4 |      3 | MANIANA |    200 | Espacio Curricular Tecnología para la división 4º 3º Turno Mañana ingresado correctamente |
      | Tecnología     | Espacio Curricular |           10 |      2020-03-01 |                 |   4 |      3 | MANIANA |    409 | No se puede crear el cargo debido a que ya existe otro identico                           |
      | Tecnología     | Espacio Curricular |           10 |      2025-03-01 |      2020-03-01 |   4 |      3 | MANIANA |    422 | La fecha de inicio no puede ser posterior a la fecha de finalización                      |
