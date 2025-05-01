-- Primero eliminamos los cargos específicos de Cargo.feature
DELETE FROM cargos
WHERE
    nombre = 'Vicedirector/a'
    AND tipo_designacion = 'CARGO';

DELETE FROM cargos
WHERE
    nombre = 'Preceptor/a'
    AND tipo_designacion = 'CARGO';

DELETE FROM cargos
WHERE
    nombre = 'Historia'
    AND tipo_designacion = 'ESPACIO_CURRICULAR';

DELETE FROM cargos
WHERE
    nombre = 'Geografía'
    AND tipo_designacion = 'ESPACIO_CURRICULAR';

DELETE FROM cargos
WHERE
    nombre = 'Auxiliar ADM'
    AND tipo_designacion = 'CARGO';

DELETE FROM cargos
WHERE
    nombre = 'Auxiliar ACAD'
    AND tipo_designacion = 'CARGO';

DELETE FROM cargos
WHERE
    nombre = 'Matemática'
    AND tipo_designacion = 'ESPACIO_CURRICULAR';

-- Eliminamos las divisiones específicas de Division.feature
DELETE FROM divisiones
WHERE
    anio = 5
    AND num_division = 2
    AND orientacion = 'Biológicas'
    AND turno = 'MANANA';

DELETE FROM divisiones
WHERE
    anio = 3
    AND num_division = 1
    AND orientacion = 'Sociales'
    AND turno = 'TARDE';

DELETE FROM divisiones
WHERE
    anio = 3
    AND num_division = 1
    AND orientacion = 'Informática'
    AND turno = 'TARDE';

-- También eliminamos las posibles variaciones en el formato del turno
DELETE FROM divisiones
WHERE
    anio = 5
    AND num_division = 2
    AND orientacion = 'Biológicas';

DELETE FROM divisiones
WHERE
    anio = 3
    AND num_division = 1
    AND orientacion = 'Sociales';

DELETE FROM divisiones
WHERE
    anio = 3
    AND num_division = 1
    AND orientacion = 'Informática';

-- Eliminamos las personas específicas de Persona.feature por DNI
DELETE FROM personas
WHERE
    dni = '10100100';

DELETE FROM personas
WHERE
    dni = '20200200';

DELETE FROM personas
WHERE
    dni = '30300300';

DELETE FROM personas
WHERE
    dni = '40400400';

DELETE FROM personas
WHERE
    dni = '50500500';

DELETE FROM personas
WHERE
    dni = '60600600';

DELETE FROM personas
WHERE
    dni = '70700700';

DELETE FROM personas
WHERE
    dni = '20000000';

DELETE FROM personas
WHERE
    dni = '80800800';

-- Si se necesita una limpieza más agresiva (eliminar todo)
-- Descomentar estas líneas:
-- DELETE FROM cargos;
-- DELETE FROM divisiones;
-- DELETE FROM personas;