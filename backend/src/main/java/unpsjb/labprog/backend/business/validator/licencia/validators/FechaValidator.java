package unpsjb.labprog.backend.business.validator.licencia.validators;

import unpsjb.labprog.backend.business.validator.FechaValidationRule;
import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador para verificar fechas de licencias.
 * Implementa el patrón Singleton requerido por el ValidatorFactory.
 */
public class FechaValidator implements Validator<Licencia> {

    // Singleton
    private static FechaValidator instance = null;
    private FechaValidationRule fechaValidationRule;

    private FechaValidator() {
        // Constructor privado para Singleton
        // La inyección se hará después de la creación
    }

    public static FechaValidator getInstance() {
        if (instance == null)
            instance = new FechaValidator();
        return instance;
    }

    /**
     * Método para inyectar dependencias después de la creación
     */
    public void setFechaValidationRule(FechaValidationRule fechaValidationRule) {
        this.fechaValidationRule = fechaValidationRule;
    }

    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        if (fechaValidationRule == null) {
            throw new IllegalStateException("FechaValidationRule no ha sido inyectado");
        }

        // Validar rango de fechas
        fechaValidationRule.validarRangoFechas(
                licencia.getPedidoDesde(),
                licencia.getPedidoHasta()
        );
    }
}
