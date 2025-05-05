package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.business.service.DesignacionService;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * Controlador REST para la gestión de designaciones en el sistema educativo.
 * Proporciona endpoints para crear, consultar, actualizar y eliminar
 * designaciones.
 * Las designaciones representan asignaciones de cargos a personas
 * dentro de la institución educativa.
 * 
 * @see Designacion
 * @see DesignacionService
 * @see DesignacionRepository
 */
@RestController
@RequestMapping("designaciones")
public class DesignacionPresenter {
    /**
     * Servicio que implementa la lógica de negocio para las operaciones con
     * designaciones.
     */
    @Autowired
    private DesignacionService service;

    /**
     * Obtiene todas las designaciones registradas en el sistema.
     * 
     * @return ResponseEntity con la lista completa de designaciones si la operación
     *         es exitosa
     */
    @GetMapping
    public ResponseEntity<Object> findAll() {
        return Response.ok(service.findAll());
    }

    /**
     * Busca una designación específica por su identificador único.
     * 
     * @param id Identificador único de la designación a buscar
     * @return ResponseEntity con la designación encontrada o un mensaje de error si
     *         no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable int id) {
        Designacion designacionOrNull = service.findById(id);
        return (designacionOrNull != null) ? Response.ok(designacionOrNull)
                : Response.notFound("Designación con ID " + id + " no encontrada");
    }

    /**
     * Crea una nueva designación en el sistema.
     * 
     * @param aDesignacion Objeto Designación con los datos a registrar
     * @return ResponseEntity con un mensaje de éxito si la operación es correcta o
     *         error en caso contrario
     */
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Designacion aDesignacion) {
        try {
            Designacion createdDesignacion = service.save(aDesignacion);

            // Formatear el mensaje según el tipo de designación (CARGO o ESPACIO
            // CURRICULAR)
            String mensaje;

            if (createdDesignacion.getCargo().getTipoDesignacion().equals(TipoDesignacion.ESPACIO_CURRICULAR)
                    && createdDesignacion.getCargo().getDivision() != null) {
                // Formato para espacios curriculares
                mensaje = String.format(
                        "%s %s ha sido designado/a a la asignatura %s a la división %dº %dº turno %s exitosamente",
                        createdDesignacion.getPersona().getNombre(),
                        createdDesignacion.getPersona().getApellido(),
                        createdDesignacion.getCargo().getNombre(),
                        createdDesignacion.getCargo().getDivision().getAnio(),
                        createdDesignacion.getCargo().getDivision().getNumDivision(),
                        createdDesignacion.getCargo().getDivision().getTurno().getValor());
            } else {
                // Formato para cargos
                mensaje = String.format("%s %s ha sido designado/a como %s exitosamente",
                        createdDesignacion.getPersona().getNombre(),
                        createdDesignacion.getPersona().getApellido(),
                        createdDesignacion.getCargo().getNombre());
            }

            return Response.ok(null, mensaje);
        } catch (BusinessLogicException e) {
            // Capturar excepciones de validación de negocio y devolver error 422 (Entidad
            // no procesable)
            return Response.unprocessableEntity(e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede crear la designación debido a que ya existe otra idéntica");
        }
    }

    /**
     * Actualiza una designación existente en el sistema.
     * 
     * @param aDesignacion Objeto Designación con los datos actualizados
     * @return ResponseEntity con un mensaje de éxito si la operación es correcta o
     *         error en caso contrario
     */
    @PutMapping
    public ResponseEntity<Object> update(@RequestBody Designacion aDesignacion) {
        // Verificar si la designación existe
        Designacion existingDesignacion = service.findById(aDesignacion.getId());
        if (existingDesignacion == null) {
            return Response.notFound("Designación con ID " + aDesignacion.getId() + " no encontrada para actualizar");
        }

        try {
            Designacion updatedDesignacion = service.save(aDesignacion);

            // Formatear el mensaje según el tipo de designación (CARGO o ESPACIO
            // CURRICULAR)
            String mensaje;

            if (updatedDesignacion.getCargo().getTipoDesignacion().equals(TipoDesignacion.ESPACIO_CURRICULAR)
                    && updatedDesignacion.getCargo().getDivision() != null) {
                // Formato para espacios curriculares
                mensaje = String.format(
                        "Designación de %s %s a la asignatura %s en la división %dº %dº turno %s actualizada exitosamente",
                        updatedDesignacion.getPersona().getNombre(),
                        updatedDesignacion.getPersona().getApellido(),
                        updatedDesignacion.getCargo().getNombre(),
                        updatedDesignacion.getCargo().getDivision().getAnio(),
                        updatedDesignacion.getCargo().getDivision().getNumDivision(),
                        updatedDesignacion.getCargo().getDivision().getTurno().getValor());
            } else {
                // Formato para cargos
                mensaje = String.format("Designación de %s %s como %s actualizada exitosamente",
                        updatedDesignacion.getPersona().getNombre(),
                        updatedDesignacion.getPersona().getApellido(),
                        updatedDesignacion.getCargo().getNombre());
            }

            return Response.ok(null, mensaje);
        } catch (BusinessLogicException e) {
            // Capturar excepciones de validación de negocio y devolver error 422 (Entidad
            // no procesable)
            return Response.unprocessableEntity(e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede actualizar la designación debido a que ya existe otra idéntica");
        }
    }

    /**
     * Elimina una designación existente según su ID.
     * 
     * @param id Identificador único de la designación a eliminar
     * @return ResponseEntity con un mensaje de éxito si la operación es correcta o
     *         error en caso contrario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable int id) {
        Designacion deletedDesignacion = service.findById(id);
        if (deletedDesignacion == null) {
            return Response.notFound("Designación con ID " + id + " no encontrada para eliminar");
        }

        try {
            service.delete(id);
            String mensaje = String.format("Designación de %s %s como %s eliminada correctamente",
                    deletedDesignacion.getPersona().getNombre(),
                    deletedDesignacion.getPersona().getApellido(),
                    deletedDesignacion.getCargo().getNombre());
            return Response.ok(null, mensaje);
        } catch (Exception e) {
            return Response.dbError("No se puede eliminar la designación debido a dependencias existentes");
        }
    }

    /**
     * Obtiene una página de designaciones para implementar paginación en el
     * cliente.
     * 
     * @param page Número de página solicitada (comienza en 0)
     * @param size Cantidad de elementos por página
     * @return ResponseEntity con la página de designaciones solicitada
     */
    @GetMapping("/page")
    public ResponseEntity<Object> findByPage(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Response.ok(service.findByPage(page, size));
    }
}
