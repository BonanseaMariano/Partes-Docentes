package unpsjb.labprog.backend.business.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.business.repository.CargoRepository;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;
import unpsjb.labprog.backend.model.enums.Turno;

/**
 * Servicio que implementa la lógica de negocio para la entidad Cargo
 * 
 * @see Cargo
 */
@Service
public class CargoService {

    @Autowired
    private CargoRepository repository;

    /**
     * Busca un cargo por su ID
     * 
     * @param id ID del cargo a buscar
     * @return Cargo encontrado o null si no existe
     */
    public Cargo findById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Obtiene todos los cargos registrados
     * 
     * @return Lista de todos los cargos
     */
    public List<Cargo> findAll() {
        return repository.findAll();
    }

    /**
     * Guarda un nuevo cargo o actualiza uno existente, aplicando las reglas de
     * negocio
     * 
     * @param cargo Cargo a guardar
     * @return Cargo guardado
     * @throws BusinessLogicException si no se cumplen las reglas de negocio
     */
    @Transactional
    public Cargo save(Cargo cargo) throws BusinessLogicException {
        // Validar reglas de negocio para el tipo de designación y división antes de
        // guardar
        validarReglasDeNegocio(cargo);

        // Si pasa las validaciones, guardar el cargo
        return repository.save(cargo);
    }

    /**
     * Elimina un cargo por su ID
     * 
     * @param id ID del cargo a eliminar
     */
    @Transactional
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    /**
     * Obtiene una página de entidades Cargo.
     * 
     * @param page el índice de página basado en cero
     * @param size el tamaño de la página a devolver
     * @return un objeto Page que contiene las entidades Cargo solicitadas
     */
    public Page<Cargo> findByPage(int page, int size) {
        return repository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
    }

    /**
     * Busca cargos por un término de búsqueda.
     * 
     * @param term el término de búsqueda
     * @return una lista de cargos que coinciden con el término de búsqueda
     */
    public List<Cargo> search(String term) {
        return repository.search("%" + term.toUpperCase() + "%");
    }

    /**
     * Busca un cargo por su nombre, tipo de designación y opcionalmente por los
     * atributos de la división
     * 
     * @param nombre          Nombre del cargo a buscar
     * @param tipoDesignacion Tipo de designación del cargo a buscar
     * @param anio            Año de la división (opcional)
     * @param numDivision     Número de la división (opcional)
     * @param turno           Turno de la división (opcional)
     * @return Cargo encontrado que coincide con los criterios de búsqueda o null si
     *         no existe
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

    /**
     * Valida las reglas de negocio específicas para los cargos:
     * 1. Si es ESPACIO CURRICULAR, debe tener una división asignada
     * 2. Si es CARGO, no debe tener una división asignada
     * 3. La fecha de inicio debe ser anterior a la fecha de finalización
     * 
     * @param cargo Cargo a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    private void validarReglasDeNegocio(Cargo cargo) throws BusinessLogicException {
        // Validaciones para ESPACIO_CURRICULAR
        if (TipoDesignacion.ESPACIO_CURRICULAR.equals(cargo.getTipoDesignacion())) {
            if (cargo.getDivision() == null) {
                throw new BusinessLogicException("Espacio Curricular " + cargo.getNombre() + " falta asignar división");
            }
        }
        // Validaciones para CARGO
        else if (TipoDesignacion.CARGO.equals(cargo.getTipoDesignacion()) && cargo.getDivision() != null) {
            // Si está el campo division asignado, no importa si tiene ID o no, es un error
            throw new BusinessLogicException(
                    "Cargo de " + cargo.getNombre() + " es CARGO y no corresponde asignar división");
        }

        // Validación adicional: fechaInicio debe ser anterior a fechaFin
        if (cargo.getFechaFin() != null && cargo.getFechaInicio().isAfter(cargo.getFechaFin())) {
            throw new BusinessLogicException(
                    "La fecha de inicio no puede ser posterior a la fecha de finalización");
        }
    }
}
