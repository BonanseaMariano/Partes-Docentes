# language: es
Característica: Emitir el parte diario de licencias de una escuela para un determinado día

  Escenario: Verificar el funcionamiento de licencias para un día
    Dada la existencia de las siguientes licencias
      | DNI      | Nombre      | Apellido   | Artículo | Descripción                   | Desde      | Hasta      |
      | 88100000 | Raúl        | Orellanos  |       5A | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-07 | 2023-05-15 |
      | 88200000 | Matías      | Barto      |       5A | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-10 | 2023-05-15 |
      | 88300000 | Andrea      | Sosa       |       5A | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-11 | 2023-05-17 |
      | 88410000 | Laura       | Barrientos |      23A | ATENCIÓN DE UN MIEMBRO DEL GF | 2023-05-08 | 2023-05-16 |
      | 88500000 | Natalia     | Zabala     |      23A | ATENCIÓN DE UN MIEMBRO DEL GF | 2023-05-13 | 2023-05-22 |
      | 99100000 | Ermenegildo | Sabat      |       5A | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-07 | 2023-05-17 |
    Y que se otorgan las siguientes nuevas licencias
      | DNI      | Nombre  | Apellido | Artículo | Descripción          | Desde      | Hasta      |
      | 88600000 | Marta   | Ríos     |      36A | ASUNTOS PARTICULARES | 2023-05-15 | 2023-05-15 |
      | 88700000 | Rosalía | Ramón    |      36A | ASUNTOS PARTICULARES | 2023-05-15 | 2023-05-15 |
      | 88800000 | José    | Pérez    |      36A | ASUNTOS PARTICULARES | 2023-05-15 | 2023-05-15 |
    Cuando se solicita el parte diario para la fecha "2023-05-15"
    Entonces el sistema responde
      """
      { "ParteDiario": {
            "Fecha": "2023-05-15",
            "Docentes": [
               {"DNI": 88100000, "Nombre": "Raúl", "Apellido": "Orellanos","Artículo": "5A", "Descripción": "ENFERMEDAD DE CORTA EVOLUCIÓN","Desde": "2023-05-07", "Hasta": "2023-05-15"},
               {"DNI": 88200000, "Nombre": "Matías", "Apellido": "Barto","Artículo": "5A", "Descripción": "ENFERMEDAD DE CORTA EVOLUCIÓN","Desde": "2023-05-10", "Hasta": "2023-05-15"},
               {"DNI": 88300000, "Nombre": "Andrea", "Apellido": "Sosa","Artículo": "5A", "Descripción": "ENFERMEDAD DE CORTA EVOLUCIÓN","Desde": "2023-05-11", "Hasta": "2023-05-17"},
               {"DNI": 88410000, "Nombre": "Laura", "Apellido": "Barrientos","Artículo": "23A", "Descripción": "ATENCIÓN DE UN MIEMBRO DEL GF","Desde": "2023-05-08", "Hasta": "2023-05-16"},
               {"DNI": 88500000, "Nombre": "Natalia", "Apellido": "Zabala","Artículo": "23A", "Descripción": "ATENCIÓN DE UN MIEMBRO DEL GF","Desde": "2023-05-13", "Hasta": "2023-05-22"},
               {"DNI": 99100000, "Nombre": "Ermenegildo", "Apellido": "Sabat","Artículo": "5A", "Descripción": "ENFERMEDAD DE CORTA EVOLUCIÓN","Desde": "2023-05-07", "Hasta": "2023-05-17"},
               {"DNI": 88600000, "Nombre": "Marta", "Apellido": "Ríos","Artículo": "36A", "Descripción": "ASUNTOS PARTICULARES","Desde": "2023-05-15", "Hasta": "2023-05-15"},
               {"DNI": 88700000, "Nombre": "Rosalía", "Apellido": "Ramón","Artículo": "36A", "Descripción": "ASUNTOS PARTICULARES","Desde": "2023-05-15", "Hasta": "2023-05-15"},
               {"DNI": 88800000, "Nombre": "José", "Apellido": "Pérez","Artículo": "36A", "Descripción": "ASUNTOS PARTICULARES","Desde": "2023-05-15", "Hasta": "2023-05-15"}
            ]
         }
      }
      """

  Escenario: Verificar el parte diario luego de trasncurridos 2 días
    Dada la existencia de las siguientes licencias
      | DNI      | Nombre      | Apellido   | Artículo | Descripción                   | Desde      | Hasta      |
      | 88100000 | Raúl        | Orellanos  |       5A | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-07 | 2023-05-15 |
      | 88200000 | Matías      | Barto      |       5A | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-10 | 2023-05-15 |
      | 88300000 | Andrea      | Sosa       |       5A | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-11 | 2023-05-17 |
      | 88410000 | Laura       | Barrientos |      23A | ATENCIÓN DE UN MIEMBRO DEL GF | 2023-05-08 | 2023-05-16 |
      | 88500000 | Natalia     | Zabala     |      23A | ATENCIÓN DE UN MIEMBRO DEL GF | 2023-05-13 | 2023-05-22 |
      | 99100000 | Ermenegildo | Sabat      |       5A | ENFERMEDAD DE CORTA EVOLUCIÓN | 2023-05-07 | 2023-05-17 |
    Cuando se solicita el parte diario para la fecha "2023-05-17"
    Entonces el sistema responde
      """
      { "ParteDiario": {
            "Fecha": "2023-05-17",
            "Docentes": [
               {"DNI": 88300000, "Nombre": "Andrea", "Apellido": "Sosa","Artículo": "5A", "Descripción": "ENFERMEDAD DE CORTA EVOLUCIÓN","Desde": "2023-05-11", "Hasta": "2023-05-17"},
               {"DNI": 88500000, "Nombre": "Natalia", "Apellido": "Zabala","Artículo": "23A", "Descripción": "ATENCIÓN DE UN MIEMBRO DEL GF","Desde": "2023-05-13", "Hasta": "2023-05-22"},
               {"DNI": 99100000, "Nombre": "Ermenegildo", "Apellido": "Sabat","Artículo": "5A", "Descripción": "ENFERMEDAD DE CORTA EVOLUCIÓN","Desde": "2023-05-07", "Hasta": "2023-05-17"}
            ]
         }
      }
      """
