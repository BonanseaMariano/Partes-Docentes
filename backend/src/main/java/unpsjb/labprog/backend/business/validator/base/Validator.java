package unpsjb.labprog.backend.business.validator.base;

import unpsjb.labprog.backend.exception.BusinessLogicException;

/**
 * Interfaz base para todos los validadores del sistema. Define el contrato
 * común que deben cumplir todas las implementaciones de validadores de
 * entidades.
 *
 * @param <T> el tipo de entidad que será validada
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public interface Validator<T> {

    /**
     * Ejecuta la validación sobre la entidad proporcionada. Si la validación
     * falla, debe lanzar una excepción de lógica de negocio.
     *
     * @param entity la entidad a validar
     * @throws BusinessLogicException si la validación falla
     */
    void validate(T entity) throws BusinessLogicException;
}
