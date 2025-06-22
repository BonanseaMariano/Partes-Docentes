package unpsjb.labprog.backend.business.validator.cargo.validators;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * Validador específico para verificar la correcta relación entre tipo de
 * designación y división asignada en los cargos. Implementa el patrón Singleton
 * requerido por CargoValidatorFactory.
 *
 * <p>
 * Reglas de validación:</p>
 * <ul>
 * <li>ESPACIO_CURRICULAR debe tener división asignada</li>
 * <li>CARGO no debe tener división asignada</li>
 * </ul>
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public class TipodesignaciondivisionValidator implements Validator<Cargo> {

    /**
     * Instancia única del validador (patrón Singleton)
     */
    private static TipodesignaciondivisionValidator instance = null;

    /**
     * Constructor privado para implementar el patrón Singleton.
     */
    private TipodesignaciondivisionValidator() {
        // Constructor privado para Singleton
    }

    /**
     * Obtiene la instancia única del validador.
     *
     * @return la instancia única del validador
     */
    public static TipodesignaciondivisionValidator getInstance() {
        if (instance == null) {
            instance = new TipodesignaciondivisionValidator();
        }
        return instance;
    }

    /**
     * Valida la relación entre tipo de designación y división asignada.
     *
     * @param cargo el cargo a validar
     * @throws BusinessLogicException si la relación tipo-división es incorrecta
     */
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
