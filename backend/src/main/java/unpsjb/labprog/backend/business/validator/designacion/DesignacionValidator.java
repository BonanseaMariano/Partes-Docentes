package unpsjb.labprog.backend.business.validator.designacion;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.validator.FechaValidationRule;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Designacion;

/**
 * Validador que implementa las reglas de negocio para la entidad Designacion
 *
 * @see Designacion
 */
@Component
public class DesignacionValidator {

    private final List<DesignacionValidationRule> validationRules;

    @Autowired
    private FechaValidationRule fechaValidationRule;

    /**
     * Constructor que recibe una lista de reglas de validación
     *
     * @param validationRules Lista de reglas de validación
     */
    public DesignacionValidator(List<DesignacionValidationRule> validationRules) {
        this.validationRules = validationRules;
    }

    /**
     * Valida todas las reglas de negocio específicas para las designaciones
     *
     * @param designacion Designación a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    public void validar(Designacion designacion) throws BusinessLogicException {
        // PRIMERA REGLA: Validar fechas (solo si fecha fin no es null)
        if (designacion.getFechaFin() != null) {
            fechaValidationRule.validarRangoFechas(
                    designacion.getFechaInicio(),
                    designacion.getFechaFin()
            );
        }

        // Resto de reglas específicas
        for (DesignacionValidationRule rule : validationRules) {
            rule.validate(designacion);
        }
    }
}
