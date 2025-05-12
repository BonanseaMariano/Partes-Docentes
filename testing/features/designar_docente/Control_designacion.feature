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
      | DNI      | nombre | apellido | tipoDesignación    | nombreDesignación | año | número | turno | fechaDesdeDesignacion | fechaHastaDesignacion | status | respuesta                                                                                                                                    |
      | 30300300 | Pedro  | Benítez  | CARGO              | Preceptor/a       |     |        |       |            2023-05-01 |            2024-12-31 |    422 | Pedro Benitez NO ha sido designado/a como preceptor/a. pues el cargo solicitado lo ocupa Susana Álvarez para el período                      |
      | 60600600 | Inés   | Torres   | ESPACIO_CURRICULAR | Geografía         |   3 |      1 | Tarde |            2023-07-01 |            2023-10-15 |    422 | Inés Torres NO ha sido designado/a debido a que la asignatura Geografía de la división 3º 1º turno Tarde lo ocupa Raúl Gómez para el período |
