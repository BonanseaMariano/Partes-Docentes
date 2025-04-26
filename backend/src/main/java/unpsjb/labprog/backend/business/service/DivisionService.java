package unpsjb.labprog.backend.business.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import unpsjb.labprog.backend.business.repository.DivisionRepository;
import unpsjb.labprog.backend.model.Division;

/**
 * Servicio que implementa la lógica de negocio para la entidad Division
 */
@Service
public class DivisionService {

    @Autowired
    private DivisionRepository repository;

    /**
     * Busca una división por su ID
     * 
     * @param id ID de la división a buscar
     * @return División encontrada o null si no existe
     */
    public Division findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Busca todas las divisiones registradas
     * 
     * @return Lista de todas las divisiones
     */
    public List<Division> findAll() {
        return repository.findAll();
    }

    /**
     * Guarda una nueva división o actualiza una existente
     * 
     * @param division División a guardar
     * @return División guardada
     */
    @Transactional
    public Division save(Division division) {
        return repository.save(division);
    }

    /**
     * Elimina una división por su ID
     * 
     * @param id ID de la división a eliminar
     */
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    /**
     * Obtiene una página de entidades División.
     * 
     * @param page el índice de página basado en cero
     * @param size el tamaño de la página a devolver
     * @return un objeto Page que contiene las entidades División solicitadas
     */
    public Page<Division> findByPage(int page, int size) {
        return repository.findAll(PageRequest.of(page, size));
    }
}
