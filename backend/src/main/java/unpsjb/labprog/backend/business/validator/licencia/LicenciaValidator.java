package unpsjb.labprog.backend.business.validator.licencia;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.validator.FechaValidationRule;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador principal para licencias que aplica todas las reglas de validación
 */
@Component
public class LicenciaValidator {

    private final List<LicenciaValidationRule> validationRules;

    @Autowired
    private SolapamientoLicenciasRule solapamientoRule;

    @Autowired
    private DesignacionesActivasRule designacionesRule;

    @Autowired
    private ArticuloEspecificoRule articuloRule;

    @Autowired
    private FechaValidationRule fechaValidationRule;

    /**
     * Constructor que recibe una lista de reglas de validación
     *
     * @param validationRules Lista de reglas de validación
     */
    public LicenciaValidator(List<LicenciaValidationRule> validationRules) {
        this.validationRules = validationRules;
    }

    /**
     * Valida todas las reglas de negocio específicas para las licencias
     *
     * @param licencia Licencia a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    public void validar(Licencia licencia) throws BusinessLogicException {
        // PRIMERA REGLA: Validar fechas
        fechaValidationRule.validarRangoFechas(
                licencia.getPedidoDesde(),
                licencia.getPedidoHasta()
        );

        // Resto de reglas específicas...
        // Segunda: validamos la designación activa
        designacionesRule.validate(licencia);

        // Tercera: validamos solapamiento con otras licencias
        solapamientoRule.validate(licencia);

        // Cuarta: validamos las reglas específicas del artículo
        articuloRule.validate(licencia);

        // Resto de reglas, si es necesario
        for (LicenciaValidationRule rule : validationRules) {
            if (!(rule instanceof SolapamientoLicenciasRule)
                    && !(rule instanceof DesignacionesActivasRule)
                    && !(rule instanceof ArticuloEspecificoRule)) {
                rule.validate(licencia);
            }
        }
    }
}
