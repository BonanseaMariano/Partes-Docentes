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
import unpsjb.labprog.backend.business.service.DivisionService;
import unpsjb.labprog.backend.model.Division;

/**
 * Controlador REST para la gestión de divisiones escolares.
 * Proporciona endpoints para crear, consultar, actualizar y eliminar
 * divisiones.
 * Las divisiones representan cursos o grupos de estudiantes dentro de una
 * institución educativa.
 */
@RestController
@RequestMapping("divisiones")
public class DivisionPresenter {

    /**
     * Servicio que implementa la lógica de negocio para las operaciones con
     * divisiones.
     */
    @Autowired
    private DivisionService service;

    /**
     * Obtiene todas las divisiones registradas en el sistema.
     * 
     * @return ResponseEntity con la lista completa de divisiones si la operación es
     *         exitosa
     */
    @GetMapping
    public ResponseEntity<Object> findAll() {
        return Response.ok(service.findAll());
    }

    /**
     * Busca una división específica por su identificador único.
     * 
     * @param id Identificador único de la división a buscar
     * @return ResponseEntity con la división encontrada o un mensaje de error si no
     *         existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        Division divisionOrNull = service.findById(id);
        return (divisionOrNull != null) ? Response.ok(divisionOrNull)
                : Response.notFound("División con ID " + id + " no encontrada");
    }

    /**
     * Crea una nueva división en el sistema.
     * 
     * @param aDivision Objeto División con los datos a registrar
     * @return ResponseEntity con un mensaje de éxito si la operación es correcta o
     *         error en caso contrario
     */
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Division aDivision) {
        try {
            Division savedDivision = service.save(aDivision);
            // Formatear el mensaje para la respuesta según Division.feature
            String mensaje = String.format("División %dº %dº turno %s ingresada correctamente",
                    savedDivision.getAnio(),
                    savedDivision.getNumDivision(),
                    savedDivision.getTurno().toString());

            return Response.ok(mensaje);
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede crear la división debido a un conflicto en la base de datos");
        }
    }

    /**
     * Actualiza una división existente en el sistema.
     * 
     * @param aDivision Objeto División con los datos actualizados
     * @return ResponseEntity con un mensaje de éxito si la operación es correcta o
     *         error en caso contrario
     */
    @PutMapping
    public ResponseEntity<Object> update(@RequestBody Division aDivision) {
        // Verificar si la división existe
        Division existingDivision = service.findById(aDivision.getId());
        if (existingDivision == null) {
            return Response.notFound("División con ID " + aDivision.getId() + " no encontrada para actualizar");
        }

        try {
            Division updatedDivision = service.save(aDivision);
            // Formatear el mensaje para la respuesta según Division.feature
            String mensaje = String.format("División %dº %dº turno %s actualizada correctamente",
                    updatedDivision.getAnio(),
                    updatedDivision.getNumDivision(),
                    updatedDivision.getTurno().toString());

            return Response.ok(mensaje);
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede actualizar la división debido a un conflicto en la base de datos");
        }
    }

    /**
     * Elimina una división existente según su ID.
     * 
     * @param id Identificador único de la división a eliminar
     * @return ResponseEntity con un mensaje de éxito si la operación es correcta o
     *         error en caso contrario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        Division existingDivision = service.findById(id);
        try {
            service.delete(id);
            String mensaje = String.format("División %dº %dº turno %s eliminada correctamente",
                    existingDivision.getAnio(),
                    existingDivision.getNumDivision(),
                    existingDivision.getTurno().toString());
            return Response.ok(mensaje);
        } catch (Exception e) {
            return Response.dbError("No se puede eliminar la división debido a dependencias existentes");
        }
    }

    /**
     * Obtiene una página de divisiones para implementar paginación en el cliente.
     * 
     * @param page Número de página solicitada (comienza en 0)
     * @param size Cantidad de elementos por página
     * @return ResponseEntity con la página de divisiones solicitada
     */
    @GetMapping("/page")
    public ResponseEntity<Object> findByPage(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Response.ok(service.findByPage(page, size));
    }
}
