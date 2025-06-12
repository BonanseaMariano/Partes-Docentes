package unpsjb.labprog.backend.business.validator.licencia;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.validator.base.GenericFechaValidator;
import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.factory.LicenciaValidatorFactory;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador principal para licencias que utiliza el patrón Factory con
 * reflexión automática. Implementa carga lazy, cache de instancias y patrón
 * Singleton en validadores. No requiere archivos de configuración - utiliza
 * convenciones de nomenclatura.
 */
@Component
public class LicenciaValidator {

    private final LicenciaValidatorFactory validatorFactory;

    /**
     * Constructor que inicializa el factory
     */
    public LicenciaValidator() {
        this.validatorFactory = LicenciaValidatorFactory.getInstance();
    }

    /**
     * Valida todas las reglas de negocio específicas para las licencias usando
     * el patrón Factory
     *
     * @param licencia Licencia a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    public void validar(Licencia licencia) throws BusinessLogicException {
        // PRIMERA REGLA: Validar fechas usando validador genérico
        GenericFechaValidator<Licencia> fechaValidator = GenericFechaValidator.getInstance();
        fechaValidator.validate(licencia);

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
}
