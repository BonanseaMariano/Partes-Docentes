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
import unpsjb.labprog.backend.business.service.PersonaService;
import unpsjb.labprog.backend.business.service.ReporteService;
import unpsjb.labprog.backend.dto.ReporteDTO;
import unpsjb.labprog.backend.model.Persona;
import unpsjb.labprog.backend.utils.constants.AppConstants;

/**
 * Controlador REST para la gestión de personas en el sistema. Proporciona
 * endpoints para crear, consultar, actualizar y eliminar registros de personas.
 * Permite buscar personas por su DNI o CUIL y manejar la paginación de
 * resultados.
 */
@RestController
@RequestMapping("personas")
public class PersonaPresenter {

    /**
     * Logger de la clase para registrar eventos y mensajes.
     */
    private Logger logger = Logger.getLogger(getClass().getSimpleName());

    /**
     * Servicio que implementa la lógica de negocio para las operaciones con
     * personas.
     */
    @Autowired
    private PersonaService service;

    /**
     * Servicio especializado en la generación de reportes para docentes.
     */
    @Autowired
    private ReporteService reporteService;

    /**
     * Obtiene todas las personas registradas en el sistema.
     *
     * @return ResponseEntity con la lista completa de personas si la operación
     * es exitosa
     */
    @GetMapping
    public ResponseEntity<Object> findAll() {
        return Response.ok(service.findAll());
    }

    /**
     * Busca una persona específica por su id.
     *
     * @param id id de la persona a buscar
     * @return ResponseEntity con la persona encontrada o un mensaje de error si
     * no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable int id) {
        Persona personaOrNull = service.findById(id);
        return (personaOrNull != null) ? Response.ok(personaOrNull)
                : Response.notFound("Persona id " + id + " no encontrada");
    }

    /**
     * Busca una persona específica por su número de DNI.
     *
     * @param dni Número de DNI de la persona a buscar
     * @return ResponseEntity con la persona encontrada o un mensaje de error si
     * no existe
     */
    @GetMapping("/dni/{dni}")
    public ResponseEntity<Object> findByDni(@PathVariable int dni) {
        Persona personaOrNull = service.findByDni(dni);
        return (personaOrNull != null) ? Response.ok(personaOrNull)
                : Response.notFound("Persona dni " + dni + " no encontrada");
    }

    /**
     * Busca una persona específica por su número de CUIL.
     *
     * @param cuil Número de CUIL de la persona a buscar
     * @return ResponseEntity con la persona encontrada o un mensaje de error si
     * no existe
     */
    @GetMapping("/cuil/{cuil}")
    public ResponseEntity<Object> findByCuil(@PathVariable String cuil) {
        Persona personaOrNull = service.findByCuil(cuil);
        return (personaOrNull != null) ? Response.ok(personaOrNull)
                : Response.notFound("Persona cuil " + cuil + " no encontrada");
    }

