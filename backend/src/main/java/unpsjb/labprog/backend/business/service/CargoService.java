package unpsjb.labprog.backend.business.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.business.repository.CargoRepository;
import unpsjb.labprog.backend.business.validator.cargo.CargoValidator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;
import unpsjb.labprog.backend.model.enums.Turno;

/**
 * Servicio para la gestión de entidades Cargo. Implementa la lógica de negocio
 * para operaciones con cargos.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Service
public class CargoService {

    @Autowired
    private CargoRepository repository;

    @Autowired
    private CargoValidator validator;

    /**
     * Busca un cargo por su ID.
     *
     * @param id ID del cargo
     * @return Cargo encontrado o null si no existe
     */
    public Cargo findById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Obtiene todos los cargos registrados.
     *
     * @return Lista de todos los cargos
     */
    public List<Cargo> findAll() {
        return repository.findAll();
    }

    /**
     * Guarda un nuevo cargo o actualiza uno existente. Aplica validaciones de
     * reglas de negocio antes de guardar.
     *
     * @param cargo Cargo a guardar
     * @return Cargo guardado
     * @throws BusinessLogicException si no se cumplen las reglas de negocio
     */
    @Transactional
    public Cargo save(Cargo cargo) throws BusinessLogicException {
        validator.validar(cargo);
        return repository.save(cargo);
    }

    /**
     * Elimina un cargo por su ID.
     *
     * @param id ID del cargo a eliminar
     */
    @Transactional
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    /**
     * Obtiene una página de cargos con ordenamiento personalizado. Valida los
     * campos de ordenamiento por seguridad y usa valores por defecto para
     * campos inválidos.
     *
     * @param page Índice de página (basado en cero)
     * @param size Tamaño de la página
     * @param sortField Campo por el cual ordenar (validado contra lista
     * permitida)
     * @param sortDirection Dirección del ordenamiento (asc o desc, por defecto
     * desc)
     * @return Página con los cargos solicitados
     */
    public Page<Cargo> findByPage(int page, int size, String sortField, String sortDirection) {
        String[] allowedFields = {"id", "nombre", "cargaHoraria", "tipoDesignacion", "fechaInicio", "fechaFin", "division.orientacion"};
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
     * Busca cargos por un término de búsqueda general.
     *
     * @param term Término de búsqueda
     * @return Lista de cargos que coinciden con el término
     */
    public List<Cargo> search(String term) {
        return repository.search("%" + term.toUpperCase() + "%");
    }

    /**
     * Busca un cargo específico por nombre, tipo de designación y datos de
     * división. Los parámetros de división son opcionales.
     *
     * @param nombre Nombre del cargo
     * @param tipoDesignacion Tipo de designación del cargo
     * @param anio Año de la división (opcional)
     * @param numDivision Número de la división (opcional)
     * @param turno Turno de la división (opcional)
     * @return Cargo encontrado o null si no existe
     */
    public Cargo findByNombreAndTipoDesignacionAndDivision(
            String nombre,
            TipoDesignacion tipoDesignacion,
            Integer anio,
            Integer numDivision,
            Turno turno) {
        return repository.findByNombreAndTipoDesignacionAndDivision(
                nombre, tipoDesignacion, anio, numDivision, turno).orElse(null);
    }

}
