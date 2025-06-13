package unpsjb.labprog.backend.business.service;

import java.time.LocalDateTime;
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
 * Servicio que implementa la lógica de negocio para la entidad Designacion
 *
 * @see Designacion
 */
@Service
public class DesignacionService {

    @Autowired
    private DesignacionRepository repository;

    @Autowired
    private DesignacionValidator validator;

    /**
     * Busca una designacion por su ID
     *
     * @param id ID de la designacion a buscar
     * @return Designacion encontrada o null si no existe
     */
    public Designacion findById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Obtiene todos las designaciones registrados
     *
     * @return Lista de todos las designaciones
     */
    public List<Designacion> findAll() {
        return repository.findAll();
    }

    /**
     * Guarda una nueva designación o actualiza una existente
     *
     * @param designacion Designación a guardar
     * @return Designación guardada
     * @throws BusinessLogicException si no se cumplen las reglas de negocio
     */
    @Transactional
    public Designacion save(Designacion designacion) throws BusinessLogicException {
        // Validar reglas de negocio antes de guardar usando el validador específico
        validator.validar(designacion);

        return repository.save(designacion);
    }

    /**
     * Elimina una designación por su ID
     *
     * @param id ID de la designación a eliminar
     */
    @Transactional
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    /**
     * Obtiene una página de entidades Designación.
     *
     * @param page el índice de página basado en cero
     * @param size el tamaño de la página a devolver
     * @return un objeto Page que contiene las entidades Designación solicitadas
     */
    public Page<Designacion> findByPage(int page, int size) {
        return repository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
    }

    /**
     * Obtiene una página de entidades Designación con ordenamiento
     * personalizado.
     *
     * @param page el índice de página basado en cero
     * @param size el tamaño de la página a devolver
     * @param sortField el campo por el cual ordenar
     * @param sortDirection la dirección del ordenamiento (asc o desc)
     * @return un objeto Page que contiene las entidades Designación solicitadas
     */
    public Page<Designacion> findByPage(int page, int size, String sortField, String sortDirection) {
        // Validar campos permitidos para ordenamiento por seguridad
        String[] allowedFields = {"id", "persona.dni", "cargo.nombre", "cargo.tipoDesignacion", "cargo.division.orientacion",
            "situacionRevista", "fechaInicio", "fechaFin"};
        boolean isValidField = false;
        for (String field : allowedFields) {
            if (field.equals(sortField)) {
                isValidField = true;
                break;
            }
        }

        // Si el campo no es válido, usar "id" por defecto
        if (!isValidField) {
            sortField = "id";
        }

        // Validar dirección de ordenamiento
        Sort.Direction direction;
        if ("asc".equalsIgnoreCase(sortDirection)) {
            direction = Sort.Direction.ASC;
        } else {
            direction = Sort.Direction.DESC;
        }

        return repository.findAll(PageRequest.of(page, size, Sort.by(direction, sortField)));
    }

    /**
     * Busca designaciones activas para una persona específica durante un
     * período determinado.
     *
     * @param personaDni El DNI de la persona a buscar
     * @param fechaInicio Fecha de inicio del período a verificar
     * @param fechaFin Fecha de fin del período a verificar
     * @return Lista de designaciones activas para la persona durante el período
     * especificado
     */
    public List<Designacion> findDesignacionesActivasPorPersonaYPeriodo(
            Long personaDni, LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return repository.findDesignacionesActivasPorPersonaYPeriodo(personaDni, fechaInicio, fechaFin);
    }

    /**
     * Obtiene la persona que está siendo reemplazada por esta designación, si
     * existe. Una designación es un reemplazo cuando está contenida
     * completamente dentro del período de otra designación para el mismo cargo.
     *
     * @param designacion La designación a verificar
     * @return La persona reemplazada, o null si no es un reemplazo
     */
    public Persona obtenerPersonaReemplazada(Designacion designacion) {
        Integer designacionId = designacion.getId() > 0 ? designacion.getId() : null;

        // Buscamos designaciones que contengan completamente el período de esta
        // designación
        List<Designacion> designacionesContenedoras = repository.findDesignacionesContenedoras(
                designacion.getCargo().getId(),
                designacion.getFechaInicio(),
                designacion.getFechaFin(),
                designacionId);

        if (designacionesContenedoras.isEmpty()) {
            return null; // No es un reemplazo
        }

        // Devolver la persona de la primera designación contenedora encontrada
        return designacionesContenedoras.get((designacionesContenedoras.size() - 1)).getPersona();
    }

