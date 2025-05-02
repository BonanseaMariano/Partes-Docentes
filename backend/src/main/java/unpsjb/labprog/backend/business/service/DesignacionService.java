package unpsjb.labprog.backend.business.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.model.Designacion;

/**
 * Servicio que implementa la lógica de negocio para la entidad Designacion
 * 
 * @see Designacion
 */
@Service
public class DesignacionService {
    @Autowired
    private DesignacionRepository repository;

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
     */
    @Transactional
    public Designacion save(Designacion designacion) {
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

}
