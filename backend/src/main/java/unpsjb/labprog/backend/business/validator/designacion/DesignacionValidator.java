package unpsjb.labprog.backend.business.validator.designacion;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.validator.base.GenericFechaValidator;
import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.factory.DesignacionValidatorFactory;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Designacion;

/**
 * Validador principal para designaciones que utiliza el patrón Factory con
 * reflexión automática. Implementa carga lazy, cache de instancias y patrón
 * Singleton en validadores. No requiere archivos de configuración - utiliza
 * convenciones de nomenclatura.
 */
@Component
public class DesignacionValidator {

    private final DesignacionValidatorFactory validatorFactory;

    /**
     * Constructor que inicializa el factory
     */
    public DesignacionValidator() {
        this.validatorFactory = DesignacionValidatorFactory.getInstance();
    }

    /**
     * Valida todas las reglas de negocio específicas para las designaciones
     * usando el patrón Factory
     *
     * @param designacion Designación a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    public void validar(Designacion designacion) throws BusinessLogicException {
        // PRIMERA REGLA: Validar fechas usando validador genérico
        GenericFechaValidator<Designacion> fechaValidator = GenericFechaValidator.getInstance();
        fechaValidator.validate(designacion);

        // SEGUNDA REGLA: Validar solapamiento de designaciones
        Validator<Designacion> solapamientoValidator = validatorFactory.getValidator("solapamiento");
        if (solapamientoValidator != null) {
            solapamientoValidator.validate(designacion);
        }
    }
}
