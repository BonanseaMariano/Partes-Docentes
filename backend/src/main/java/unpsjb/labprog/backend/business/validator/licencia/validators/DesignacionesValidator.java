package unpsjb.labprog.backend.business.validator.licencia.validators;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.util.DesignacionCalculadorUtil;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador para verificar designaciones activas durante el período de
 * licencia. Implementa el patrón Singleton requerido por el ValidatorFactory.
 */
public class DesignacionesValidator implements Validator<Licencia> {

    // Singleton
    private static DesignacionesValidator instance = null;

    private DesignacionesValidator() {
        // Constructor privado para Singleton
    }

    public static DesignacionesValidator getInstance() {
        if (instance == null) {
            instance = new DesignacionesValidator();
        }
        return instance;
    }

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
