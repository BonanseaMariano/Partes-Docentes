package unpsjb.labprog.backend.business.validator.designacion;

import java.util.List;

import org.springframework.stereotype.Component;

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
        for (DesignacionValidationRule rule : validationRules) {
            rule.validate(designacion);
        }
    }
}
