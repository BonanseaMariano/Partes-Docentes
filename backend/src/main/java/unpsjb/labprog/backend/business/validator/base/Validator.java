package unpsjb.labprog.backend.business.validator.base;

import unpsjb.labprog.backend.exception.BusinessLogicException;

/**
 * Interfaz base para todos los validadores del sistema.
 */
public interface Validator<T> {

    /**
     * Ejecuta la validación sobre la entidad proporcionada
     *
     * @param entity Entidad a validar
     * @throws BusinessLogicException si la validación falla
     */
    void validate(T entity) throws BusinessLogicException;
}
