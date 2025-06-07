package unpsjb.labprog.backend.business.validator.cargo.validators;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;

/**
 * Validador para verificar fechas de cargos.
 * Implementa el patrón Singleton requerido por el CargoValidatorFactory.
 */
public class FechaValidator implements Validator<Cargo> {

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
    public void validate(Cargo cargo) throws BusinessLogicException {
        // Validar que las fechas no sean nulas y que la fecha de inicio no sea posterior a la fecha de fin
        if (cargo.getFechaInicio() != null && cargo.getFechaFin() != null 
            && cargo.getFechaInicio().isAfter(cargo.getFechaFin())) {
            throw new BusinessLogicException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }
    }
}
