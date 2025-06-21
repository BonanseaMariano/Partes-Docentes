package unpsjb.labprog.backend.business.validator.base;

import java.time.LocalDate;

import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador genérico para verificar fechas de cualquier entidad del sistema.
 * Implementa el patrón Singleton y puede validar fechas de Licencias, Cargos y
 * Designaciones, asegurando que la fecha de inicio no sea posterior a la fecha
 * de fin.
 *
 * @param <T> el tipo de entidad que será validada
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public class GenericFechaValidator<T> implements Validator<T> {

    /**
     * Instancia única del validador (patrón Singleton)
     */
    private static GenericFechaValidator<?> instance = null;

    /**
     * Constructor privado para implementar el patrón Singleton.
     */
    private GenericFechaValidator() {
        // Constructor privado para Singleton
    }

    /**
     * Obtiene la instancia única del validador genérico de fechas.
     *
     * @param <T> el tipo de entidad a validar
     * @return la instancia única del validador
     */
    @SuppressWarnings("unchecked")
    public static <T> GenericFechaValidator<T> getInstance() {
        if (instance == null) {
            instance = new GenericFechaValidator<>();
        }
        return (GenericFechaValidator<T>) instance;
    }

    /**
     * Valida que las fechas de la entidad sean consistentes. Verifica que la
     * fecha de inicio no sea posterior a la fecha de fin.
     *
     * @param entity la entidad a validar
     * @throws BusinessLogicException si la entidad es null, no es soportada, o
     * las fechas son inconsistentes
     */
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
