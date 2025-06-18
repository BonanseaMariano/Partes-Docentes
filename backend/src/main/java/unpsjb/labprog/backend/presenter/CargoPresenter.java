package unpsjb.labprog.backend.presenter;

import java.time.LocalDate;
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
import unpsjb.labprog.backend.business.service.CargoService;
import unpsjb.labprog.backend.business.service.HorarioService;
import unpsjb.labprog.backend.dto.HorarioDTO;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;
import unpsjb.labprog.backend.model.enums.Turno;
import unpsjb.labprog.backend.utils.constants.AppConstants;

/**
 * Controlador REST para la gestión de cargos en el sistema educativo.
 * Proporciona endpoints para crear, consultar, actualizar y eliminar cargos.
 * Los cargos representan posiciones o roles dentro de la institución educativa.
 *
 * @see Cargo
 */
@RestController
@RequestMapping("cargos")
public class CargoPresenter {

    /**
     * Logger de la clase para registrar eventos y mensajes.
     */
    private static final Logger logger = Logger.getLogger(CargoPresenter.class.getSimpleName());

    /**
     * Servicio que implementa la lógica de negocio para las operaciones con
     * cargos.
     */
    @Autowired
    private CargoService service;

    /**
     * Servicio que implementa la lógica de negocio para los horarios.
     */
    @Autowired
    private HorarioService horarioService;

