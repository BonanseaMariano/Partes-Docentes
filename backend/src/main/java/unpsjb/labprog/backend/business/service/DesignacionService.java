package unpsjb.labprog.backend.business.service;

import java.time.LocalDateTime;
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
     * Busca designaciones activas para una persona específica durante un período
     * determinado.
     * 
     * @param personaDni  El DNI de la persona a buscar
     * @param fechaInicio Fecha de inicio del período a verificar
     * @param fechaFin    Fecha de fin del período a verificar
     * @return Lista de designaciones activas para la persona durante el período
     *         especificado
     */
    public List<Designacion> findDesignacionesActivasPorPersonaYPeriodo(
            Long personaDni, LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return repository.findDesignacionesActivasPorPersonaYPeriodo(personaDni, fechaInicio, fechaFin);
    }

    /**
     * Obtiene la persona que está siendo reemplazada por esta designación, si
     * existe.
     * Una designación es un reemplazo cuando está contenida completamente dentro
     * del
     * período de otra designación para el mismo cargo.
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

}
