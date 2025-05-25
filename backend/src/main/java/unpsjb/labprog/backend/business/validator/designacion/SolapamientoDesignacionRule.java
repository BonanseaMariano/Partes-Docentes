package unpsjb.labprog.backend.business.validator.designacion;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Division;
import unpsjb.labprog.backend.model.Licencia;
import unpsjb.labprog.backend.model.Persona;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * Regla de validación para solapamiento de designaciones
 */
@Component
public class SolapamientoDesignacionRule implements DesignacionValidationRule {

    @Autowired
    private DesignacionRepository designacionRepository;

    @Autowired
    private LicenciaRepository licenciaRepository;

    @Override
    public void validate(Designacion nuevaDesignacion) throws BusinessLogicException {

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

            List<Licencia> licenciasDePersonaExistente = licenciaRepository.findLicenciasSuperPuestas(
                    personaExistente.getDni(),
                    nuevaDesignacion.getFechaInicio(), // Período de la NUEVA designación
                    nuevaDesignacion.getFechaFin(), // Período de la NUEVA designación
                    null); // No se excluye ninguna licencia específica para esta comprobación

            if (licenciasDePersonaExistente.isEmpty()) {
                manejarCasoSinLicencias(nuevaDesignacion, cargoExistente, personaExistente);
                return;
            } else {
                boolean esReemplazoValidoParaEstaExistente = licenciasDePersonaExistente.stream()
                        .anyMatch(lic -> lic.getPedidoDesde().compareTo(nuevaDesignacion.getFechaInicio()) <= 0
                        && lic.getPedidoHasta().compareTo(nuevaDesignacion.getFechaFin()) >= 0);

                if (!esReemplazoValidoParaEstaExistente) {
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
