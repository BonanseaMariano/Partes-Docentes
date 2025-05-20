-- Script para configurar el entorno de pruebas
-- Orden correcto respetando dependencias de claves foráneas
-- ################################################################
-- IMPORTANTE: ELIMINAMOS PRIMERO LAS ENTIDADES CON DEPENDENCIAS
-- ################################################################
DELETE FROM licencia_designacion;

DELETE FROM licencias;

DELETE FROM articulos_licencia;

DELETE FROM designaciones;

DELETE FROM horarios;

DELETE FROM cargos;

DELETE FROM divisiones;

DELETE FROM personas;

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