    /**
     * Encuentra las designaciones que actúan como reemplazos para una licencia
     * específica. Una designación es un reemplazo si: - Es para el mismo cargo
     * que una designación afectada por la licencia - Su período está contenido
     * dentro del período de la licencia - Es de una persona diferente a la que
     * tiene la licencia
     *
     * @param licencia La licencia para la cual buscar reemplazos
     * @return Lista de designaciones que actúan como reemplazos
     */
    public List<Designacion> findDesignacionesReemplazoPorLicencia(Licencia licencia) {
        List<Designacion> reemplazos = new ArrayList<>();

        // Obtener las designaciones afectadas por la licencia
        List<Designacion> designacionesAfectadas = licencia.getDesignaciones();

        if (designacionesAfectadas == null || designacionesAfectadas.isEmpty()) {
            return reemplazos;
        }

        // Para cada designación afectada, buscar designaciones que la reemplacen
        for (Designacion designacionAfectada : designacionesAfectadas) {
            // Buscar designaciones superpuestas para el mismo cargo
            List<Designacion> designacionesSuperpuestas = repository.findDesignacionesSuperpuestas(
                    designacionAfectada.getCargo().getId(),
                    licencia.getPedidoDesde(),
                    licencia.getPedidoHasta(),
                    designacionAfectada.getId());

            // Filtrar solo las que son reemplazos (diferentes personas y contenidas en el período)
            for (Designacion designacion : designacionesSuperpuestas) {
                if (!designacion.getPersona().getDni().equals(licencia.getPersona().getDni())
                        && esDesignacionContenidaEnPeriodo(designacion, licencia.getPedidoDesde(), licencia.getPedidoHasta())) {

                    // Verificar si esta designación no está contenida dentro del período de otra ya agregada
                    boolean estaContenidaEnOtra = false;
                    for (Designacion reemplazoExistente : reemplazos) {
                        if (esDesignacionContenidaEnDesignacion(designacion, reemplazoExistente)) {
                            estaContenidaEnOtra = true;
                            break;
                        }
                    }

                    // Solo agregar si no está contenida en otra designación ya agregada
                    if (!estaContenidaEnOtra) {
                        // Remover designaciones existentes que estén contenidas en esta nueva
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
     * @param designacion La designación a verificar
     * @param fechaInicioPeriodo Fecha de inicio del período
     * @param fechaFinPeriodo Fecha de fin del período
     * @return true si la designación está contenida en el período
     */
    private boolean esDesignacionContenidaEnPeriodo(Designacion designacion,
            LocalDateTime fechaInicioPeriodo, LocalDateTime fechaFinPeriodo) {

        // La designación debe empezar después o en el inicio del período
        boolean iniciaEnPeriodo = designacion.getFechaInicio().compareTo(fechaInicioPeriodo) >= 0;

        // La designación debe terminar antes o en el fin del período
        boolean terminaEnPeriodo = designacion.getFechaFin() == null
                || designacion.getFechaFin().compareTo(fechaFinPeriodo) <= 0;

        return iniciaEnPeriodo && terminaEnPeriodo;
    }

    /**
     * Verifica si una designación está completamente contenida dentro del
     * período de otra designación.
     *
     * @param designacionContenida La designación que se verifica si está
     * contenida
     * @param designacionContenedora La designación que podría contener a la
     * primera
     * @return true si la primera designación está contenida en la segunda
     */
    private boolean esDesignacionContenidaEnDesignacion(Designacion designacionContenida, Designacion designacionContenedora) {
        // La designación contenida debe empezar después o al mismo tiempo que la contenedora
        boolean iniciaEnPeriodo = designacionContenida.getFechaInicio().compareTo(designacionContenedora.getFechaInicio()) >= 0;

        // La designación contenida debe terminar antes o al mismo tiempo que la contenedora
        boolean terminaEnPeriodo;
        if (designacionContenedora.getFechaFin() == null) {
            // Si la contenedora no tiene fecha fin, solo verificar que la contenida termine
            terminaEnPeriodo = designacionContenida.getFechaFin() != null;
        } else if (designacionContenida.getFechaFin() == null) {
            // Si la contenida no tiene fecha fin, no puede estar contenida en una con fecha fin
            terminaEnPeriodo = false;
        } else {
            // Ambas tienen fecha fin, verificar que la contenida termine antes o igual
            terminaEnPeriodo = designacionContenida.getFechaFin().compareTo(designacionContenedora.getFechaFin()) <= 0;
        }

        return iniciaEnPeriodo && terminaEnPeriodo;
    }

}
