package unpsjb.labprog.backend.business.validator;

import unpsjb.labprog.backend.exception.BusinessLogicException;

/**
 * Interfaz para reglas de validación genéricas
 */
public interface ValidationRule<T> {
    void validate(T entity) throws BusinessLogicException;
}