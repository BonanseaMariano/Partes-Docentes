package unpsjb.labprog.backend.business.validator;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Division;
import unpsjb.labprog.backend.model.Persona;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * Validador que implementa las reglas de negocio para la entidad Designacion
 * 
 * @see Designacion
 */
@Component
public class DesignacionValidator {

    @Autowired
    private DesignacionRepository repository;

    /**
     * Valida todas las reglas de negocio específicas para las designaciones
     * 
     * @param designacion Designación a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    public void validar(Designacion designacion) throws BusinessLogicException {
        validarFechas(designacion);
        validarSolapamiento(designacion);
    }

    /**
     * Valida las reglas relacionadas con las fechas:
     * - La fecha de inicio debe ser anterior a la fecha de finalización
     * 
     * @param designacion Designación a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    private void validarFechas(Designacion designacion) throws BusinessLogicException {
        // Validación: fechaInicio debe ser anterior a fechaFin
        if (designacion.getFechaFin() != null && designacion.getFechaInicio().isAfter(designacion.getFechaFin())) {
            throw new BusinessLogicException(
                    "La fecha de inicio no puede ser posterior a la fecha de finalización");
        }
    }

    /**
     * Valida que no exista solapamiento con otras designaciones para el mismo cargo
     * en el periodo especificado.
     * 
     * @param designacion Designación a validar
     * @throws BusinessLogicException si existe una designación que se solapa
     */
    private void validarSolapamiento(Designacion designacion) throws BusinessLogicException {
        // Obtenemos el ID de la designación (será null si es nueva)
        Integer designacionId = designacion.getId() > 0 ? designacion.getId() : null;

        // Buscamos designaciones que se solapen con la misma
        List<Designacion> designacionesSuperpuestas = repository.findDesignacionesSuperpuestas(
                designacion.getCargo().getId(),
                designacion.getFechaInicio(),
                designacion.getFechaFin(),
                designacionId);

        if (!designacionesSuperpuestas.isEmpty()) {
            // Hay al menos una designación que se solapa
            Designacion designacionExistente = designacionesSuperpuestas.get(0);
            Persona personaExistente = designacionExistente.getPersona();
            Cargo cargoExistente = designacionExistente.getCargo();

            // Construimos mensaje de error según el tipo de designación
            String mensaje;
            if (TipoDesignacion.ESPACIO_CURRICULAR.equals(cargoExistente.getTipoDesignacion())) {
                mensaje = String.format(
                        "%s %s NO ha sido designado/a debido a que la asignatura %s de la división %s lo ocupa %s %s para el período",
                        designacion.getPersona().getNombre(),
                        designacion.getPersona().getApellido(),
                        cargoExistente.getNombre(),
                        obtenerDescripcionDivision(cargoExistente.getDivision()),
                        personaExistente.getNombre(),
                        personaExistente.getApellido());
            } else {
                mensaje = String.format(
                        "%s %s NO ha sido designado/a como %s. pues el cargo solicitado lo ocupa %s %s para el período",
                        designacion.getPersona().getNombre(),
                        designacion.getPersona().getApellido(),
                        cargoExistente.getNombre(),
                        personaExistente.getNombre(),
                        personaExistente.getApellido());
            }

            throw new BusinessLogicException(mensaje);
        }
    }

    /**
     * Obtiene una descripción de la división.
     * 
     * @param division División a describir
     * @return Descripción de la división (ej: "3º 1º turno Tarde")
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
