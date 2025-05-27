package unpsjb.labprog.backend.presenter;

import java.util.logging.Level;
import java.util.logging.Logger;

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
import unpsjb.labprog.backend.business.service.LicenciaService;
import unpsjb.labprog.backend.model.Licencia;
import unpsjb.labprog.backend.model.Log;
import unpsjb.labprog.backend.model.enums.Estado;
import unpsjb.labprog.backend.utils.constants.AppConstants;

/**
 * Controlador REST para la gestión de licencias en el sistema educativo.
 * Proporciona endpoints para crear, consultar, actualizar y eliminar licencias.
 * Las licencias representan permisos o ausencias de personal dentro de la
 * institución educativa.
 *
 * @see Licencia
 */
@RestController
@RequestMapping("licencias")
public class LicenciaPresenter {

    /**
     * Logger de la clase para registrar eventos y mensajes.
     */
    private Logger logger = Logger.getLogger(getClass().getSimpleName());

    /**
     * Servicio que implementa la lógica de negocio para las operaciones con
     * licencias.
     */
    @Autowired
    private LicenciaService service;

    /**
     * Obtiene todas las licencias registradas en el sistema.
     *
     * @return ResponseEntity con la lista completa de licencias si la operación
     * es exitosa
     */
    @GetMapping
    public ResponseEntity<Object> findAll() {
        return Response.ok(service.findAll());
    }

    /**
     * Busca una licencia específica por su identificador único.
     *
     * @param id Identificador único de la licencia a buscar
     * @return ResponseEntity con la licencia encontrada o un mensaje de error
     * si no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable int id) {
        Licencia licenciaOrNull = service.findById(id);
        return (licenciaOrNull != null) ? Response.ok(licenciaOrNull)
                : Response.notFound("Licencia con ID " + id + " no encontrada");
    }

    /**
     * Crea una nueva licencia en el sistema.
     *
     * @param aLicencia Objeto Licencia con los datos a registrar
     * @return ResponseEntity con un mensaje de éxito si la operación es
     * correcta o error en caso contrario
     */
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Licencia aLicencia) {
        try {
            Licencia createdLicencia = service.save(aLicencia);

            String mensaje;
            // Verificar si la licencia es válida según su estado
            if (createdLicencia.getEstado() == Estado.VALIDO) {
                mensaje = String.format(
                        "Se otorga Licencia artículo %s a %s %s",
                        createdLicencia.getArticuloLicencia().getArticulo(),
                        createdLicencia.getPersona().getNombre(),
                        createdLicencia.getPersona().getApellido());
            } else {
                // Extraer el mensaje de error del último log
                String errorDetail = obtenerMensajeUltimoLog(createdLicencia);
                return Response.internalServerError(errorDetail);
            }

            logger.log(Level.INFO, mensaje);
            return Response.ok(createdLicencia, mensaje);
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede crear la licencia debido a que ya existe otra idéntica");
        } catch (Exception e) {
            return Response.internalServerError("Error al procesar la licencia: " + e.getMessage());
        }
    }

    /**
     * Actualiza una licencia existente en el sistema.
     *
     * @param aLicencia Objeto Licencia con los datos actualizados
     * @return ResponseEntity con un mensaje de éxito si la operación es
     * correcta o error en caso contrario
     */
    @PutMapping
    public ResponseEntity<Object> update(@RequestBody Licencia aLicencia) {
        // Verificar si la licencia existe
        Licencia existingLicencia = service.findById(aLicencia.getId());
        if (existingLicencia == null) {
            return Response.notFound("Licencia con ID " + aLicencia.getId() + " no encontrada para actualizar");
        }

        try {
            // Conservar logs existentes
            aLicencia.setLogs(existingLicencia.getLogs());

            // Guardar y validar la licencia
            Licencia updatedLicencia = service.save(aLicencia);

            String mensaje;
            // Verificar si la licencia es válida según su estado
            if (updatedLicencia.getEstado() == Estado.VALIDO) {
                mensaje = String.format(
                        "Licencia artículo %s de %s %s actualizada correctamente",
                        updatedLicencia.getArticuloLicencia().getArticulo(),
                        updatedLicencia.getPersona().getNombre(),
                        updatedLicencia.getPersona().getApellido());
            } else {
                // Extraer el mensaje de error del último log
                String errorDetail = obtenerMensajeUltimoLog(updatedLicencia);
                mensaje = "La licencia se actualizó con estado INVÁLIDO: " + errorDetail;
            }

            logger.log(Level.INFO, mensaje);
            return Response.ok(updatedLicencia, mensaje);
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede actualizar la licencia debido a que ya existe otra idéntica");
        } catch (Exception e) {
            return Response.internalServerError("Error al actualizar la licencia: " + e.getMessage());
        }
    }

    /**
     * Elimina una licencia existente según su ID.
     *
     * @param id Identificador único de la licencia a eliminar
     * @return ResponseEntity con un mensaje de éxito si la operación es
     * correcta o error en caso contrario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable int id) {
        Licencia deletedLicencia = service.findById(id);
        if (deletedLicencia == null) {
            return Response.notFound("Licencia con ID " + id + " no encontrada para eliminar");
        }

        try {
            service.delete(id);
            String mensaje = String.format(
                    "Licencia artículo %s de %s %s eliminada correctamente",
                    deletedLicencia.getArticuloLicencia().getArticulo(),
                    deletedLicencia.getPersona().getNombre(),
                    deletedLicencia.getPersona().getApellido());

            logger.log(Level.INFO, mensaje);
            return Response.ok(null, mensaje);
        } catch (Exception e) {
            return Response.dbError("No se puede eliminar la licencia debido a dependencias existentes");
        }
    }

    /**
     * Obtiene una página de licencias para implementar paginación en el
     * cliente.
     *
     * @param page Número de página solicitada (comienza en 0)
     * @param size Cantidad de elementos por página
     * @return ResponseEntity con la página de licencias solicitada
     */
    @GetMapping("/page")
    public ResponseEntity<Object> findByPage(@RequestParam(defaultValue = AppConstants.DEFAULT_PAGE) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return Response.ok(service.findByPage(page, size));
    }

    /**
     * Método auxiliar para obtener el mensaje del último log de una licencia
     *
     * @param licencia Licencia de la que se quiere obtener el último mensaje de
     * log
     * @return Texto del último mensaje de log
     */
    private String obtenerMensajeUltimoLog(Licencia licencia) {
        if (licencia.getLogs() == null || licencia.getLogs().isEmpty()) {
            return "No hay detalles disponibles";
        }
        Log ultimoLog = licencia.getLogs().get(licencia.getLogs().size() - 1);
        return ultimoLog.getDescripcion();
    }
}
