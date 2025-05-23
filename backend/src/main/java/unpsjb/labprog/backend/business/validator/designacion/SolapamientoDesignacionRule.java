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
    public void validate(Designacion designacion) throws BusinessLogicException {
        // Obtenemos el ID de la designación (será null si es nueva)
        Integer designacionId = designacion.getId() > 0 ? designacion.getId() : null;

        // Buscamos designaciones que se solapen con la misma
        List<Designacion> designacionesSuperpuestas = designacionRepository.findDesignacionesSuperpuestas(
                designacion.getCargo().getId(),
                designacion.getFechaInicio(),
                designacion.getFechaFin(),
                designacionId);

        if (!designacionesSuperpuestas.isEmpty()) {
            validarSuperposicion(designacion, designacionesSuperpuestas.get(0));
        }
    }

    /**
     * Valida si la superposición es permitida debido a licencias u otro motivo
     * válido
     */
    private void validarSuperposicion(Designacion nuevaDesignacion, Designacion designacionExistente)
            throws BusinessLogicException {
        Persona personaExistente = designacionExistente.getPersona();
        Cargo cargoExistente = designacionExistente.getCargo();

        // Verificamos si la persona con designación existente tiene una licencia
        List<Licencia> licenciasActivas = licenciaRepository.findLicenciasSuperPuestas(
                personaExistente.getDni(),
                nuevaDesignacion.getFechaInicio(),
                nuevaDesignacion.getFechaFin(),
                null);

        if (!licenciasActivas.isEmpty()) {
            manejarCasoConLicencias(nuevaDesignacion, cargoExistente, personaExistente, licenciasActivas);
        } else {
            manejarCasoSinLicencias(nuevaDesignacion, cargoExistente, personaExistente);
        }
    }

    /**
     * Maneja la validación cuando hay licencias activas
     */
    private void manejarCasoConLicencias(Designacion nuevaDesignacion, Cargo cargoExistente,
            Persona personaExistente, List<Licencia> licenciasActivas) throws BusinessLogicException {

        boolean periodoValido = licenciasActivas.stream()
                .anyMatch(licencia -> licencia.getPedidoDesde().compareTo(nuevaDesignacion.getFechaInicio()) <= 0 &&
                        licencia.getPedidoHasta().compareTo(nuevaDesignacion.getFechaFin()) >= 0);

        if (periodoValido) {
            // Es un reemplazo válido por licencia, permitir la designación
            return;
        }

        // Es una superposición con licencia parcial, no permitir
        throw new BusinessLogicException(
                String.format(
                        "%s %s NO ha sido designado/a como %s, ya cuenta con %s %s asignada al mismo en el período",
                        nuevaDesignacion.getPersona().getNombre(),
                        nuevaDesignacion.getPersona().getApellido(),
                        cargoExistente.getNombre(),
                        personaExistente.getNombre(),
                        personaExistente.getApellido()));
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