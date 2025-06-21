package unpsjb.labprog.backend.business.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.business.validator.designacion.DesignacionValidator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;
import unpsjb.labprog.backend.model.Persona;

/**
 * Servicio para la gestión de entidades Designacion. Implementa la lógica de
 * negocio para operaciones con designaciones.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Service
public class DesignacionService {

    @Autowired
    private DesignacionRepository repository;

    @Autowired
    private DesignacionValidator validator;

    /**
     * Busca una designación por su ID.
     *
     * @param id ID de la designación
     * @return Designación encontrada o null si no existe
     */
    public Designacion findById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Obtiene todas las designaciones registradas.
     *
     * @return Lista de todas las designaciones
     */
    public List<Designacion> findAll() {
        return repository.findAll();
    }

    /**
     * Guarda una nueva designación o actualiza una existente. Aplica
     * validaciones de reglas de negocio antes de guardar.
     *
     * @param designacion Designación a guardar
     * @return Designación guardada
     * @throws BusinessLogicException si no se cumplen las reglas de negocio
     */
    @Transactional
    public Designacion save(Designacion designacion) throws BusinessLogicException {
        validator.validar(designacion);
        return repository.save(designacion);
    }

    /**
     * Elimina una designación por su ID.
     *
     * @param id ID de la designación a eliminar
     */
    @Transactional
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    /**
     * Obtiene una página de designaciones con ordenamiento personalizado.
     * Valida los campos de ordenamiento por seguridad y usa valores por defecto
     * para campos inválidos.
     *
     * @param page Índice de página (basado en cero)
     * @param size Tamaño de la página
     * @param sortField Campo por el cual ordenar (validado contra lista
     * permitida)
     * @param sortDirection Dirección del ordenamiento (asc o desc, por defecto
     * desc)
     * @return Página con las designaciones solicitadas
     */
    public Page<Designacion> findByPage(int page, int size, String sortField, String sortDirection) {
        String[] allowedFields = {"id", "persona.dni", "cargo.nombre", "cargo.tipoDesignacion", "cargo.division.orientacion",
            "situacionRevista", "fechaInicio", "fechaFin"};
        boolean isValidField = false;
        for (String field : allowedFields) {
            if (field.equals(sortField)) {
                isValidField = true;
                break;
            }
        }

        if (!isValidField) {
            sortField = "id";
        }

        Sort.Direction direction;
        if ("asc".equalsIgnoreCase(sortDirection)) {
            direction = Sort.Direction.ASC;
        } else {
            direction = Sort.Direction.DESC;
        }

        return repository.findAll(PageRequest.of(page, size, Sort.by(direction, sortField)));
    }

    /**
     * Busca designaciones activas para una persona en un período determinado.
     *
     * @param personaDni DNI de la persona
     * @param fechaInicio Fecha de inicio del período
     * @param fechaFin Fecha de fin del período
     * @return Lista de designaciones activas para la persona en el período
     */
    public List<Designacion> findDesignacionesActivasPorPersonaYPeriodo(
            Long personaDni, LocalDate fechaInicio, LocalDate fechaFin) {
        return repository.findDesignacionesActivasPorPersonaYPeriodo(personaDni, fechaInicio, fechaFin);
    }

    /**
     * Obtiene la persona que está siendo reemplazada por una designación. Una
     * designación es un reemplazo cuando está contenida completamente dentro
     * del período de otra designación para el mismo cargo.
     *
     * @param designacion Designación a verificar
     * @return Persona reemplazada o null si no es un reemplazo
     */
    public Persona obtenerPersonaReemplazada(Designacion designacion) {
        Integer designacionId = designacion.getId() > 0 ? designacion.getId() : null;

        List<Designacion> designacionesContenedoras = repository.findDesignacionesContenedoras(
                designacion.getCargo().getId(),
                designacion.getFechaInicio(),
                designacion.getFechaFin(),
                designacionId);

        if (designacionesContenedoras.isEmpty()) {
            return null;
        }

        return designacionesContenedoras.get((designacionesContenedoras.size() - 1)).getPersona();
    }

    /**
     * Encuentra las designaciones que actúan como reemplazos para una licencia.
     * Busca designaciones de personas diferentes que cubran el período de la
     * licencia.
     *
     * @param licencia Licencia para la cual buscar reemplazos
     * @return Lista de designaciones que actúan como reemplazos
     */
    public List<Designacion> findDesignacionesReemplazoPorLicencia(Licencia licencia) {
        List<Designacion> reemplazos = new ArrayList<>();
        List<Designacion> designacionesAfectadas = licencia.getDesignaciones();

        if (designacionesAfectadas == null || designacionesAfectadas.isEmpty()) {
            return reemplazos;
        }

        for (Designacion designacionAfectada : designacionesAfectadas) {
            List<Designacion> designacionesSuperpuestas = repository.findDesignacionesSuperpuestas(
                    designacionAfectada.getCargo().getId(),
                    licencia.getPedidoDesde(),
                    licencia.getPedidoHasta(),
                    designacionAfectada.getId());

            for (Designacion designacion : designacionesSuperpuestas) {
                if (!designacion.getPersona().getDni().equals(licencia.getPersona().getDni())
                        && esDesignacionContenidaEnPeriodo(designacion, licencia.getPedidoDesde(), licencia.getPedidoHasta())) {

                    boolean estaContenidaEnOtra = false;
                    for (Designacion reemplazoExistente : reemplazos) {
                        if (esDesignacionContenidaEnDesignacion(designacion, reemplazoExistente)) {
                            estaContenidaEnOtra = true;
                            break;
                        }
                    }

                    if (!estaContenidaEnOtra) {
                        reemplazos.removeIf(reemplazoExistente
                                -> esDesignacionContenidaEnDesignacion(reemplazoExistente, designacion));
                        reemplazos.add(designacion);
                    }
                }
            }
        }

        return reemplazos;
    }

    /**
     * Verifica si una designación está contenida completamente dentro de un
     * período específico.
     *
     * @param designacion Designación a verificar
     * @param fechaInicioPeriodo Fecha de inicio del período
     * @param fechaFinPeriodo Fecha de fin del período
     * @return true si la designación está contenida en el período
     */
    private boolean esDesignacionContenidaEnPeriodo(Designacion designacion,
            LocalDate fechaInicioPeriodo, LocalDate fechaFinPeriodo) {

        boolean iniciaEnPeriodo = designacion.getFechaInicio().compareTo(fechaInicioPeriodo) >= 0;
        boolean terminaEnPeriodo = designacion.getFechaFin() == null
                || designacion.getFechaFin().compareTo(fechaFinPeriodo) <= 0;

        return iniciaEnPeriodo && terminaEnPeriodo;
    }

    /**
     * Verifica si una designación está completamente contenida dentro del
     * período de otra designación.
     *
     * @param designacionContenida Designación que se verifica si está contenida
     * @param designacionContenedora Designación que podría contener a la
     * primera
     * @return true si la primera designación está contenida en la segunda
     */
    private boolean esDesignacionContenidaEnDesignacion(Designacion designacionContenida, Designacion designacionContenedora) {
        boolean iniciaEnPeriodo = designacionContenida.getFechaInicio().compareTo(designacionContenedora.getFechaInicio()) >= 0;

        boolean terminaEnPeriodo;
        if (designacionContenedora.getFechaFin() == null) {
            terminaEnPeriodo = designacionContenida.getFechaFin() != null;
        } else if (designacionContenida.getFechaFin() == null) {
            terminaEnPeriodo = false;
        } else {
            terminaEnPeriodo = designacionContenida.getFechaFin().compareTo(designacionContenedora.getFechaFin()) <= 0;
        }

        return iniciaEnPeriodo && terminaEnPeriodo;
    }

}
