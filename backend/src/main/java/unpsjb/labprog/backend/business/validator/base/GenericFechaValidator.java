package unpsjb.labprog.backend.business.validator.base;

import java.time.LocalDate;

import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador genérico para verificar fechas de cualquier entidad. Implementa el
 * patrón Singleton y puede validar fechas de Licencias, Cargos y Designaciones.
 */
public class GenericFechaValidator<T> implements Validator<T> {

    // Singleton
    private static GenericFechaValidator<?> instance = null;

    private GenericFechaValidator() {
        // Constructor privado para Singleton
    }

    @SuppressWarnings("unchecked")
    public static <T> GenericFechaValidator<T> getInstance() {
        if (instance == null) {
            instance = new GenericFechaValidator<>();
        }
        return (GenericFechaValidator<T>) instance;
    }

    @Override
    public void validate(T entity) throws BusinessLogicException {
        if (entity == null) {
            throw new BusinessLogicException("La entidad no puede ser null");
        }

        LocalDate fechaInicio = null;
        LocalDate fechaFin = null;

        // Extraer fechas según el tipo de entidad
        if (entity instanceof Licencia licencia) {
            fechaInicio = licencia.getPedidoDesde();
            fechaFin = licencia.getPedidoHasta();
        } else if (entity instanceof Cargo cargo) {
            fechaInicio = cargo.getFechaInicio();
            fechaFin = cargo.getFechaFin();
        } else if (entity instanceof Designacion designacion) {
            fechaInicio = designacion.getFechaInicio();
            fechaFin = designacion.getFechaFin();
        } else {
            throw new BusinessLogicException("Tipo de entidad no soportado para validación de fechas: "
                    + entity.getClass().getSimpleName());
        }

        // Validar que la fecha de inicio no sea posterior a la fecha de fin
        if (fechaInicio != null && fechaFin != null && fechaInicio.isAfter(fechaFin)) {
            throw new BusinessLogicException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }
    }
}
