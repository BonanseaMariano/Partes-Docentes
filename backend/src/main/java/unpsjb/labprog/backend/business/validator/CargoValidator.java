package unpsjb.labprog.backend.business.validator;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * Validador que implementa las reglas de negocio para la entidad Cargo
 * 
 * @see Cargo
 */
@Component
public class CargoValidator {

    /**
     * Valida todas las reglas de negocio específicas para los cargos
     * 
     * @param cargo Cargo a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    public void validar(Cargo cargo) throws BusinessLogicException {
        validarTipoDesignacionYDivision(cargo);
        validarFechas(cargo);
    }

    /**
     * Valida las reglas relacionadas con el tipo de designación y la división:
     * 1. Si es ESPACIO CURRICULAR, debe tener una división asignada
     * 2. Si es CARGO, no debe tener una división asignada
     * 
     * @param cargo Cargo a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    private void validarTipoDesignacionYDivision(Cargo cargo) throws BusinessLogicException {
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

    /**
     * Valida las reglas relacionadas con las fechas:
     * - La fecha de inicio debe ser anterior a la fecha de finalización
     * 
     * @param cargo Cargo a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    private void validarFechas(Cargo cargo) throws BusinessLogicException {
        // Validación: fechaInicio debe ser anterior a fechaFin
        if (cargo.getFechaFin() != null && cargo.getFechaInicio().isAfter(cargo.getFechaFin())) {
            throw new BusinessLogicException(
                    "La fecha de inicio no puede ser posterior a la fecha de finalización");
        }
    }
}
