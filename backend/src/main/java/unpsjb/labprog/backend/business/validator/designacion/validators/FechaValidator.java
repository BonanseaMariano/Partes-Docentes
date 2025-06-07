package unpsjb.labprog.backend.business.validator.designacion.validators;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Designacion;

/**
 * Validador para verificar fechas de designaciones.
 * Implementa el patrón Singleton requerido por el DesignacionValidatorFactory.
 */
public class FechaValidator implements Validator<Designacion> {

    // Singleton
    private static FechaValidator instance = null;

    private FechaValidator() {
        // Constructor privado para Singleton
    }

    public static FechaValidator getInstance() {
        if (instance == null)
            instance = new FechaValidator();
        return instance;
    }

    @Override
    public void validate(Designacion designacion) throws BusinessLogicException {
        // Validar rango de fechas solo si fecha fin no es null
        if (designacion.getFechaFin() != null && designacion.getFechaInicio() != null 
            && designacion.getFechaInicio().isAfter(designacion.getFechaFin())) {
            throw new BusinessLogicException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }
    }
}
