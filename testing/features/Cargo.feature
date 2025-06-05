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
      | nombre           | tipoDesignación    | cargaHoraria | fechaDesdeCargo | fechaHastaCargo | año | número | turno  | status | respuesta                                                                                       |
      | Vicedirector/a   | CARGO              |           36 |      2020-03-01 |                 |     |        |        |    200 | Cargo de Vicedirector/a ingresado correctamente                                                 |
      | Preceptor/a      | CARGO              |           36 |      2020-03-01 |                 |     |        |        |    200 | Cargo de Preceptor/a ingresado correctamente                                                    |
      | Historia         | ESPACIO_CURRICULAR |            4 |      2020-03-01 |                 |   5 |      2 | Mañana |    200 | Espacio Curricular Historia para la división 5º 2º Turno Mañana ingresado correctamente         |
      | Geografía        | ESPACIO_CURRICULAR |            3 |      2020-03-01 |                 |   3 |      1 | Tarde  |    200 | Espacio Curricular Geografía para la división 3º 1º Turno Tarde ingresado correctamente         |
      | Auxiliar ADM     | CARGO              |           30 |      2020-03-01 |                 |     |        |        |    200 | Cargo de Auxiliar ADM ingresado correctamente                                                   |
      | Auxiliar ACAD    | CARGO              |           30 |      2020-03-01 |                 |   3 |      1 | Tarde  |    500 | Cargo de Auxiliar ACAD es CARGO y no corresponde asignar división                               |
      | Auxiliar ACAD    | CARGO              |           30 |      2020-03-01 |                 |     |        |        |    200 | Cargo de Auxiliar ACAD ingresado correctamente                                                  |
      | Matemática       | ESPACIO_CURRICULAR |            6 |      2020-03-01 |                 |     |        |        |    500 | Espacio Curricular Matemática falta asignar división                                            |
      | Matemática       | ESPACIO_CURRICULAR |            6 |      2020-03-01 |                 |   1 |      1 | Tarde  |    200 | Espacio Curricular Matemática para la división 1º 1º Turno Tarde ingresado correctamente        |
      | Física           | ESPACIO_CURRICULAR |            6 |      2020-03-01 |                 |   2 |      3 | Mañana |    200 | Espacio Curricular Física para la división 2º 3º Turno Mañana ingresado correctamente           |
      | Tecnología       | ESPACIO_CURRICULAR |            6 |      2020-03-01 |                 |   4 |      3 | Mañana |    200 | Espacio Curricular Tecnología para la división 4º 3º Turno Mañana ingresado correctamente       |
      | Tecnología       | ESPACIO_CURRICULAR |           10 |      2020-03-01 |                 |   4 |      3 | Mañana |    500 | No se puede crear el cargo debido a que ya existe otro identico                                 |
      | Educación Física | ESPACIO_CURRICULAR |            3 |      2020-03-01 |                 |   1 |      2 | Mañana |    200 | Espacio Curricular Educación Física para la división 1º 2º Turno Mañana ingresado correctamente |
      | Matemática       | ESPACIO_CURRICULAR |            4 |      2020-03-01 |                 |   2 |      1 | Tarde  |    200 | Espacio Curricular Matemática para la división 2º 1º Turno Tarde ingresado correctamente        |
      | Lengua           | ESPACIO_CURRICULAR |            5 |      2020-03-01 |                 |   3 |      2 | Mañana |    200 | Espacio Curricular Lengua para la división 3º 2º Turno Mañana ingresado correctamente           |
      | Ciencias         | ESPACIO_CURRICULAR |            4 |      2020-03-01 |                 |   4 |      1 | Tarde  |    200 | Espacio Curricular Ciencias para la división 4º 1º Turno Tarde ingresado correctamente          |
      | Historia         | ESPACIO_CURRICULAR |            3 |      2020-03-01 |                 |   2 |      2 | Tarde  |    200 | Espacio Curricular Historia para la división 2º 2º Turno Tarde ingresado correctamente          |
      | Arte             | ESPACIO_CURRICULAR |            2 |      2020-03-01 |                 |   1 |      3 | Mañana |    200 | Espacio Curricular Arte para la división 1º 3º Turno Mañana ingresado correctamente             |
      | Música           | ESPACIO_CURRICULAR |            2 |      2020-03-01 |                 |   5 |      1 | Tarde  |    200 | Espacio Curricular Música para la división 5º 1º Turno Tarde ingresado correctamente            |
      | Tecnología       | ESPACIO_CURRICULAR |            3 |      2020-03-01 |                 |   3 |      3 | Tarde  |    200 | Espacio Curricular Tecnología para la división 3º 3º Turno Tarde ingresado correctamente        |
