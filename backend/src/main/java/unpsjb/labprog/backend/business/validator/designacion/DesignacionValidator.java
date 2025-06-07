package unpsjb.labprog.backend.business.validator.designacion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.business.validator.base.DesignacionValidatorFactory;
import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.designacion.validators.SolapamientoValidator;
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

    @Autowired
    private DesignacionRepository designacionRepository;

    @Autowired
    private LicenciaRepository licenciaRepository;

    /**
     * Constructor que inicializa el factory y configura las dependencias
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
        // Inyectar dependencias en los validadores antes de usarlos
        inyectarDependencias();

        // PRIMERA REGLA: Validar fechas
        Validator<Designacion> fechaValidator = validatorFactory.getValidator("fecha");
        if (fechaValidator != null) {
            fechaValidator.validate(designacion);
        }

        // SEGUNDA REGLA: Validar solapamiento de designaciones
        Validator<Designacion> solapamientoValidator = validatorFactory.getValidator("solapamiento");
        if (solapamientoValidator != null) {
            solapamientoValidator.validate(designacion);
        }
    }

    /**
     * Inyecta las dependencias en los validadores singleton después de su
     * creación
     */
    private void inyectarDependencias() {
        // FechaValidator ya no necesita dependencias - es auto-suficiente

        // Inyectar dependencias en SolapamientoValidator
        SolapamientoValidator solapamientoValidator = (SolapamientoValidator) validatorFactory.<Designacion>getValidator("solapamiento");
        if (solapamientoValidator != null) {
            solapamientoValidator.setDesignacionRepository(designacionRepository);
            solapamientoValidator.setLicenciaRepository(licenciaRepository);
        }
    }
}
