# language: es
Característica: otorgar o denegar licencia a una persona a un cargo docente
   actividad central de información de la escuela secundaria

  Esquema del escenario: Otorgar Distintas licencias según las reglas de los distintos artículos
    Dado el docente con DNI <DNI>, nombre "<Nombre>" y apellido "<Apellido>"
    Cuando solicita una licencia artículo "<Artículo>" con certificado médico "<Certificado>" con descripción "<Descripción>" para el período "<Desde>" "<Hasta>"
    Entonces se espera el siguiente <status> con la "<respuesta>"

    Ejemplos:
      | DNI      | Nombre      | Apellido   | Artículo | Certificado | Descripción                   | Desde      | Hasta      | status | respuesta                                                                                                                  |
      | 99100000 | Ermenegildo | Sabat      |       5A | SI          | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-07 | 2023-05-17 |    200 | Se otorga Licencia artículo 5A a Ermenegildo Sabat                                                                         |
      | 99100000 | Ermenegildo | Sabat      |       5A | SI          | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-18 | 2023-05-31 |    200 | Se otorga Licencia artículo 5A a Ermenegildo Sabat                                                                         |
      | 99100000 | Ermenegildo | Sabat      |       5A | SI          | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-06-01 | 2023-06-12 |    500 | NO se otorga Licencia artículo 5A a Ermenegildo Sabat debido a que supera el tope de 30 días de licencia                   |
      | 99100000 | Ermenegildo | Sabat      |       5A | SI          | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-10-01 | 2023-10-03 |    200 | Se otorga Licencia artículo 5A a Ermenegildo Sabat                                                                         |
      | 99100000 | Ermenegildo | Sabat      |       5A | SI          | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-10-04 | 2023-10-10 |    500 | NO se otorga Licencia artículo 5A a Ermenegildo Sabat debido a que supera el tope de 30 días de licencia                   |
      | 99200000 | María Rosa  | Gallo      |      23A | NO          | ATENCIÓN DE UN MIEMBRO DEL GF | 2023-02-15 | 2023-03-01 |    200 | Se otorga Licencia artículo 23A a María Rosa Gallo                                                                         |
      | 99200000 | María Rosa  | Gallo      |      23A | NO          | ATENCIÓN DE UN MIEMBRO DEL GF | 2023-04-01 | 2023-04-15 |    200 | Se otorga Licencia artículo 23A a María Rosa Gallo                                                                         |
      | 99200000 | María Rosa  | Gallo      |      23A | NO          | ATENCIÓN DE UN MIEMBRO DEL GF | 2023-04-12 | 2023-04-20 |    500 | NO se otorga Licencia artículo 23A a María Rosa Gallo debido a que ya posee una licencia en el mismo período               |
      | 99200000 | María Rosa  | Gallo      |      23A | NO          | ATENCIÓN DE UN MIEMBRO DEL GF | 2023-04-17 | 2023-04-20 |    500 | NO se otorga Licencia artículo 23A a María Rosa Gallo debido a que supera el tope de 30 días de licencia                   |
      | 99300000 | Homero      | Manzi      |      36A | NO          | ASUNTOS PARTICULARES          | 2023-05-08 | 2023-05-08 |    200 | Se otorga Licencia artículo 36A a Homero Manzi                                                                             |
      | 99300000 | Homero      | Manzi      |      36A | NO          | ASUNTOS PARTICULARES          | 2023-05-11 | 2023-05-11 |    200 | Se otorga Licencia artículo 36A a Homero Manzi                                                                             |
      | 99300000 | Homero      | Manzi      |      36A | NO          | ASUNTOS PARTICULARES          | 2023-05-20 | 2023-05-20 |    500 | NO se otorga Licencia artículo 36A a Homero Manzi debido a que supera el tope de 2 días de licencia por mes                |
      | 99300000 | Homero      | Manzi      |      36A | NO          | ASUNTOS PARTICULARES          | 2023-08-13 | 2023-08-14 |    200 | Se otorga Licencia artículo 36A a Homero Manzi                                                                             |
      | 99300000 | Homero      | Manzi      |      36A | NO          | ASUNTOS PARTICULARES          | 2023-09-24 | 2023-09-25 |    200 | Se otorga Licencia artículo 36A a Homero Manzi                                                                             |
      | 99300000 | Homero      | Manzi      |      36A | NO          | ASUNTOS PARTICULARES          | 2023-11-04 | 2023-11-04 |    500 | NO se otorga Licencia artículo 36A a Homero Manzi debido a que supera el tope de 6 días de licencia por año                |
      | 99999999 | Raúl        | Guitierrez |      36A | NO          | ASUNTOS PARTICULARES          | 2023-03-04 | 2023-03-04 |    500 | NO se otorga Licencia artículo 36A a Raúl Guitierrez debido a que el agente no posee ningún cargo en la institución        |
      | 88888888 | Marisa      | Balaguer   |      36A | NO          | ASUNTOS PARTICULARES          | 2023-03-04 | 2023-03-04 |    500 | NO se otorga Licencia artículo 36A a Marisa Balaguer debido a que el agente no tiene designación ese día en la institución |
      | 20200200 | Susana      | Álvarez    |       5A | NO          | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-12 | 2023-06-10 |    500 | NO se otorga Licencia artículo 5A a Susana Álvarez debido a que no presentó certificado médico                             |
      | 20200200 | Susana      | Álvarez    |       5A | SI          | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-12 | 2023-06-10 |    200 | Se otorga Licencia artículo 5A a Susana Álvarez                                                                            |
      | 20000000 | Rosalía     | Fernandez  |       5A | SI          | ENFERMEDAD DE CORTA EVOLUCIÓN | 2024-07-05 | 2024-08-03 |    200 | Se otorga Licencia artículo 5A a Rosalía Fernandez                                                                         |

  Escenario: 1 persona en instancias de designación de cargo que cubre una licencia de otra persona en la misma designación. Infomar que está correcto y que reemplaza al docente que solicitó licencia.
    Dado que existe la persona
      | DNI      | Nombre | Apellido |
      | 70700700 | Jorge  | Dismal   |
    Y que existen las siguientes instancias de designación asignada
      | TipoDesignacion | NombreTipoDesignacion | CargaHoraria |
      | CARGO           | Preceptor/a           |           36 |
    Y que la instancia de designación está asignada a la persona con licencia "5A" comprendida en el período desde "2020-05-12" hasta "2020-06-30"
      | DNI      | Nombre | Apellido | Desde      | Hasta      |
      | 20200200 | Susana | Álvarez  | 2020-03-01 | 2020-12-31 |
    Cuando se solicita el servicio de designación de la persona al cargo en el período comprendido desde "2020-05-17" hasta "2020-06-29"
    Entonces se recupera el mensaje
      """
      {
         "status": 200,
         "message": "Jorge Dismal ha sido designado/a al cargo prceptor/a exitosamente, en reemplado de Susana Álvarez"
      }
      """

  Escenario: 1 persona en instancias de designación de cargo que cubre una licencia de otra persona en la misma designación, pero que no coincide el mismo período. Infomar el error respectivo y abortar la transacción.
    Dado que existe la persona
      | DNI      | Nombre | Apellido |
      | 80800800 | Analía | Rojas    |
    Y que existen las siguientes instancias de designación asignada
      | TipoDesignacion | NombreTipoDesignacion | CargaHoraria |
      | cargo           | Auxiliar  ADM         |           30 |
    Y que la instancia de designación está asignada a la persona
      | DNI      | Nombre  | Apellido  | Desde      | Hasta      |
      | 20000000 | Rosalía | Fernandez | 2020-03-01 | 2020-12-31 |
    Y que la instancia de designación está asignada a la persona con licencia "5A" comprendida en el período desde "2020-07-05" hasta "2020-09-15"
    Cuando se solicita el servicio de designación de la persona al cargo en el período comprendido desde "2020-06-05" hasta "2020-09-15"
    Entonces se recupera el mensaje
      """
      {
         "status": 500,
         "message": "Analía Rojas NO ha sido designado/a al cargo auxiliar ya cuenta con Rosalía Fernandez asignada al mismo en el período"
      }
      """