    /**
     * Crea una nueva persona en el sistema.
     *
     * @param aPersona Objeto Persona con los datos a registrar
     * @return ResponseEntity con un mensaje de éxito si la operación es
     * correcta o error en caso contrario
     */
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Persona aPersona) {
        try {
            Persona createdPersona = service.save(aPersona);
            // Formatear el mensaje según lo requerido en Persona.feature
            String mensaje = String.format("%s %s con DNI %d ingresado/a correctamente",
                    createdPersona.getNombre(),
                    createdPersona.getApellido(),
                    createdPersona.getDni());

            logger.log(Level.INFO, mensaje);
            return Response.ok(null, mensaje);
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("Ya existe una persona con el mismo DNI o CUIL");
        }
    }

    /**
     * Actualiza los datos de una persona existente en el sistema.
     *
     * @param aPersona Objeto Persona con los datos actualizados
     * @return ResponseEntity con un mensaje de éxito si la operación es
     * correcta o error en caso contrario
     */
    @PutMapping
    public ResponseEntity<Object> update(@RequestBody Persona aPersona) {
        Persona existingPersona = service.findById(aPersona.getId());
        if (existingPersona == null) {
            return Response.notFound("Persona con DNI " + aPersona.getDni() + " no encontrada para actualizar");
        }

        try {
            Persona updatedPersona = service.save(aPersona);
            // Formatear el mensaje según lo requerido en Persona.feature
            String mensaje = String.format("%s %s con DNI %d actualizado/a correctamente",
                    updatedPersona.getNombre(),
                    updatedPersona.getApellido(),
                    updatedPersona.getDni());

            logger.log(Level.INFO, mensaje);
            return Response.ok(null, mensaje);
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("Ya existe una persona con el mismo DNI o CUIL");
        }
    }

    /**
     * Obtiene una página de personas para implementar paginación en el cliente.
     *
     * @param page Número de página solicitada (comienza en 0)
     * @param size Cantidad de elementos por página
     * @return ResponseEntity con la página de personas solicitada
     */
    @GetMapping("/page")
    public ResponseEntity<Object> findByPage(@RequestParam(defaultValue = AppConstants.DEFAULT_PAGE) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return Response.ok(service.findByPage(page, size));
    }

    /**
     * Elimina una persona existente según su id. Verifica primero si la persona
     * tiene asociaciones con otras entidades.
     *
     * @param id Número de id de la persona a eliminar
     * @return ResponseEntity con un mensaje de éxito si la operación es
     * correcta o error en caso contrario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable int id) {
        Persona deletedPersona = service.findById(id);
        try {
            service.delete(id);
            // Formatear el mensaje según el formato utilizado en create y update
            String mensaje = String.format("%s %s con DNI %d eliminado/a correctamente",
                    deletedPersona.getNombre(),
                    deletedPersona.getApellido(),
                    deletedPersona.getDni());

            logger.log(Level.INFO, mensaje);
            return Response.ok(null, mensaje);
        } catch (DataIntegrityViolationException e) {
            return Response
                    .dbError(
                            String.format(
                                    "No se puede eliminar a %s %s con DNI %d porque está asociado/a a designaciones y/o licencias",
                                    deletedPersona.getNombre(),
                                    deletedPersona.getApellido(),
                                    deletedPersona.getDni()));
        }
    }

    /**
     * Genera un reporte para un docente específico en un año determinado. El
     * reporte incluye análisis estadístico de licencias, designaciones y
     * calificación automática del desempeño del docente.
     *
     * @param dni DNI del docente para quien generar el reporte
     * @param año Año para el cual generar el reporte
     * @return ResponseEntity con ReporteDTO si la operación es exitosa, o un
     * mensaje de error si no se encuentra el docente
     */
    @GetMapping("/dni/{dni}/reporte/{año}")
    public ResponseEntity<Object> generarReporte(
            @PathVariable Long dni,
            @PathVariable Integer año) {
        try {
            ReporteDTO reporte = reporteService.generarReporte(dni, año);
            String mensaje = String.format(
                    "Reporte generado exitosamente para DNI %d en el año %d",
                    dni, año);
            logger.log(Level.INFO, mensaje);
            return Response.ok(reporte, mensaje);
        } catch (IllegalArgumentException e) {
            String mensajeError = String.format(
                    "No se pudo generar el reporte: %s",
                    e.getMessage());
            logger.log(Level.WARNING, mensajeError);
            return Response.notFound(mensajeError);
        } catch (Exception e) {
            String mensajeError = String.format(
                    "Error interno al generar el reporte para DNI %d en el año %d: %s",
                    dni, año, e.getMessage());
            logger.log(Level.SEVERE, mensajeError, e);
            return Response.internalServerError(mensajeError);
        }
    }

    /**
     * Busca personas por un término de búsqueda.
     *
     * @param term el término de búsqueda
     * @return una lista de personas que coinciden con el término de búsqueda
     */
    @GetMapping("/search/{term}")
    public ResponseEntity<Object> search(@PathVariable String term) {
        return Response.ok(service.search(term));
    }
}
