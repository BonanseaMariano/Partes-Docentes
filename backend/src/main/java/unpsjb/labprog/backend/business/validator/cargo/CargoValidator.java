package unpsjb.labprog.backend.business.validator.cargo;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.validator.base.CargoValidatorFactory;
import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;

/**
 * Validador principal para cargos que utiliza el patrón Factory con reflexión automática.
 * Implementa carga lazy, cache de instancias y patrón Singleton en validadores.
 * No requiere archivos de configuración - utiliza convenciones de nomenclatura.
 */
@Component
public class CargoValidator {

    private final CargoValidatorFactory validatorFactory;

    /**
     * Constructor que inicializa el factory
     */
    public CargoValidator() {
        this.validatorFactory = CargoValidatorFactory.getInstance();
    }

    /**
     * Valida todas las reglas de negocio específicas para los cargos usando el patrón Factory
     *
     * @param cargo Cargo a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    public void validar(Cargo cargo) throws BusinessLogicException {
        // Inyectar dependencias en los validadores antes de usarlos
        inyectarDependencias();

        // PRIMERA REGLA: Validar fechas
        Validator<Cargo> fechaValidator = validatorFactory.getValidator("fecha");
        if (fechaValidator != null) {
            fechaValidator.validate(cargo);
        }

        // SEGUNDA REGLA: Validar tipo de designación y división
        Validator<Cargo> tipoDesignacionValidator = validatorFactory.getValidator("tipodesignaciondivision");
        if (tipoDesignacionValidator != null) {
            tipoDesignacionValidator.validate(cargo);
        }
    }

    /**
     * Inyecta las dependencias en los validadores singleton después de su creación
     */
    private void inyectarDependencias() {
        // FechaValidator ya no necesita dependencias - es auto-suficiente
        // TipodesignaciondivisionValidator no necesita dependencias inyectadas
    }
}
