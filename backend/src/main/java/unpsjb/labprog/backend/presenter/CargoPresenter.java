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
import unpsjb.labprog.backend.business.service.CargoService;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * Controlador REST para la gestión de cargos en el sistema educativo.
 * Proporciona endpoints para crear, consultar, actualizar y eliminar
 * cargos.
 * Los cargos representan posiciones o roles dentro de la institución educativa.
 * 
 * @see Cargo
 */
@RestController
@RequestMapping("cargos")
public class CargoPresenter {

    /**
     * Servicio que implementa la lógica de negocio para las operaciones con
     * cargos.
     */
    @Autowired
    private CargoService service;

    /**
     * Obtiene todos los cargos en el sistema
     * 
     * @return ResponseEntity con la lista completa de cargos si la operación es
     *         exitosa
     */
    @GetMapping
    public ResponseEntity<Object> findAll() {
        return Response.ok(service.findAll());
    }

    /**
     * Busca un cargo por su ID
     * 
     * @param id ID del cargo
     * @return ResponseEntity con el cargo encontrado o mensaje de error
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable int id) {
        Cargo cargoOrNull = service.findById(id);
        return (cargoOrNull != null) ? Response.ok(cargoOrNull)
                : Response.notFound("Cargo con ID " + id + " no encontrado");
    }

    /**
     * Crea un nuevo cargo en el sistema.
     * 
     * @param aCargo Objeto Cargo con los datos a registrar
     * @return ResponseEntity con un mensaje de éxito si la operación es correcta o
     *         error en caso contrario
     */
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Cargo aCargo) {
        try {
            // Verificar explícitamente la regla de negocio para cargos con división
            if (aCargo.getTipoDesignacion() == TipoDesignacion.CARGO && aCargo.getDivision() != null) {
                return Response.notImplemented(
                        String.format("Cargo de %s es CARGO y no corresponde asignar división", aCargo.getNombre()));
            }
            // Verificar explícitamente la regla de negocio para espacios curriculares sin división
            if (aCargo.getTipoDesignacion() == TipoDesignacion.ESPACIO_CURRICULAR && aCargo.getDivision() == null) {
                return Response.notImplemented(
                        String.format("Espacio Curricular %s falta asignar división", aCargo.getNombre()));
            }

            Cargo createdCargo = service.save(aCargo);

            // Generar mensaje según el tipo de designación
            String mensaje;
            if (createdCargo.getTipoDesignacion() == TipoDesignacion.ESPACIO_CURRICULAR) {
                // Para espacios curriculares, incluir la información de la división
                mensaje = String.format(
                        "Espacio Curricular %s para la división %dº %dº Turno %s ingresado correctamente",
                        createdCargo.getNombre(),
                        createdCargo.getDivision().getAnio(),
                        createdCargo.getDivision().getNumDivision(),
                        createdCargo.getDivision().getTurno().getValor());
            } else {
                // Para cargos normales
                mensaje = String.format("Cargo de %s ingresado correctamente", createdCargo.getNombre());
            }

            return Response.ok(createdCargo, mensaje);
        } catch (BusinessLogicException e) {
            // Capturar excepciones de validación de negocio y devolver error 501
            return Response.notImplemented(e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede crear el cargo debido a que ya existe otro identico");
        }
    }

    /**
     * Actualiza un cargo existente en el sistema.
     * 
     * @param aCargo Objeto Cargo con los datos actualizados
     * @return ResponseEntity con un mensaje de éxito si la operación es correcta o
     *         error en caso contrario
     */
    @PutMapping
    public ResponseEntity<Object> update(@RequestBody Cargo aCargo) {
        // Verificar si el cargo existe
        Cargo existingCargo = service.findById(aCargo.getId());
        if (existingCargo == null) {
            return Response.notFound("Cargo con ID " + aCargo.getId() + " no encontrado para actualizar");
        }

        try {
            Cargo updatedCargo = service.save(aCargo);

            // Generar mensaje según el tipo de designación
            String mensaje;
            if (updatedCargo
                    .getTipoDesignacion() == unpsjb.labprog.backend.model.enums.TipoDesignacion.ESPACIO_CURRICULAR) {
                // Para espacios curriculares, incluir la información de la división
                mensaje = String.format(
                        "Espacio Curricular %s para la división %dº %dº Turno %s actualizado correctamente",
                        updatedCargo.getNombre(),
                        updatedCargo.getDivision().getAnio(),
                        updatedCargo.getDivision().getNumDivision(),
                        updatedCargo.getDivision().getTurno().getValor());
            } else {
                // Para cargos normales
                mensaje = String.format("Cargo de %s actualizado correctamente", updatedCargo.getNombre());
            }

            return Response.ok(updatedCargo, mensaje);
        } catch (BusinessLogicException e) {
            // Capturar excepciones de validación de negocio y devolver error 501
            return Response.notImplemented(e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede actualizar el cargo debido a que ya existe otro identico");
        }
    }

    /**
     * Elimina un cargo existente según su ID.
     * 
     * @param id Identificador único del cargo a eliminar
     * @return ResponseEntity con un mensaje de éxito si la operación es correcta o
     *         error en caso contrario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Integer id) {
        Cargo deletedCargo = service.findById(id);
        try {
            service.delete(id);

            String mensaje = String.format("Cargo %s %s eliminado correctamente",
                    deletedCargo.getTipoDesignacion().getValor(),
                    deletedCargo.getNombre());
            return Response.ok(deletedCargo, mensaje);
        } catch (Exception e) {
            return Response.dbError("No se puede eliminar el cargo debido a dependencias existentes");
        }
    }

    /**
     * Obtiene una página de cargos para implementar paginación en el cliente.
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
