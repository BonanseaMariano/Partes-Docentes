package unpsjb.labprog.backend.business.validator.licencia.validators;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.util.DesignacionCalculadorUtil;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador específico para verificar que una persona tenga designaciones
 * activas durante el período solicitado de licencia.
 *
 * <p>
 * Este validador garantiza que:</p>
 * <ul>
 * <li>La persona tenga al menos un cargo en la institución</li>
 * <li>Exista al menos una designación activa que cubra completamente el período
 * de la licencia</li>
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
public class DesignacionesValidator implements Validator<Licencia> {

    private static DesignacionesValidator instance = null;

    /**
     * Constructor privado para implementar el patrón Singleton.
     */
    private DesignacionesValidator() {
        // Constructor privado para Singleton
    }

    /**
     * Obtiene la única instancia del validador.
     *
     * @return la instancia única de DesignacionesValidator
     */
    public static DesignacionesValidator getInstance() {
        if (instance == null) {
            instance = new DesignacionesValidator();
        }
        return instance;
    }

    /**
     * Valida que la persona tenga designaciones activas durante el período de
     * licencia.
     *
     * @param licencia la licencia a validar
     * @throws BusinessLogicException si la persona no tiene cargos en la
     * institución o no tiene designaciones activas en el período solicitado
     */
    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        // Primero verificamos si la persona tiene algún cargo en la institución
        boolean tieneAlgunCargo = DesignacionCalculadorUtil.tieneAlgunCargo(
                licencia.getPersona().getDni());

        if (!tieneAlgunCargo) {
            throw new BusinessLogicException("NO se otorga Licencia artículo "
                    + licencia.getArticuloLicencia().getArticulo() + " a "
                    + licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido()
                    + " debido a que el agente no posee ningún cargo en la institución");
        }

        // Ahora verificamos si existe alguna designación que contenga completamente el
        // período de licencia
        boolean tieneDesignacionesActivas = DesignacionCalculadorUtil.tieneDesignacionesActivasEnPeriodo(
                licencia.getPersona().getDni(),
                licencia.getPedidoDesde(),
                licencia.getPedidoHasta());

        // Verificar que exista al menos una designación que cubra completamente el
        // período de la licencia
        if (!tieneDesignacionesActivas) {
            throw new BusinessLogicException("NO se otorga Licencia artículo "
                    + licencia.getArticuloLicencia().getArticulo() + " a "
                    + licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido()
                    + " debido a que el agente no tiene designación ese día en la institución");
        }
    }
}
