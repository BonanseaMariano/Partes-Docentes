package unpsjb.labprog.backend.business.validator.cargo;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.validator.base.GenericFechaValidator;
import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.factory.CargoValidatorFactory;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;

/**
 * Validador principal para cargos que utiliza el patrón Factory con reflexión
 * automática para cargar validadores específicos dinámicamente. Implementa
 * carga lazy, cache de instancias y patrón Singleton en validadores. No
 * requiere archivos de configuración, utiliza convenciones de nomenclatura para
 * cargar los validadores.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Component
public class CargoValidator {

    /**
     * Factory para crear validadores específicos de cargo
     */
    private final CargoValidatorFactory validatorFactory;

    /**
     * Constructor que inicializa el factory de validadores.
     */
    public CargoValidator() {
        this.validatorFactory = CargoValidatorFactory.getInstance();
    }

    /**
     * Valida todas las reglas de negocio específicas para los cargos usando el
     * patrón Factory para cargar validadores dinámicamente.
     *
     * @param cargo el cargo a validar
     * @throws BusinessLogicException si no se cumplen las reglas de negocio
     */
    public void validar(Cargo cargo) throws BusinessLogicException {

        // PRIMERA REGLA: Validar fechas usando validador genérico
        GenericFechaValidator<Cargo> fechaValidator = GenericFechaValidator.getInstance();
        fechaValidator.validate(cargo);

        // SEGUNDA REGLA: Validar tipo de designación y división
        Validator<Cargo> tipoDesignacionValidator = validatorFactory.getValidator("tipodesignaciondivision");
        if (tipoDesignacionValidator != null) {
            tipoDesignacionValidator.validate(cargo);
        }
    }
}
