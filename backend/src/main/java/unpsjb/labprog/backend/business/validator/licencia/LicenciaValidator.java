package unpsjb.labprog.backend.business.validator.licencia;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.base.ValidatorFactory;
import unpsjb.labprog.backend.business.validator.licencia.validators.Articulo23aValidator;
import unpsjb.labprog.backend.business.validator.licencia.validators.Articulo36aValidator;
import unpsjb.labprog.backend.business.validator.licencia.validators.Articulo5aValidator;
import unpsjb.labprog.backend.business.validator.licencia.validators.DesignacionesValidator;
import unpsjb.labprog.backend.business.validator.licencia.validators.SolapamientoValidator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador principal para licencias que utiliza el patrón Factory con reflexión automática.
 * Implementa carga lazy, cache de instancias y patrón Singleton en validadores.
 * No requiere archivos de configuración - utiliza convenciones de nomenclatura.
 */
@Component
public class LicenciaValidator {

    private final ValidatorFactory validatorFactory;

    @Autowired
    private LicenciaRepository licenciaRepository;

    @Autowired
    private DesignacionRepository designacionRepository;

    /**
     * Constructor que inicializa el factory y configura las dependencias
     */
    public LicenciaValidator() {
        this.validatorFactory = ValidatorFactory.getInstance();
    }

    /**
     * Valida todas las reglas de negocio específicas para las licencias usando el patrón Factory
     *
     * @param licencia Licencia a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    public void validar(Licencia licencia) throws BusinessLogicException {
        // Inyectar dependencias en los validadores antes de usarlos
        inyectarDependencias();

        // PRIMERA REGLA: Validar fechas
        Validator<Licencia> fechaValidator = validatorFactory.getValidator("fecha");
        if (fechaValidator != null) {
            fechaValidator.validate(licencia);
        }

        // SEGUNDA REGLA: Validar designaciones activas
        Validator<Licencia> designacionesValidator = validatorFactory.getValidator("designaciones");
        if (designacionesValidator != null) {
            designacionesValidator.validate(licencia);
        }

        // TERCERA REGLA: Validar solapamiento con otras licencias
        Validator<Licencia> solapamientoValidator = validatorFactory.getValidator("solapamiento");
        if (solapamientoValidator != null) {
            solapamientoValidator.validate(licencia);
        }

        // CUARTA REGLA: Validar reglas específicas del artículo
        String articuloCode = licencia.getArticuloLicencia().getArticulo().toLowerCase();
        Validator<Licencia> articuloValidator = validatorFactory.getValidator("articulo" + articuloCode);
        if (articuloValidator != null) {
            articuloValidator.validate(licencia);
        }
    }

    /**
     * Inyecta las dependencias en los validadores singleton después de su creación
     */
    private void inyectarDependencias() {
        // FechaValidator ya no necesita dependencias - es auto-suficiente

        // Inyectar dependencias en DesignacionesValidator
        DesignacionesValidator designacionesValidator = (DesignacionesValidator) validatorFactory.<Licencia>getValidator("designaciones");
        if (designacionesValidator != null) {
            designacionesValidator.setDesignacionRepository(designacionRepository);
        }

        // Inyectar dependencias en SolapamientoValidator
        SolapamientoValidator solapamientoValidator = (SolapamientoValidator) validatorFactory.<Licencia>getValidator("solapamiento");
        if (solapamientoValidator != null) {
            solapamientoValidator.setLicenciaRepository(licenciaRepository);
        }

        // Inyectar dependencias en validadores de artículos
        Articulo5aValidator articulo5aValidator = (Articulo5aValidator) validatorFactory.<Licencia>getValidator("articulo5a");
        if (articulo5aValidator != null) {
            articulo5aValidator.setLicenciaRepository(licenciaRepository);
        }

        Articulo23aValidator articulo23aValidator = (Articulo23aValidator) validatorFactory.<Licencia>getValidator("articulo23a");
        if (articulo23aValidator != null) {
            articulo23aValidator.setLicenciaRepository(licenciaRepository);
        }

        Articulo36aValidator articulo36aValidator = (Articulo36aValidator) validatorFactory.<Licencia>getValidator("articulo36a");
        if (articulo36aValidator != null) {
            articulo36aValidator.setLicenciaRepository(licenciaRepository);
        }
    }
}
