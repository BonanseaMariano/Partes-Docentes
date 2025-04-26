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
 * Controlador REST para la gestión de divisiones
 */
@RestController
@RequestMapping("divisiones")
public class DivisionPresenter {

    @Autowired
    private DivisionService service;

    @GetMapping
    public ResponseEntity<Object> findAll() {
        return Response.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        Division divisionOrNull = service.findById(id);
        return (divisionOrNull != null) ? Response.ok(divisionOrNull)
                : Response.notFound("División con ID " + id + " no encontrada");
    }

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

    @PutMapping
    public ResponseEntity<Object> update(@RequestBody Division aDivision) {
        if (aDivision.getId() == null || aDivision.getId() <= 0) {
            return Response.error(aDivision, "Debe especificar un ID válido para poder modificar una división.");
        }

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        Division existingDivision = service.findById(id);
        if (existingDivision == null) {
            return Response.notFound("División con ID " + id + " no encontrada para eliminar");
        }

        try {
            service.delete(id);
            return Response.ok("División eliminada correctamente");
        } catch (Exception e) {
            return Response.dbError("No se puede eliminar la división debido a dependencias existentes");
        }
    }

    @GetMapping("/page")
    public ResponseEntity<Object> findByPage(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Response.ok(service.findByPage(page, size));
    }
}
