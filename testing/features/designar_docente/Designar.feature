# language: es
Característica: designar una persona a un cargo docente
   actividad central de información de la escuela secundaria

  Esquema del escenario: Designación de persona en cargos NO cubiertos aún en el perído indicado de forma existosa
    Dada la persona con <DNI> "<nombre>" y "<apellido>"
    Y que se asigna al cargo  con tipo de designación "<tipoDesignación>" y "<nombreDesignación>"
    Y si es espacio curricular asignada a la división "<año>" "<número>" "<turno>"
    Y se designa por el período "<fechaDesdeDesignacion>" "<fechaHastaDesignacion>"
    Cuando se presiona el botón guardar
    Entonces se espera el siguiente <status> con la "<respuesta>"

    Ejemplos:
      | DNI      | nombre      | apellido     | tipoDesignación    | nombreDesignación | año | número | turno   | fechaDesdeDesignacion | fechaHastaDesignacion | status | respuesta                                                                                                      |
      | 10100100 | Alberto     | Lopez        | CARGO              | Vicedirector/a    |     |        |         |            2023-03-01 |                       |    200 | Alberto Lopez ha sido designado/a como Vicedirector/a exitosamente                                             |
      | 20200200 | Susana      | Álvarez      | CARGO              | Preceptor/a       |     |        |         |            2023-03-01 |            2023-12-31 |    200 | Susana Álvarez ha sido designado/a como Preceptor/a exitosamente                                               |
      | 40400400 | Marisa      | Amuchástegui | ESPACIO_CURRICULAR | Historia          |   5 |      2 | MANIANA |            2023-03-01 |                       |    200 | Marisa Amuchástegui ha sido designado/a a la asignatura Historia a la división 5º 2º turno Mañana exitosamente |
      | 50500500 | Raúl        | Gómez        | ESPACIO_CURRICULAR | Geografía         |   3 |      1 | TARDE   |            2023-03-01 |            2025-12-31 |    200 | Raúl Gómez ha sido designado/a a la asignatura Geografía a la división 3º 1º turno Tarde exitosamente          |
      | 20000000 | Rosalía     | Fernandez    | CARGO              | Auxiliar ACAD     |     |        |         |            2024-01-01 |            2024-12-31 |    200 | Rosalía Fernandez ha sido designado/a como Auxiliar ACAD exitosamente                                          |
      | 99100000 | Ermenegildo | Sabat        | ESPACIO_CURRICULAR | Física            |   2 |      3 | MANIANA |            2023-03-01 |                       |    200 | Ermenegildo Sabat ha sido designado/a a la asignatura Física a la división 2º 3º turno Mañana exitosamente     |
      | 99200000 | María Rosa  | Gallo        | ESPACIO_CURRICULAR | Matemática        |   1 |      1 | TARDE   |            2023-03-01 |                       |    200 | María Rosa Gallo ha sido designado/a a la asignatura Matemática a la división 1º 1º turno Tarde exitosamente   |
      | 99300000 | Homero      | Manzi        | ESPACIO_CURRICULAR | Tecnología        |   4 |      3 | MANIANA |            2023-03-01 |                       |    200 | Homero Manzi ha sido designado/a a la asignatura Tecnología a la división 4º 3º turno Mañana exitosamente      |
      | 99300000 | Homero      | Manzi        | ESPACIO_CURRICULAR | Tecnología        |   4 |      3 | MANIANA |            2023-03-01 |                       |    409 | No se puede crear la designación debido a que ya existe otra idéntica                                          |
      | 99300000 | Homero      | Manzi        | ESPACIO_CURRICULAR | Tecnología        |   4 |      3 | MANIANA |            2025-03-01 |            2023-03-01 |    422 | La fecha de inicio no puede ser posterior a la fecha de finalización                                           |
