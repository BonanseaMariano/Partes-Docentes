package unpsjb.labprog.backend.business.validator.designacion;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.validator.base.GenericFechaValidator;
import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.factory.DesignacionValidatorFactory;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Designacion;

/**
 * Validador principal para designaciones que utiliza el patrón Factory con
 * reflexión automática para cargar validadores específicos dinámicamente.
 * Implementa carga lazy, cache de instancias y patrón Singleton en validadores.
 * No requiere archivos de configuración, utiliza convenciones de nomenclatura
 * para cargar los validadores.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Component
public class DesignacionValidator {

    /**
     * Factory para crear validadores específicos de designación
     */
    private final DesignacionValidatorFactory validatorFactory;

    /**
     * Constructor que inicializa el factory de validadores.
     */
    public DesignacionValidator() {
        this.validatorFactory = DesignacionValidatorFactory.getInstance();
    }

    /**
     * Valida todas las reglas de negocio específicas para las designaciones
     * usando el patrón Factory para cargar validadores dinámicamente.
     *
     * @param designacion la designación a validar
     * @throws BusinessLogicException si no se cumplen las reglas de negocio
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