    /**
     * Obtiene todos los cargos en el sistema
     *
     * @return ResponseEntity con la lista completa de cargos si la operación es
     * exitosa
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
     * @return ResponseEntity con un mensaje de éxito si la operación es
     * correcta o error en caso contrario
     */
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Cargo aCargo) {
        try {
            Cargo createdCargo = service.save(aCargo);
            // Generar mensaje según el tipo de designación
            String mensaje;
            if (createdCargo.getTipoDesignacion() == TipoDesignacion.ESPACIO_CURRICULAR) {
                // Para espacios curriculares, incluir la información de la división
                mensaje = String.format(
                        "%s %s para la división %dº %dº Turno %s ingresado correctamente",
                        createdCargo.getTipoDesignacion().getValor(),
                        createdCargo.getNombre(),
                        createdCargo.getDivision().getAnio(),
                        createdCargo.getDivision().getNumDivision(),
                        createdCargo.getDivision().getTurno());
            } else {
                // Para cargos normales
                mensaje = String.format("%s de %s ingresado correctamente",
                        createdCargo.getTipoDesignacion().getValor(),
                        createdCargo.getNombre());
            }

            logger.log(Level.INFO, mensaje);
            return Response.ok(null, mensaje);
        } catch (BusinessLogicException e) {
            // Capturar excepciones de validación de negocio y devolver error 422 (Entidad
            // no procesable)
            logger.log(Level.INFO, e.getMessage());
            return Response.internalServerError(e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede crear el cargo debido a que ya existe otro identico");
        }
    }

    /**
     * Actualiza un cargo existente en el sistema.
     *
     * @param aCargo Objeto Cargo con los datos actualizados
     * @return ResponseEntity con un mensaje de éxito si la operación es
     * correcta o error en caso contrario
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
                        updatedCargo.getDivision().getTurno());
            } else {
                // Para cargos normales
                mensaje = String.format("Cargo de %s actualizado correctamente", updatedCargo.getNombre());
            }

            logger.log(Level.INFO, mensaje);
            return Response.ok(null, mensaje);
        } catch (BusinessLogicException e) {
            // Capturar excepciones de validación de negocio y devolver error 501
            logger.log(Level.INFO, e.getMessage());
            return Response.internalServerError(e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede actualizar el cargo debido a que ya existe otro identico");
        }
    }

    /**
     * Elimina un cargo existente según su ID.
     *
     * @param id Identificador único del cargo a eliminar
     * @return ResponseEntity con un mensaje de éxito si la operación es
     * correcta o error en caso contrario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Integer id) {
        Cargo deletedCargo = service.findById(id);
        try {
            service.delete(id);

            String mensaje = String.format("Cargo %s %s eliminado correctamente",
                    deletedCargo.getTipoDesignacion().getValor(),
                    deletedCargo.getNombre());

            logger.log(Level.INFO, mensaje);
            return Response.ok(null, mensaje);
        } catch (Exception e) {
            return Response.dbError("No se puede eliminar el cargo debido a dependencias existentes");
        }
    }

    /**
     * Obtiene una página de cargos para implementar paginación en el cliente.
     *
     * @param page Número de página solicitada (comienza en 0)
     * @param size Cantidad de elementos por página
     * @param sortField Campo por el cual ordenar (nombre, cargaHoraria,
     * tipoDesignacion, fechaInicio, fechaFin, division.orientacion)
     * @param sortDirection Dirección del ordenamiento (asc o desc)
     * @return ResponseEntity con la página de cargos solicitada
     */
    @GetMapping("/page")
    public ResponseEntity<Object> findByPage(@RequestParam(defaultValue = AppConstants.DEFAULT_PAGE) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        return Response.ok(service.findByPage(page, size, sortField, sortDirection));
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

    /**
     * Busca un cargo por su nombre, tipo de designación y opcionalmente por los
     * atributos de la división
     *
     * @param nombre Nombre del cargo a buscar
     * @param tipoDesignacion Tipo de designación del cargo a buscar (CARGO o
     * ESPACIO_CURRICULAR)
     * @param anio Año de la división (opcional)
     * @param numDivision Número de la división (opcional)
     * @param turno Turno de la división (opcional)
     * @return ResponseEntity con el cargo encontrado o mensaje de error si no
     * existe
     */
    @GetMapping("/find")
    public ResponseEntity<Object> findByNombreAndTipoDesignacionAndDivision(
            @RequestParam String nombre,
            @RequestParam TipoDesignacion tipoDesignacion,
            @RequestParam(required = false) Integer anio,
            @RequestParam(required = false) Integer numDivision,
            @RequestParam(required = false) Turno turno) {

        Cargo cargo = service.findByNombreAndTipoDesignacionAndDivision(
                nombre, tipoDesignacion, anio, numDivision, turno);

        String divisionMessage = (anio != null || numDivision != null || turno != null)
                ? " para la división especificada"
                : "";

        return (cargo != null) ? Response.ok(cargo)
                : Response.notFound(
                        String.format("No se encontró cargo con nombre '%s' y tipo '%s'%s",
                                nombre,
                                tipoDesignacion.getValor(),
                                divisionMessage));
    }

    /**
     * Obtiene los horarios de espacios curriculares para un turno y fecha
     * específicos, con filtro opcional por año
     *
     * @param turno Turno para filtrar las divisiones (Mañana, Tarde,
     * Vespertino, Noche)
     * @param fecha Fecha para verificar la vigencia de cargos y designaciones
     * (formato: yyyy-MM-dd)
     * @param anio Año de la división para filtrar (opcional, null para todos
     * los años)
     * @return ResponseEntity con la grilla de horarios organizada por día y
     * hora
     */
    @GetMapping("/horarios/{turno}/{fecha}")
    public ResponseEntity<Object> obtenerHorarios(
            @PathVariable Turno turno,
            @PathVariable String fecha,
            @RequestParam(required = false) Integer anio) {
        try {
            // Parsear la fecha
            LocalDate fechaParsed = LocalDate.parse(fecha);

            // Obtener los horarios usando el servicio unificado
            HorarioDTO horarios = horarioService.obtenerHorarios(turno, anio, fechaParsed);

            return Response.ok(horarios);
        } catch (Exception e) {
            logger.log(Level.SEVERE,
                    "Error al obtener horarios para turno " + turno + " y fecha " + fecha
                    + (anio != null ? " (año: " + anio + ")" : " (todos los años)"), e);
            return Response.internalServerError("Error al obtener los horarios: " + e.getMessage());
        }
    }

    /**
     * Obtiene los horarios de espacios curriculares para un turno, año y fecha
     * específicos
     *
     * @param turno Turno para filtrar las divisiones (Mañana, Tarde,
     * Vespertino, Noche)
     * @param anio Año de la división para filtrar
     * @param fecha Fecha para verificar la vigencia de cargos y designaciones
     * (formato: yyyy-MM-dd)
     * @return ResponseEntity con la grilla de horarios organizada por día y
     * hora
     */
    @GetMapping("/horarios/{turno}/{anio}/{fecha}")
    public ResponseEntity<Object> obtenerHorariosConAnio(
            @PathVariable Turno turno,
            @PathVariable Integer anio,
            @PathVariable String fecha) {
        try {
            // Parsear la fecha
            LocalDate fechaParsed = LocalDate.parse(fecha);

            // Obtener los horarios usando el servicio con filtro de año
            HorarioDTO horarios = horarioService.obtenerHorariosPorTurnoAnioYFecha(turno, anio, fechaParsed);

            return Response.ok(horarios);
        } catch (Exception e) {
            logger.log(Level.SEVERE,
                    "Error al obtener horarios para turno " + turno + ", año " + anio + " y fecha " + fecha, e);
            return Response.internalServerError("Error al obtener los horarios: " + e.getMessage());
        }
    }

    /**
     * Obtiene los años disponibles para un turno y fecha específicos
     *
     * @param turno Turno para filtrar las divisiones (Mañana, Tarde,
     * Vespertino, Noche)
     * @param fecha Fecha para verificar la vigencia de cargos y designaciones
     * (formato: yyyy-MM-dd)
     * @return ResponseEntity con la lista de años disponibles
     */
    @GetMapping("/horarios/anios/{turno}/{fecha}")
    public ResponseEntity<Object> obtenerAniosDisponibles(
            @PathVariable Turno turno,
            @PathVariable String fecha) {
        try {
            // Parsear la fecha
            LocalDate fechaParsed = LocalDate.parse(fecha);

            // Obtener los años disponibles usando el servicio
            var aniosDisponibles = horarioService.obtenerAniosDisponibles(turno, fechaParsed);

            return Response.ok(aniosDisponibles);
        } catch (Exception e) {
            logger.log(Level.SEVERE,
                    "Error al obtener años disponibles para turno " + turno + " y fecha " + fecha, e);
            return Response.internalServerError("Error al obtener los años disponibles: " + e.getMessage());
        }
    }

}
