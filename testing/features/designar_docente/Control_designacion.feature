# language: es
Característica: designar una persona a un cargo docente
   actividad central de información de la escuela secundaria

  Esquema del escenario: Designación de persona en una instancia de designación de cargo que YA cuenta con una designación para el mismo período. Informar el error respectivo y abortar la transacción
    Dada la persona con <DNI> "<nombre>" y "<apellido>"
    Y que se asigna al cargo  con tipo de designación "<tipoDesignación>" y "<nombreDesignación>"
    Y si es espacio curricular asignada a la división "<año>" "<número>" "<turno>"
    Y se designa por el período "<fechaDesdeDesignacion>" "<fechaHastaDesignacion>"
    Cuando se presiona el botón guardar
    Entonces se espera el siguiente <status> con la "<respuesta>"

    Ejemplos:
      | DNI      | nombre      | apellido | tipoDesignación    | nombreDesignación | año | número | turno  | fechaDesdeDesignacion | fechaHastaDesignacion | status | respuesta                                                                                                                                                |
      | 30300300 | Pedro       | Benítez  | CARGO              | Preceptor/a       |     |        |        |            2023-05-01 |            2024-12-31 |    422 | Pedro Benítez NO ha sido designado/a como Preceptor/a. pues el cargo solicitado lo ocupa Susana Álvarez para el período                                  | #Fecha definida que solapa encerrando a una fecha definida
      | 60600600 | Inés        | Torres   | ESPACIO_CURRICULAR | Geografía         |   3 |      1 | Tarde  |            2023-07-01 |            2023-10-15 |    422 | Inés Torres NO ha sido designado/a debido a que la asignatura Geografía de la división 3º 1º turno Tarde lo ocupa Raúl Gómez para el período             | #Fecha definida que solapa con una fecha definida en su fecha de inicio
      | 60600600 | Inés        | Torres   | ESPACIO_CURRICULAR | Geografía         |   3 |      1 | Tarde  |            2023-02-01 |            2023-10-15 |    422 | Inés Torres NO ha sido designado/a debido a que la asignatura Geografía de la división 3º 1º turno Tarde lo ocupa Raúl Gómez para el período             | #Fecha definida que solapa con una fecha definida en su fecha de fin
      | 60600600 | Inés        | Torres   | ESPACIO_CURRICULAR | Geografía         |   3 |      1 | Tarde  |            2023-07-01 |            2023-10-15 |    422 | Inés Torres NO ha sido designado/a debido a que la asignatura Geografía de la división 3º 1º turno Tarde lo ocupa Raúl Gómez para el período             | #Fecha definida que solapa entre una fecha definida
      | 70700700 | Jorge       | Dismal   | CARGO              | Vicedirector/a    |     |        |        |            2023-06-15 |            2023-12-31 |    422 | Jorge Dismal NO ha sido designado/a como Vicedirector/a. pues el cargo solicitado lo ocupa Alberto Lopez para el período                                 | #Fecha definida que intenta solapar con una fecha indefinida (Alberto Lopez con fecha fin nula)
      | 80800800 | Analía      | Rojas    | ESPACIO_CURRICULAR | Historia          |   5 |      2 | Mañana |            2023-08-01 |                       |    422 | Analía Rojas NO ha sido designado/a debido a que la asignatura Historia de la división 5º 2º turno Mañana lo ocupa Marisa Amuchástegui para el período   | #Fecha indefinida (sin fecha fin) que intenta solapar con otra fecha indefinida (Marisa Amuchástegui)
      | 99100000 | Ermenegildo | Sabat    | ESPACIO_CURRICULAR | Física            |   2 |      3 | Mañana |            2023-01-01 |            2024-06-30 |    422 | Ermenegildo Sabat NO ha sido designado/a debido a que la asignatura Física de la división 2º 3º turno Mañana lo ocupa Ermenegildo Sabat para el período  | #Fecha definida que intenta solapar con una asignación indefinida propia (Ermenegildo ya tiene el puesto)
      | 99200000 | María Rosa  | Gallo    | ESPACIO_CURRICULAR | Matemática        |   1 |      1 | Tarde  |            2023-05-01 |                       |    422 | María Rosa Gallo NO ha sido designado/a debido a que la asignatura Matemática de la división 1º 1º turno Tarde lo ocupa María Rosa Gallo para el período | #Fecha indefinida que intenta solapar con una asignación indefinida propia (María Rosa ya tiene el puesto)
