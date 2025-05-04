# language: es
Característica: Gestión de cargos institucionales
  Módulo responsable de administrar los cargos y espacios curriculares en una escuela.

  Esquema del escenario: ingresar nuevo cargo institucional
    Dado el cargo institucional cuyo "<nombre>" que da título al mismo
    Y que es del tipo de designación "<tipoDesignación>"
    Y que tiene una carga horaria de <cargaHoraria> horas, con vigencia desde "<fechaDesdeCargo>" hasta "<fechaHastaCargo>"
    Y que si el tipo es "ESPACIO_CURRICULAR", opcionalmente se asigna a la división "<año>" "<número>" "<orientacion>" "<turno>"
    Cuando se presiona el botón de guardar
    Entonces se espera el siguiente <status> con la "<respuesta>"

    Ejemplos:
      | nombre         | tipoDesignación    | cargaHoraria | fechaDesdeCargo | fechaHastaCargo | año | número | orientacion | turno  | status | respuesta                                                                                 |
      | Vicedirector/a | Cargo              |           36 |      2020-03-01 |                 |     |        |             |        |    200 | Cargo de Vicedirector/a ingresado correctamente                                           |
      | Preceptor/a    | Cargo              |           36 |      2020-03-01 |                 |     |        |             |        |    200 | Cargo de Preceptor/a ingresado correctamente                                              |
      | Historia       | Espacio Curricular |            4 |      2020-03-01 |                 |   5 |      2 | Sociales    | Mañana |    200 | Espacio Curricular Historia para la división 5º 2º Turno Mañana ingresado correctamente   |
      | Geografía      | Espacio Curricular |            3 |      2020-03-01 |                 |   3 |      1 | Sociales    | Tarde  |    200 | Espacio Curricular Geografía para la división 3º 1º Turno Tarde ingresado correctamente   |
      | Auxiliar ADM   | Cargo              |           30 |      2020-03-01 |                 |     |        |             |        |    200 | Cargo de Auxiliar ADM ingresado correctamente                                             |
      | Auxiliar ACAD  | Cargo              |           30 |      2020-03-01 |                 |   3 |      1 | General     | Tarde  |    422 | Cargo de Auxiliar ACAD es CARGO y no corresponde asignar división                         |
      | Auxiliar ACAD  | Cargo              |           30 |      2020-03-01 |                 |     |        |             |        |    200 | Cargo de Auxiliar ACAD ingresado correctamente                                            |
      | Matemática     | Espacio Curricular |            6 |      2020-03-01 |                 |     |        |             |        |    422 | Espacio Curricular Matemática falta asignar división                                      |
      | Matemática     | Espacio Curricular |            6 |      2020-03-01 |                 |   1 |      1 | Economía    | Tarde  |    200 | Espacio Curricular Matemática para la división 1º 1º Turno Tarde ingresado correctamente  |
      | Física         | Espacio Curricular |            6 |      2020-03-01 |                 |   2 |      3 | Ciencias    | Mañana |    200 | Espacio Curricular Física para la división 2º 3º Turno Mañana ingresado correctamente     |
      | Tecnología     | Espacio Curricular |            6 |      2020-03-01 |                 |   4 |      3 | Informatica | Mañana |    200 | Espacio Curricular Tecnología para la división 4º 3º Turno Mañana ingresado correctamente |
