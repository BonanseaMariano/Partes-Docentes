package unpsjb.labprog.backend.business.validator.licencia.validators;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.licencia.util.SolapamientoCalculadorUtil;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador para verificar solapamiento entre licencias. Implementa el patrón
 * Singleton requerido por el ValidatorFactory.
 */
public class SolapamientoValidator implements Validator<Licencia> {

    // Singleton
    private static SolapamientoValidator instance = null;

    private SolapamientoValidator() {
        // Constructor privado para Singleton
    }

    public static SolapamientoValidator getInstance() {
        if (instance == null) {
            instance = new SolapamientoValidator();
        }
        return instance;
    }

    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        // Obtenemos el ID de la licencia (será null si es nueva)
        Integer licenciaId = licencia.getId() > 0 ? licencia.getId() : null;

        // Verificamos si existen licencias solapadas usando la clase utilitaria
        boolean hayLicenciasSolapadas = SolapamientoCalculadorUtil.existenLicenciasSolapadas(
                licencia.getPersona().getDni(),
                licencia.getPedidoDesde(),
                licencia.getPedidoHasta(),
                licenciaId);

        // Verificar si existen licencias solapadas
        if (hayLicenciasSolapadas) {
            // Hay al menos una licencia que se solapa
            throw new BusinessLogicException("NO se otorga Licencia artículo "
                    + licencia.getArticuloLicencia().getArticulo() + " a "
                    + licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido()
                    + " debido a que ya posee una licencia en el mismo período");
        }
    }
}
