package unpsjb.labprog.backend.business.validator.designacion.validators;

import java.util.List;

import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Division;
import unpsjb.labprog.backend.model.Licencia;
import unpsjb.labprog.backend.model.Persona;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * Validador para verificar solapamiento de designaciones. Implementa el patrón
 * Singleton requerido por el DesignacionValidatorFactory.
 */
public class SolapamientoValidator implements Validator<Designacion> {

    // Singleton
    private static SolapamientoValidator instance = null;
    private DesignacionRepository designacionRepository;
    private LicenciaRepository licenciaRepository;

    private SolapamientoValidator() {
        // Constructor privado para Singleton
        // La inyección se hará después de la creación
    }

    public static SolapamientoValidator getInstance() {
        if (instance == null) {
            instance = new SolapamientoValidator();
        }
        return instance;
    }

    /**
     * Métodos para inyectar dependencias después de la creación
     */
    public void setDesignacionRepository(DesignacionRepository designacionRepository) {
        this.designacionRepository = designacionRepository;
    }

    public void setLicenciaRepository(LicenciaRepository licenciaRepository) {
        this.licenciaRepository = licenciaRepository;
    }

    @Override
    public void validate(Designacion nuevaDesignacion) throws BusinessLogicException {
        if (designacionRepository == null) {
            throw new IllegalStateException("DesignacionRepository no ha sido inyectado");
        }
        if (licenciaRepository == null) {
            throw new IllegalStateException("LicenciaRepository no ha sido inyectado");
        }

        Integer designacionIdOriginal = (nuevaDesignacion.getId() > 0) ? nuevaDesignacion.getId() : null;

        // Buscar TODAS las designaciones existentes para el MISMO CARGO que se SOLAPEN en el tiempo con la nuevaDesignacion
        List<Designacion> designacionesSuperpuestas = designacionRepository.findDesignacionesSuperpuestas(
                nuevaDesignacion.getCargo().getId(),
                nuevaDesignacion.getFechaInicio(),
                nuevaDesignacion.getFechaFin(),
                designacionIdOriginal); // Se excluye a sí misma en caso de actualización

        if (designacionesSuperpuestas.isEmpty()) {
            // No hay ninguna designación superpuesta para el mismo cargo. La nueva designación es válida.
            return;
        }

        for (Designacion designacionExistente : designacionesSuperpuestas) {
            Persona personaExistente = designacionExistente.getPersona();
            Cargo cargoExistente = designacionExistente.getCargo();

            // Obtener licencias ordenadas que se solapan con el período
            List<Licencia> licencias = licenciaRepository.findLicenciasParaCoberturaContinua(
                    personaExistente.getDni(),
                    nuevaDesignacion.getFechaInicio(),
                    nuevaDesignacion.getFechaFin());

            if (licencias.isEmpty()) {
                // No hay licencias, la persona está activa en el cargo
                manejarCasoSinLicencias(nuevaDesignacion, cargoExistente, personaExistente);
            } else {
                // Verificar si existe cobertura continua
                boolean existeCoberturaContinua = verificarCobertura(licencias,
                        nuevaDesignacion.getFechaInicio(),
                        nuevaDesignacion.getFechaFin());

                if (!existeCoberturaContinua) {
                    throw new BusinessLogicException(
                            String.format(
                                    "%s %s NO ha sido designado/a como %s, ya cuenta con %s %s asignada al mismo en el período",
                                    nuevaDesignacion.getPersona().getNombre(),
                                    nuevaDesignacion.getPersona().getApellido(),
                                    cargoExistente.getNombre(),
                                    personaExistente.getNombre(),
                                    personaExistente.getApellido()));
                }
            }
        }
    }

    /**
     * Verifica si las licencias proporcionadas cubren de forma continua el
     * período especificado. Las licencias deben estar ordenadas por fecha de
     * inicio.
     */
    private boolean verificarCobertura(List<Licencia> licencias,
            java.time.LocalDateTime fechaInicio, java.time.LocalDateTime fechaFin) {

        if (licencias.isEmpty()) {
            return false;
        }

        // Verificar que la primera licencia cubra el inicio del período
        if (licencias.get(0).getPedidoDesde().isAfter(fechaInicio)) {
            return false;
        }

        java.time.LocalDateTime cobertura = licencias.get(0).getPedidoHasta();

        // Verificar continuidad entre licencias
        for (int i = 1; i < licencias.size(); i++) {
            Licencia licencia = licencias.get(i);

            // Si hay un gap mayor a 1 día, no hay continuidad
            if (licencia.getPedidoDesde().isAfter(cobertura.plusDays(1))) {
                break;
            }

            // Extender la cobertura si esta licencia va más allá
            if (licencia.getPedidoHasta().isAfter(cobertura)) {
                cobertura = licencia.getPedidoHasta();
            }
        }

        // Verificar que la cobertura llegue hasta el final del período
        return !cobertura.isBefore(fechaFin);
    }

    /**
     * Maneja la validación cuando no hay licencias activas
     */
    private void manejarCasoSinLicencias(Designacion nuevaDesignacion, Cargo cargoExistente,
            Persona personaExistente) throws BusinessLogicException {

        String mensaje;
        if (TipoDesignacion.ESPACIO_CURRICULAR.equals(cargoExistente.getTipoDesignacion())) {
            mensaje = String.format(
                    "%s %s NO ha sido designado/a debido a que la asignatura %s de la división %s lo ocupa %s %s para el período",
                    nuevaDesignacion.getPersona().getNombre(),
                    nuevaDesignacion.getPersona().getApellido(),
                    cargoExistente.getNombre(),
                    obtenerDescripcionDivision(cargoExistente.getDivision()),
                    personaExistente.getNombre(),
                    personaExistente.getApellido());
        } else {
            mensaje = String.format(
                    "%s %s NO ha sido designado/a como %s. pues el cargo solicitado lo ocupa %s %s para el período",
                    nuevaDesignacion.getPersona().getNombre(),
                    nuevaDesignacion.getPersona().getApellido(),
                    cargoExistente.getNombre(),
                    personaExistente.getNombre(),
                    personaExistente.getApellido());
        }

        throw new BusinessLogicException(mensaje);
    }

    /**
     * Obtiene una descripción de la división.
     */
    private String obtenerDescripcionDivision(Division division) {
        if (division == null) {
            return "";
        }

        return String.format("%dº %dº turno %s",
                division.getAnio(),
                division.getNumDivision(),
                division.getTurno().name());
    }
}
