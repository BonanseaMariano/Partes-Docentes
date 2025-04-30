package unpsjb.labprog.backend.business.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.business.repository.CargoRepository;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

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
        return repository.findAll(PageRequest.of(page, size));
    }

    /**
     * Valida las reglas de negocio específicas para los cargos:
     * 1. Si es ESPACIO CURRICULAR, debe tener una división asignada
     * 2. Si es CARGO, no debe tener una división asignada
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
        else if (TipoDesignacion.CARGO.equals(cargo.getTipoDesignacion())) {
            // Verificamos más estrictamente si hay una división asignada
            // Puede venir como un objeto parcialmente inicializado desde el cliente
            if (cargo.getDivision() != null) {
                // Si está el campo division asignado, no importa si tiene ID o no, es un error
                throw new BusinessLogicException(
                        "Cargo de " + cargo.getNombre() + " es CARGO y no corresponde asignar división");
            }
        }
    }
}
