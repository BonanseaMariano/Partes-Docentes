package unpsjb.labprog.backend.business.validator.licencia.validators;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.util.LicenciaSolapamientoUtil;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador específico para verificar solapamiento entre licencias de una misma
 * persona.
 *
 * <p>
 * Este validador garantiza que no existan licencias con períodos superpuestos
 * para una misma persona, evitando conflictos en la gestión de licencias.</p>
 *
 * <p>
 * Características del validador:</p>
 * <ul>
 * <li>Verifica solapamiento de fechas entre licencias existentes y la nueva
 * solicitud</li>
 * <li>Excluye la licencia actual en caso de modificaciones</li>
 * <li>Utiliza utilidades especializadas para el cálculo de solapamientos</li>
 * </ul>
 *
 * <p>
 * Forma parte del patrón Chain of Responsibility para la validación de
 * licencias y implementa el patrón Singleton para optimización de memoria.</p>
 *
 * @author Mariano Bonansea
 * @version 1.0
 * @since 1.0
 */
public class SolapamientoValidator implements Validator<Licencia> {

    private static SolapamientoValidator instance = null;

    /**
     * Constructor privado para implementar el patrón Singleton.
     */
    private SolapamientoValidator() {
        // Constructor privado para Singleton
    }

    /**
     * Obtiene la única instancia del validador.
     *
     * @return la instancia única de SolapamientoValidator
     */
    public static SolapamientoValidator getInstance() {
        if (instance == null) {
            instance = new SolapamientoValidator();
        }
        return instance;
    }

    /**
     * Valida que no existan licencias solapadas en el período solicitado.
     *
     * @param licencia la licencia a validar
     * @throws BusinessLogicException si existe solapamiento con otras licencias
     * de la persona
     */
    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        // Obtenemos el ID de la licencia (será null si es nueva)
        Integer licenciaId = licencia.getId() > 0 ? licencia.getId() : null;

        // Verificamos si existen licencias solapadas usando la clase utilitaria
        boolean hayLicenciasSolapadas = LicenciaSolapamientoUtil.existenLicenciasSolapadas(
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
