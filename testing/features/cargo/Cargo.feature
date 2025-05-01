# language: es
Característica: Gestión de cargos institucionales
  Módulo responsable de administrar los cargos y espacios curriculares en una escuela.

  Esquema del escenario: ingresar nuevo cargo institucional
    Dado el cargo institucional cuyo "<nombre>" que da título al mismo
    Y que es del tipo de designación "<tipoDesignación>"
    Y que tiene una carga horaria de <cargaHoraria> horas, con vigencia desde "<fechaDesde>" hasta "<fechaHasta>"
    Y que si el tipo es "ESPACIO CURRICULAR", opcionalmente se asigna a la división "<año>" "<número>" "<orientacion>" "<turno>"
    Cuando se presiona el botón de guardar
    Entonces se espera el siguiente <status> con la "<respuesta>"

    Ejemplos:
      | nombre         | tipoDesignación    | cargaHoraria | fechaDesde | fechaHasta | año | número | orientacion | turno  | status | respuesta                                                                               |
      | Vicedirector/a | CARGO              |           36 | 2020-03-01 |            |     |        |             |        |    200 | Cargo de Vicedirector/a ingresado correctamente                                         |
      | Preceptor/a    | CARGO              |           36 | 2020-03-01 |            |     |        |             |        |    200 | Cargo de Preceptor/a ingresado correctamente                                            |
      | Historia       | ESPACIO CURRICULAR |            4 | 2020-03-01 |            |   5 |      2 | Biológicas  | Mañana |    200 | Espacio Curricular Historia para la división 5º 2º Turno Mañana ingresado correctamente |
      | Geografía      | ESPACIO CURRICULAR |            3 | 2020-03-01 |            |   3 |      1 | Sociales    | Tarde  |    200 | Espacio Curricular Geografía para la división 3º 1º Turno Tarde ingresado correctamente |
      | Auxiliar ADM   | CARGO              |           30 | 2020-03-01 |            |     |        |             |        |    200 | Cargo de Auxiliar ADM ingresado correctamente                                           |
      | Auxiliar ACAD  | CARGO              |           30 | 2020-03-01 |            |   1 |      1 | Informática | Tarde  |    501 | Cargo de Auxiliar ACAD es CARGO y no corresponde asignar división                       |
      | Matemática     | ESPACIO CURRICULAR |            6 | 2020-03-01 |            |     |        |             |        |    501 | Espacio Curricular Matemática falta asignar división                                    |
