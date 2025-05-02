-- Script para configurar el entorno de pruebas
-- Orden correcto respetando dependencias de claves foráneas
-- 1. Primero eliminamos TODAS las designaciones para evitar problemas con claves foráneas
-- (esto es crítico para evitar errores de restricciones)
DELETE FROM designaciones;

-- 2. Luego eliminamos los cargos que referencian a divisiones
DELETE FROM cargos
WHERE
    division_id IN (
        SELECT
            id
        FROM
            divisiones
        WHERE
            (
                anio = 5
                AND num_division = 2
                AND orientacion = 'Sociales'
            )
            OR (
                anio = 3
                AND num_division = 1
                AND orientacion = 'Sociales'
            )
            OR (
                anio = 3
                AND num_division = 1
                AND orientacion = 'General'
            )
            OR (
                anio = 1
                AND num_division = 1
                AND orientacion = 'Economía'
            )
            OR (
                anio = 2
                AND num_division = 3
                AND orientacion = 'Ciencias'
            )
            OR (
                anio = 4
                AND num_division = 3
                AND orientacion = 'Informatica'
            )
    );

-- 3. Ahora eliminamos los cargos específicos de Cargo.feature
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

DELETE FROM cargos
WHERE
    nombre = 'Física'
    AND tipo_designacion = 'ESPACIO_CURRICULAR';

DELETE FROM cargos
WHERE
    nombre = 'Tecnología'
    AND tipo_designacion = 'ESPACIO_CURRICULAR';

-- 4. Eliminamos las divisiones específicas de Division.feature
-- Eliminamos con los diferentes formatos del turno
DELETE FROM divisiones
WHERE
    (
        anio = 5
        AND num_division = 2
        AND orientacion = 'Sociales'
    )
    OR (
        anio = 3
        AND num_division = 1
        AND orientacion = 'Sociales'
    )
    OR (
        anio = 3
        AND num_division = 1
        AND orientacion = 'General'
    )
    OR (
        anio = 1
        AND num_division = 1
        AND orientacion = 'Economía'
    )
    OR (
        anio = 2
        AND num_division = 3
        AND orientacion = 'Ciencias'
    )
    OR (
        anio = 4
        AND num_division = 3
        AND orientacion = 'Informatica'
    );

-- 5. Eliminamos las personas específicas de Persona.feature por DNI
DELETE FROM personas
WHERE
    dni IN (
        '10100100',
        '20200200',
        '30300300',
        '40400400',
        '50500500',
        '60600600',
        '70700700',
        '20000000',
        '80800800',
        '99100000',
        '99200000',
        '99300000'
    );