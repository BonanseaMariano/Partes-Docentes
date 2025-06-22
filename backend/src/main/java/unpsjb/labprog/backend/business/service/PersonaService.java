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
 * Servicio para la gestión de personas del sistema. Proporciona operaciones
 * CRUD y búsqueda para la entidad Persona, incluyendo consultas por DNI, CUIL y
 * búsqueda por términos.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Service
public class PersonaService {

    @Autowired
    private PersonaRepository repository;

    /**
     * Obtiene todas las personas registradas en el sistema.
     *
     * @return lista de todas las personas
     */
    public List<Persona> findAll() {
        return repository.findAll();
    }

    /**
     * Busca una persona por su identificador único.
     *
     * @param id identificador de la persona
     * @return persona encontrada o null si no existe
     */
    public Persona findById(int id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Busca una persona por su número de DNI.
     *
     * @param dni número de DNI de la persona
     * @return persona encontrada o null si no existe
     */
    public Persona findByDni(long dni) {
        return repository.findByDni(dni).orElse(null);
    }

    /**
     * Busca una persona por su CUIL.
     *
     * @param cuil código único de identificación laboral
     * @return persona encontrada o null si no existe
     */
    public Persona findByCuil(String cuil) {
        return repository.findByCuil(cuil).orElse(null);
    }

    /**
     * Guarda una persona nueva o actualiza una existente.
     *
     * @param e persona a guardar
     * @return persona guardada
     */
    @Transactional
    public Persona save(Persona e) {
        return repository.save(e);
    }

    /**
     * Elimina una persona del sistema.
     *
     * @param id identificador de la persona a eliminar
     */
    @Transactional
    public void delete(int id) {
        repository.deleteById(id);
    }

    /**
     * Busca personas que coincidan con un término de búsqueda. La búsqueda es
     * insensible a mayúsculas y minúsculas.
     *
     * @param term término de búsqueda
     * @return lista de personas que coinciden con el término
     */
    public List<Persona> search(String term) {
        return repository.search("%" + term.toUpperCase() + "%");
    }

    /**
     * Obtiene una página de personas con paginación y ordenamiento
     * personalizado. Valida que el campo de ordenamiento sea permitido por
     * seguridad.
     *
     * @param page índice de página (basado en cero)
     * @param size tamaño de la página
     * @param sortField campo por el cual ordenar
     * @param sortDirection dirección del ordenamiento (asc o desc)
     * @return página de personas con el ordenamiento especificado
     */
    public Page<Persona> findByPage(int page, int size, String sortField, String sortDirection) {
        String[] allowedFields = {"id", "dni", "nombre", "apellido", "cuil", "titulo", "sexo", "domicilio", "telefono"};
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
}
