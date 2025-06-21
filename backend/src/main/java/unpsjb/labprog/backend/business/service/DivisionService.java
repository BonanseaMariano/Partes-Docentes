package unpsjb.labprog.backend.business.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import unpsjb.labprog.backend.business.repository.DivisionRepository;
import unpsjb.labprog.backend.model.Division;
import unpsjb.labprog.backend.model.enums.Turno;

/**
 * Servicio para la gestión de entidades Division. Implementa la lógica de
 * negocio para operaciones con divisiones.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Service
public class DivisionService {

    @Autowired
    private DivisionRepository repository;

    /**
     * Busca una división por su ID.
     *
     * @param id ID de la división
     * @return División encontrada o null si no existe
     */
    public Division findById(int id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Obtiene todas las divisiones registradas.
     *
     * @return Lista de todas las divisiones
     */
    public List<Division> findAll() {
        return repository.findAll();
    }

    /**
     * Guarda una nueva división o actualiza una existente.
     *
     * @param division División a guardar
     * @return División guardada
     */
    @Transactional
    public Division save(Division division) {
        return repository.save(division);
    }

    /**
     * Elimina una división por su ID.
     *
     * @param id ID de la división a eliminar
     */
    @Transactional
    public void delete(int id) {
        repository.deleteById(id);
    }

    /**
     * Obtiene una página de divisiones con ordenamiento personalizado. Valida
     * los campos de ordenamiento por seguridad y usa valores por defecto para
     * campos inválidos.
     *
     * @param page Índice de página (basado en cero)
     * @param size Tamaño de la página
     * @param sortField Campo por el cual ordenar (validado contra lista
     * permitida)
     * @param sortDirection Dirección del ordenamiento (asc o desc, por defecto
     * desc)
     * @return Página con las divisiones solicitadas
     */
    public Page<Division> findByPage(int page, int size, String sortField, String sortDirection) {
        String[] allowedFields = {"id", "anio", "numDivision", "orientacion", "turno"};
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
     * Busca divisiones por un término de búsqueda general.
     *
     * @param term Término de búsqueda
     * @return Lista de divisiones que coinciden con el término
     */
    public List<Division> search(String term) {
        return repository.search("%" + term.toUpperCase() + "%");
    }

    /**
     * Busca una división por sus campos únicos combinados
     *
     * @param anio Año académico
     * @param numDivision Número de división
     * @param orientacion Orientación académica
     * @param turno Turno de la división
     * @return La división encontrada o null si no existe
     */
    public Division findByAnioNumTurno(Integer anio, Integer numDivision, Turno turno) {
        return repository.findByAnioAndNumDivisionAndTurno(anio, numDivision, turno)
                .orElse(null);
    }
}
