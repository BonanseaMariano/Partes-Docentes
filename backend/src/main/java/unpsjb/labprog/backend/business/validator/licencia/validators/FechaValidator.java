package unpsjb.labprog.backend.business.validator.licencia.validators;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador para verificar fechas de licencias. Implementa el patrón Singleton
 * requerido por el ValidatorFactory.
 */
public class FechaValidator implements Validator<Licencia> {

    // Singleton
    private static FechaValidator instance = null;

    private FechaValidator() {
        // Constructor privado para Singleton
    }

    public static FechaValidator getInstance() {
        if (instance == null) {
            instance = new FechaValidator();
        }
        return instance;
    }

    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        // Validar que las fechas no sean nulas y que la fecha de inicio no sea posterior a la fecha de fin
        if (licencia.getPedidoDesde() != null && licencia.getPedidoHasta() != null
                && licencia.getPedidoDesde().isAfter(licencia.getPedidoHasta())) {
            throw new BusinessLogicException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }
    }
}
