package unpsjb.labprog.backend.business.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.business.validator.LicenciaValidator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Servicio que implementa la lógica de negocio para la entidad Licencia
 */
@Service
public class LicenciaService {

    @Autowired
    LicenciaRepository repository;

    @Autowired
    private LicenciaValidator validator;

    /**
     * Busca todas las licencias registradas
     * 
     * @return Lista de todas las licencias
     */
    public List<Licencia> findAll() {
        return repository.findAll();
    }

    /**
     * Busca una licencia por su id
     * 
     * @param id ID de la licencia a buscar
     * @return Licencia encontrada o null si no existe
     */
    public Licencia findById(int id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Guarda una nueva licencia o actualiza una existente
     * 
     * @param licencia Licencia a guardar
     * @return Licencia guardada
     * @throws BusinessLogicException si no se cumplen las reglas de negocio
     */
    @Transactional
    public Licencia save(Licencia licencia) throws BusinessLogicException {

        // Validar reglas de negocio antes de guardar usando el validador específico
        validator.validar(licencia);

        return repository.save(licencia);
    }

    /**
     * Elimina una licencia por su id
     * 
     * @param id id de la licencia a eliminar
     */
    @Transactional
    public void delete(int id) {
        repository.deleteById(id);
    }

    /**
     * Obtiene una página de entidades Licencia.
     * 
     * @param page el índice de página basado en cero
     * @param size el tamaño de la página a devolver
     * @return un objeto Page que contiene las entidades Licencia solicitadas
     */
    public Page<Licencia> findByPage(int page, int size) {
        return repository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
    }
}
