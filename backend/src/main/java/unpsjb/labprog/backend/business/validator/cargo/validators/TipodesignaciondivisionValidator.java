package unpsjb.labprog.backend.business.validator.cargo.validators;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * Validador para verificar la relación entre tipo de designación y división
 * asignada. Implementa el patrón Singleton requerido por el
 * CargoValidatorFactory.
 */
public class TipodesignaciondivisionValidator implements Validator<Cargo> {

    // Singleton
    private static TipodesignaciondivisionValidator instance = null;

    private TipodesignaciondivisionValidator() {
        // Constructor privado para Singleton
    }

    public static TipodesignaciondivisionValidator getInstance() {
        if (instance == null) {
            instance = new TipodesignaciondivisionValidator();
        }
        return instance;
    }

    @Override
    public void validate(Cargo cargo) throws BusinessLogicException {
        // Validaciones para ESPACIO_CURRICULAR
        if (TipoDesignacion.ESPACIO_CURRICULAR.equals(cargo.getTipoDesignacion())) {
            if (cargo.getDivision() == null) {
                throw new BusinessLogicException("Espacio Curricular " + cargo.getNombre() + " falta asignar división");
            }
        } // Validaciones para CARGO
        else if (TipoDesignacion.CARGO.equals(cargo.getTipoDesignacion()) && cargo.getDivision() != null) {
            // Si está el campo division asignado, no importa si tiene ID o no, es un error
            throw new BusinessLogicException(
                    "Cargo de " + cargo.getNombre() + " es CARGO y no corresponde asignar división");
        }
    }
}
