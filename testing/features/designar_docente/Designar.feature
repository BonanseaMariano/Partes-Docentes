# language: es
Característica: designar una persona a un cargo docente
   actividad central de información de la escuela secundaria

  Esquema del escenario: Designación de persona en cargos NO cubiertos aún en el perído indicado de forma existosa
    Dada la persona con <DNI> "<nombre>" y "<apellido>"
    Y que se asigna al cargo  con tipo de designación "<tipoDesignación>" y "<nombreDesignación>"
    Y si es espacio curricular asignada a la división "<año>" "<número>" "<orientacion>" "<turno>"
    Y se designa por el período "<fechadesdeDesignacion>" "<fechaHastaDesignacion>"
    Cuando se presiona el botón guardar
    Entonces se espera el siguiente <status> y "<respuesta>"

    Ejemplos:
      | DNI      | nombre      | apellido     | tipoDesignación    | nombreDesignación | año | número | orientacion | turno  | fechaDesdeDesignacion | fechaHastaDesignacion | status | respuesta                                                                                                      |
      | 10100100 | Alberto     | Lopez        | CARGO              | Vicedirector/a    |     |        |             |        |            2023-03-01 |                       |    200 | Alberto Lopez ha sido designado/a como Vicedirector/a exitosamente                                             |
      | 20200200 | Susana      | Álvarez      | CARGO              | Preceptor/a       |     |        |             |        |            2023-03-01 |            2023-12-31 |    200 | Susana Álvarez ha sido designado/a como preceptor/a exitosamente                                               |
      | 40400400 | Marisa      | Amuchástegui | ESPACIO CURRICULAR | Historia          |   5 |      2 | Biológicas  | Mañana |            2023-03-01 |                       |    200 | Marísa Amuchástegui ha sido designado/a a la asignatura Historia a la división 5º 2º turno Mañana exitosamente |
      | 50500500 | Raúl        | Gómez        | ESPACIO CURRICULAR | Geografía         |   3 |      1 | Sociales    | Tarde  |            2023-03-01 |            2025-12-31 |    200 | Raúl Gómez ha sido designado/a a la asignatura Geografía a la división 3º 1º turno Tarde exitosamente          |
      | 20000000 | Rosalía     | Fernandez    | CARGO              | Preceptor/a       |     |        |             |        |            2024-01-01 |            2024-12-31 |    200 | Rosalía Fernandez ha sido designado/a como Auxiliar exitosamente                                               |
      | 99100000 | Ermenegildo | Sabat        | ESPACIO CURRICULAR | Física            |   1 |      1 | Ciencias    | Tarde  |            2023-03-01 |                       |    200 | Ermenegildo Sábat ha sido designado/a a la asignatura Física a la división 2º 3º turno Mañana exitosamente     |
      | 99200000 | María Rosa  | Gallo        | ESPACIO CURRICULAR | Matemática        |   2 |      3 | Economía    | Mañana |            2023-03-01 |                       |    200 | María Rosa Gallo ha sido designado/a a la asignatura Matemáticas a la división 1º 1º turno Tarde exitosamente  |
      | 99300000 | Homero      | Manzi        | ESPACIO CURRICULAR | Tecnología        |   4 |      3 | Informatica | Mañana |            2023-03-01 |                       |    200 | Homero Manzi ha sido designado/a a la asignatura Tecnología a la división 4º 3º turno Mañana exitosamente      |
