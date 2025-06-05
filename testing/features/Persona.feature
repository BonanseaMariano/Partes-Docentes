# language: es
Característica: Gestión de personas
Módulo responsable de administrar a las personas del sistema

  Esquema del escenario: ingresar nuevas personas
    Dada la persona con "<nombre>" "<apellido>" <DNI> <CUIL> <sexo> "<título>" "<domicilio>" "<teléfono>"
    Cuando se presiona el botón de guardar para persona
    Entonces se espera el siguiente <status> con la "<respuesta>"

    Ejemplos:
      | DNI      | nombre      | apellido     | CUIL        | sexo | título                       | domicilio      | teléfono           | status | respuesta                                                      |
      | 10100100 | Alberto     | Lopez        | 27101001009 | M    | Profesor de Biología         | Charcas 54     | +54 (280) 411-1111 |    200 | Alberto Lopez con DNI 10100100 ingresado/a correctamente       |
      | 20200200 | Susana      | Álvarez      | 20202002009 | F    | Profesora de historia        | Mitre 154      | +54 (280) 422-2222 |    200 | Susana Álvarez con DNI 20200200 ingresado/a correctamente      |
      | 30300300 | Pedro       | Benítez      | 27303003009 | M    |                              | Jujuy 255      | +54 (280) 433-3333 |    200 | Pedro Benítez con DNI 30300300 ingresado/a correctamente       |
      | 40400400 | Marisa      | Amuchástegui | 20404004009 | F    | Profesora de historia        | Zar 555        | +54 (280) 444-4444 |    200 | Marisa Amuchástegui con DNI 40400400 ingresado/a correctamente |
      | 50500500 | Raúl        | Gómez        | 27505005009 | M    | Profesor de Geografía        | Roca 2458      | +54 (280) 455-5555 |    200 | Raúl Gómez con DNI 50500500 ingresado/a correctamente          |
      | 60600600 | Inés        | Torres       | 20606006009 | F    | Licenciada en Geografía      | La Pampa 322   | +54 (280) 466-6666 |    200 | Inés Torres con DNI 60600600 ingresado/a correctamente         |
      | 70700700 | Jorge       | Dismal       | 27707007009 | M    |                              | Mitre 1855     | +54 (280) 477-7777 |    200 | Jorge Dismal con DNI 70700700 ingresado/a correctamente        |
      | 20000000 | Rosalía     | Fernandez    | 20200000009 | F    | Maestra de grado             | Maiz 356       | +54 (280) 420-0000 |    200 | Rosalía Fernandez con DNI 20000000 ingresado/a correctamente   |
      | 80800800 | Analía      | Rojas        | 20808008009 | F    | Técnica superior             | Rosa 556       | +54 (280) 488-8888 |    200 | Analía Rojas con DNI 80800800 ingresado/a correctamente        |
      | 99100000 | Ermenegildo | Sabat        | 20991000003 | M    | Profesor de Física           | Belgrano 742   | +54 (280) 499-9999 |    200 | Ermenegildo Sabat con DNI 99100000 ingresado/a correctamente   |
      | 99200000 | María Rosa  | Gallo        | 27992000009 | F    | Profesora de Matemática      | Sarmiento 829  | +54 (280) 410-0000 |    200 | María Rosa Gallo con DNI 99200000 ingresado/a correctamente    |
      | 99300000 | Homero      | Manzi        | 20993000008 | M    | Profesor de Tecnología       | San Martín 427 | +54 (280) 430-0000 |    200 | Homero Manzi con DNI 99300000 ingresado/a correctamente        |
      | 88888888 | Marisa      | Balaguer     | 20888888009 | F    | Profesora de Literatura      | Rawson 123     | +54 (280) 444-8888 |    200 | Marisa Balaguer con DNI 88888888 ingresado/a correctamente     |
      | 99999999 | Raúl        | Guitierrez   | 20999999009 | M    | Profesor de Química          | San Martín 456 | +54 (280) 499-9999 |    200 | Raúl Guitierrez con DNI 99999999 ingresado/a correctamente     |
      | 88100000 | Raúl        | Orellanos    | 20881000009 | M    | Profesor de Educación Física | Rivadavia 789  | +54 (280) 481-0000 |    200 | Raúl Orellanos con DNI 88100000 ingresado/a correctamente      |
      | 88200000 | Matías      | Barto        | 20882000009 | M    | Profesor de Matemática       | Belgrano 123   | +54 (280) 482-0000 |    200 | Matías Barto con DNI 88200000 ingresado/a correctamente        |
      | 88300000 | Andrea      | Sosa         | 27883000009 | F    | Profesora de Lengua          | Moreno 456     | +54 (280) 483-0000 |    200 | Andrea Sosa con DNI 88300000 ingresado/a correctamente         |
      | 88410000 | Laura       | Barrientos   | 27884100009 | F    | Profesora de Ciencias        | Alsina 789     | +54 (280) 484-1000 |    200 | Laura Barrientos con DNI 88410000 ingresado/a correctamente    |
      | 88500000 | Natalia     | Zabala       | 27885000009 | F    | Profesora de Historia        | Saavedra 321   | +54 (280) 485-0000 |    200 | Natalia Zabala con DNI 88500000 ingresado/a correctamente      |
      | 88600000 | Marta       | Ríos         | 27886000009 | F    | Profesora de Arte            | Yrigoyen 654   | +54 (280) 486-0000 |    200 | Marta Ríos con DNI 88600000 ingresado/a correctamente          |
      | 88700000 | Rosalía     | Ramón        | 27887000009 | F    | Profesora de Música          | Pellegrini 987 | +54 (280) 487-0000 |    200 | Rosalía Ramón con DNI 88700000 ingresado/a correctamente       |
      | 88800000 | José        | Pérez        | 20888000009 | M    | Profesor de Tecnología       | Maipú 135      | +54 (280) 488-0000 |    200 | José Pérez con DNI 88800000 ingresado/a correctamente          |
      | 11111111 | Susana      | Giménez      | 27111111119 | F    | Profesora de Matemática      | Belgrano 789   | +54 (280) 411-1111 |    200 | Susana Giménez con DNI 11111111 ingresado/a correctamente      |
      | 99300000 | Luis        | Perez        | 20884000008 | M    | Profesor de Quimica          | Rivadavia 123  | +54 (280) 420-0000 |    500 | Ya existe una persona con el mismo DNI o CUIL                  |
      | 88400000 | Carla       | Guitierrez   | 20993000008 | F    | Profesora de Artes           | Lavalle 1425   | +54 (280) 450-0000 |    500 | Ya existe una persona con el mismo DNI o CUIL                  |
