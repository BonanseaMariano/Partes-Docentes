-- Script para configurar el entorno de pruebas
-- Orden correcto respetando dependencias de claves foráneas
-- ################################################################
-- IMPORTANTE: ELIMINAMOS PRIMERO LAS ENTIDADES CON DEPENDENCIAS
-- ################################################################
-- 1. Primero eliminamos TODAS las designaciones para evitar problemas con claves foráneas
-- (esto es crítico para evitar errores de restricciones)
DELETE FROM designaciones;

-- 2. Luego eliminamos las licencias si existieran
DELETE FROM licencias;

-- 3. Luego eliminamos los artículos de licencia si existieran
DELETE FROM articulos_licencia;

-- 4. Luego eliminamos los horarios si existieran
DELETE FROM horarios;

-- 5. Luego eliminamos los cargos que referencian a divisiones
-- Identificamos todos los cargos mencionados en los archivos feature
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

-- 6. Eliminamos por nombre todos los cargos específicos mencionados en los features
DELETE FROM cargos
WHERE
    (
        nombre = 'Vicedirector/a'
        AND tipo_designacion = 'CARGO'
    )
    OR (
        nombre = 'Preceptor/a'
        AND tipo_designacion = 'CARGO'
    )
    OR (
        nombre = 'Historia'
        AND tipo_designacion = 'ESPACIO_CURRICULAR'
    )
    OR (
        nombre = 'Geografía'
        AND tipo_designacion = 'ESPACIO_CURRICULAR'
    )
    OR (
        nombre = 'Auxiliar ADM'
        AND tipo_designacion = 'CARGO'
    )
    OR (
        nombre = 'Auxiliar ACAD'
        AND tipo_designacion = 'CARGO'
    )
    OR (
        nombre = 'Matemática'
        AND tipo_designacion = 'ESPACIO_CURRICULAR'
    )
    OR (
        nombre = 'Física'
        AND tipo_designacion = 'ESPACIO_CURRICULAR'
    )
    OR (
        nombre = 'Tecnología'
        AND tipo_designacion = 'ESPACIO_CURRICULAR'
    );

-- 7. Eliminamos las divisiones específicas mencionadas en los features
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

-- 8. Eliminamos las personas específicas mencionadas en los features por DNI
DELETE FROM personas
WHERE
    dni IN (
        '10100100', -- Alberto Lopez
        '20200200', -- Susana Álvarez
        '30300300', -- Pedro Benítez
        '40400400', -- Marisa Amuchástegui
        '50500500', -- Raúl Gómez
        '60600600', -- Inés Torres
        '70700700', -- Jorge Dismal
        '20000000', -- Rosalía Fernandez
        '80800800', -- Analía Rojas
        '99100000', -- Ermenegildo Sabat
        '99200000', -- María Rosa Gallo
        '99300000', -- Homero Manzi
        '88400000', -- Carla Gutierrez (mencionada en Persona.feature para validar CUIL idéntico)
        '99400000' -- Se agrega por si se incluye en futuros tests
    );

-- ################################################################
-- CREACIÓN DE DATOS PARA LAS PRUEBAS
-- ################################################################
-- 1. Insertamos los artículos de licencia necesarios para las pruebas
-- Los artículos se obtienen del archivo Control_licencia.feature
INSERT INTO
    articulos_licencia (id, articulo, descripcion)
VALUES
    (1, '5A', 'ENFERMEDAD DE CORTA EVOLUCIÓN'),
    (2, '23A', 'ATENCIÓN DE UN MIEMBRO DEL GF'),
    (3, '36A', 'ASUNTOS PARTICULARES');