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
import unpsjb.labprog.backend.exception.NotModifiableException;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;
import unpsjb.labprog.backend.model.Log;
import unpsjb.labprog.backend.model.Persona;
import unpsjb.labprog.backend.model.enums.Estado;

/**
 * Servicio para la gestión de licencias de personal docente. Proporciona
 * operaciones para crear, validar, consultar y administrar licencias,
 * incluyendo la validación de reglas de negocio y gestión de estados.
 *
 * @author Mariano Bonansea
 * @version 1.0
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
     * Obtiene todas las licencias registradas en el sistema.
     *
     * @return lista de todas las licencias
     */
    public List<Licencia> findAll() {
        return repository.findAll();
    }

    /**
     * Busca una licencia por su identificador único.
     *
     * @param id identificador de la licencia
     * @return licencia encontrada o null si no existe
     */
    public Licencia findById(int id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Guarda una licencia aplicando validaciones de reglas de negocio. El
     * estado de la licencia se establece automáticamente según el resultado de
     * la validación. También se vinculan las designaciones afectadas por el
     * período de la licencia.
     *
     * @param licencia licencia a guardar
     * @return licencia guardada con estado actualizado
     * @throws NotModifiableException si se intenta modificar una licencia ya
     * validada
     */
    public Licencia save(Licencia licencia) throws NotModifiableException {
        if (licencia.getEstado() != null && licencia.getEstado() == Estado.VALIDO) {
            throw new NotModifiableException("No se puede modificar una licencia ya validada");
        }

        try {
            validator.validar(licencia);

            licencia.setEstado(Estado.VALIDO);

            List<Designacion> designacionesAfectadas = designacionService.findDesignacionesActivasPorPersonaYPeriodo(
                    licencia.getPersona().getDni(),
                    licencia.getPedidoDesde(),
                    licencia.getPedidoHasta());

            Log logExito = new Log();
            logExito.setFechaHora(LocalDateTime.now());
            logExito.setDescripcion("Licencia validada correctamente");
            licencia.getLogs().add(logExito);

            licencia.setDesignaciones(designacionesAfectadas);
        } catch (BusinessLogicException e) {
            licencia.setEstado(Estado.INVALIDO);

            Log logError = new Log();
            logError.setFechaHora(LocalDateTime.now());
            logError.setDescripcion(e.getMessage());
            licencia.getLogs().add(logError);
        }

        return repository.save(licencia);
    }

    /**
     * Elimina una licencia del sistema.
     *
     * @param id identificador de la licencia a eliminar
     */
    @Transactional
    public void delete(int id) {
        repository.deleteById(id);
    }

    /**
     * Obtiene una página de licencias con paginación y ordenamiento
     * personalizado. Valida que el campo de ordenamiento sea permitido por
     * seguridad.
     *
     * @param page índice de página (basado en cero)
     * @param size tamaño de la página
     * @param sortField campo por el cual ordenar
     * @param sortDirection dirección del ordenamiento (asc o desc)
     * @return página de licencias con el ordenamiento especificado
     */
    public Page<Licencia> findByPage(int page, int size, String sortField, String sortDirection) {
        String[] allowedFields = {"id", "persona.dni", "pedidoDesde", "pedidoHasta", "certificadoMedico",
            "articuloLicencia.articulo", "estado"};
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
     * Busca licencias válidas de una persona en un año específico. Utilizado
     * principalmente para generar reportes.
     *
     * @param persona persona asociada a las licencias
     * @param anio año a consultar
     * @return lista de licencias válidas de la persona en el año especificado
     */
    public List<Licencia> findLicenciasPorPersonaYAño(Persona persona, Integer anio) {
        return repository.findLicenciasPorPersonaYAño(persona, anio);
    }
}
