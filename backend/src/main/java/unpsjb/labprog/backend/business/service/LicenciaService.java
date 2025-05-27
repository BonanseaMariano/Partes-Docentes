package unpsjb.labprog.backend.business.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.business.validator.licencia.LicenciaValidator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;
import unpsjb.labprog.backend.model.Log;
import unpsjb.labprog.backend.model.enums.Estado;

/**
 * Servicio que implementa la lógica de negocio para la entidad Licencia
 */
@Service
public class LicenciaService {

    @Autowired
    private LicenciaRepository repository;

    @Autowired
    private LicenciaValidator validator;

    @Autowired
    private DesignacionService designacionService;

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
     * Guarda una licencia aplicando la validación de reglas de negocio El
     * estado de la licencia se establece según el resultado de la validación
     */
    public Licencia save(Licencia licencia) {
        try {
            // Validar reglas de negocio
            validator.validar(licencia);

            // Si llega aquí, es válida
            licencia.setEstado(Estado.VALIDO);

            // Buscar las designaciones afectadas por esta licencia
            // (aquellas activas durante el período de la licencia)
            List<Designacion> designacionesAfectadas = designacionService.findDesignacionesActivasPorPersonaYPeriodo(
                    licencia.getPersona().getDni(),
                    licencia.getPedidoDesde(),
                    licencia.getPedidoHasta());

            // Crear log de éxito
            Log logExito = new Log();
            logExito.setFechaHora(LocalDateTime.now());
            logExito.setDescripcion("Licencia validada correctamente");
            licencia.getLogs().add(logExito);

            // Asignar las designaciones afectadas a la licencia
            licencia.setDesignaciones(designacionesAfectadas);
        } catch (BusinessLogicException e) {
            // Si hay error de validación, marcarla como inválida
            licencia.setEstado(Estado.INVALIDO);

            // Crear log de error
            Log logError = new Log();
            logError.setFechaHora(LocalDateTime.now());
            logError.setDescripcion(e.getMessage());
            licencia.getLogs().add(logError);
        }

        // Guardar la licencia con su estado correspondiente
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
