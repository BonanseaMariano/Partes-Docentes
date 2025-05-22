package unpsjb.labprog.backend.business.validator.cargo;

import java.util.List;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;

/**
 * Validador que implementa las reglas de negocio para la entidad Cargo
 * 
 * @see Cargo
 */
@Component
public class CargoValidator {

    private final List<CargoValidationRule> validationRules;

    /**
     * Constructor que recibe una lista de reglas de validación
     * 
     * @param validationRules Lista de reglas de validación
     */
    public CargoValidator(List<CargoValidationRule> validationRules) {
        this.validationRules = validationRules;
    }

    /**
     * Valida todas las reglas de negocio específicas para los cargos
     * 
     * @param cargo Cargo a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    public void validar(Cargo cargo) throws BusinessLogicException {
        for (CargoValidationRule rule : validationRules) {
            rule.validate(cargo);
        }
    }
}
