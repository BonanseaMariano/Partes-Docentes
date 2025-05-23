package unpsjb.labprog.backend.business.validator.cargo;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * Regla que valida la relación entre tipo de designación y división asignada
 */
@Component
public class TipoDesignacionDivisionRule implements CargoValidationRule {

    @Override
    public void validate(Cargo cargo) throws BusinessLogicException {
        // Validaciones para ESPACIO_CURRICULAR
        if (TipoDesignacion.ESPACIO_CURRICULAR.equals(cargo.getTipoDesignacion())) {
            if (cargo.getDivision() == null) {
                throw new BusinessLogicException("Espacio Curricular " + cargo.getNombre() + " falta asignar división");
            }
        }
        // Validaciones para CARGO
        else if (TipoDesignacion.CARGO.equals(cargo.getTipoDesignacion()) && cargo.getDivision() != null) {
            // Si está el campo division asignado, no importa si tiene ID o no, es un error
            throw new BusinessLogicException(
                    "Cargo de " + cargo.getNombre() + " es CARGO y no corresponde asignar división");
        }
    }
}