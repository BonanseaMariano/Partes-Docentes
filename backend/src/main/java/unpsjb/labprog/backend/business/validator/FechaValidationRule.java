package unpsjb.labprog.backend.business.validator;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.exception.BusinessLogicException;

/**
 * Regla de validación genérica para fechas de inicio y fin
 */
@Component
public class FechaValidationRule {

    /**
     * Valida que la fecha de inicio no sea posterior a la fecha de fin
     *
     * @param fechaInicio Fecha de inicio
     * @param fechaFin Fecha de fin
     * @throws BusinessLogicException si la fecha de inicio es posterior a la
     * fecha de fin
     */
    public void validarRangoFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin)
            throws BusinessLogicException {
        if (fechaInicio != null && fechaFin != null && fechaInicio.isAfter(fechaFin)) {
            throw new BusinessLogicException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }
    }
}
