package unpsjb.labprog.backend.business.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import unpsjb.labprog.backend.business.repository.PersonaRepository;
import unpsjb.labprog.backend.model.Persona;

/**
 * Servicio que implementa la lógica de negocio para la entidad Persona
 * 
 * @see Persona
 */
@Service
public class PersonaService {

    @Autowired
    private PersonaRepository repository;

    /**
     * Busca todas las personas registradas
     * 
     * @return Lista de todas las personas
     */
    public List<Persona> findAll() {
        return repository.findAll();
    }

    /**
     * Busca una persona por su id
     * 
     * @param id ID de la persona a buscar
     * @return Persona encontrada o null si no existe
     */
    public Persona findById(int id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Busca una persona por su dni
     * 
     * @param dni DNI de la persona a buscar
     * @return Persona encontrada o null si no existe
     */
    public Persona findByDni(long dni) {
        return repository.findByDni(dni).orElse(null);
    }

    /**
     * Busca una persona por su cuil
     * 
     * @param cuil CUIL de la persona a buscar
     * @return Persona encontrada o null si no existe
     */
    public Persona findByCuil(String cuil) {
        return repository.findByCuil(cuil).orElse(null);
    }

    /**
     * Guarda una nueva persona o actualiza una existente
     * 
     * @param e Persona a guardar
     * @return Persona guardada
     */
    @Transactional
    public Persona save(Persona e) {
        return repository.save(e);
    }

    /**
     * Elimina una persona por su DNI
     * 
     * @param dni DNI de la persona a eliminar
     */
    @Transactional
    public void delete(int dni) {
        repository.deleteById(dni);
    }

    /**
     * Busca personas por un término de búsqueda.
     * 
     * @param term el término de búsqueda
     * @return una lista de personas que coinciden con el término de búsqueda
     */
    public List<Persona> search(String term) {
        return repository.search("%" + term.toUpperCase() + "%");
    }

    /**
     * Obtiene una página de entidades Persona.
     * 
     * @param page el índice de página basado en cero
     * @param size el tamaño de la página a devolver
     * @return un objeto Page que contiene las entidades Persona solicitadas
     */
    public Page<Persona> findByPage(int page, int size) {
        return repository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
    }
}