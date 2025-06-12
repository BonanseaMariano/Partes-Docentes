package unpsjb.labprog.backend.business.validator.designacion.validators;

import java.util.List;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.util.DesignacionSolapamientoUtil;
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

    private SolapamientoValidator() {
        // Constructor privado para Singleton
    }

    public static SolapamientoValidator getInstance() {
        if (instance == null) {
            instance = new SolapamientoValidator();
        }
        return instance;
    }

    @Override
    public void validate(Designacion nuevaDesignacion) throws BusinessLogicException {
        Integer designacionIdOriginal = (nuevaDesignacion.getId() > 0) ? nuevaDesignacion.getId() : null;

        // Buscar TODAS las designaciones existentes para el MISMO CARGO que se SOLAPEN en el tiempo con la nuevaDesignacion
        List<Designacion> designacionesSuperpuestas = DesignacionSolapamientoUtil.buscarDesignacionesSuperpuestas(
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
            List<Licencia> licencias = DesignacionSolapamientoUtil.buscarLicenciasParaCoberturaContinua(
                    personaExistente.getDni(),
                    nuevaDesignacion.getFechaInicio(),
                    nuevaDesignacion.getFechaFin());

            if (licencias.isEmpty()) {
                // No hay licencias, la persona está activa en el cargo
                manejarCasoSinLicencias(nuevaDesignacion, cargoExistente, personaExistente);
            } else {
                // Verificar si existe cobertura continua
                boolean existeCoberturaContinua = DesignacionSolapamientoUtil.verificarCoberturaContinua(licencias,
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
