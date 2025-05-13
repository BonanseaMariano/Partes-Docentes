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
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.service.ArticuloLicenciaService;
import unpsjb.labprog.backend.model.ArticuloLicencia;

/**
 * Controlador REST para la gestión de artículos de licencia en el sistema
 * educativo.
 * Proporciona endpoints para crear, consultar, actualizar y eliminar artículos
 * de
 * licencia.
 * Los artículos de licencia representan permisos o ausencias de personal dentro
 * de la institución educativa.
 * 
 * @see ArticuloLicencia
 */
@RestController
@RequestMapping("articulos-licencias")
public class ArticuloLicenciaPresenter {

    /**
     * Servicio que implementa la lógica de negocio para las operaciones con
     * articulos-licencias.
     */
    @Autowired
    private ArticuloLicenciaService service;

    /**
     * Obtiene todas las licencias registradas en el sistema.
     * 
     * @return ResponseEntity con la lista completa de licencias si la operación
     *         es exitosa
     */
    @GetMapping
    public ResponseEntity<Object> findAll() {
        return Response.ok(service.findAll());
    }

    /**
     * Busca un articuloLicencia específica por su identificador único.
     * 
     * @param id Identificador único de la licencia a buscar
     * @return ResponseEntity con la licencia encontrada o un mensaje de error si
     *         no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable int id) {
        ArticuloLicencia articuloLicenciaOrNull = service.findById(id);
        return (articuloLicenciaOrNull != null) ? Response.ok(articuloLicenciaOrNull)
                : Response.notFound("Artículo de licencia con ID " + id + " no encontrado");
    }

    /**
     * Busca un articulo de licencia específico por su código.
     * 
     * @param articulo Código del artículo (ej: "5A")
     * @return ResponseEntity con la licencia encontrada o un mensaje de error si
     *         no existe
     */
    @GetMapping("/articulo/{articulo}")
    public ResponseEntity<Object> findByArticulo(@PathVariable String articulo) {
        ArticuloLicencia articuloLicenciaOrNull = service.findByArticulo(articulo);
        return (articuloLicenciaOrNull != null) ? Response.ok(articuloLicenciaOrNull)
                : Response.notFound("Licencia con artículo " + articulo + " no encontrada");
    }

    /**
     * Crea una nuevo articulo de licencia en el sistema.
     * 
     * @param aArticuloLicencia Objeto articulo de licencia con los datos a
     *                          registrar
     * @return ResponseEntity con un mensaje de éxito si la operación es correcta o
     *         error en caso contrario
     */
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody ArticuloLicencia aArticuloLicencia) {
        try {
            ArticuloLicencia createdArticuloLicencia = service.save(aArticuloLicencia);

            // Formatear el mensaje
            String mensaje = String.format(
                    "Artículo de licencia %s creado correctamente",
                    createdArticuloLicencia.getArticulo());

            return Response.ok(null, mensaje);
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede crear el articulo de licencia debido a que ya existe otra idéntica");
        }
    }

    /**
     * Actualiza un articulo de licencia existente en el sistema.
     * 
     * @param aArticuloLicencia Objeto Articulo de licencia con los datos
     *                          actualizados
     * @return ResponseEntity con un mensaje de éxito si la operación es correcta o
     *         error en caso contrario
     */
    @PutMapping
    public ResponseEntity<Object> update(@RequestBody ArticuloLicencia aArticuloLicencia) {
        // Verificar si la el articulo de licencia existe
        ArticuloLicencia existingArticuloLicencia = service.findById(aArticuloLicencia.getId());
        if (existingArticuloLicencia == null) {
            return Response.notFound(
                    "Artículo de licencia con ID " + aArticuloLicencia.getId() + " no encontrada para actualizar");
        }

        try {
            ArticuloLicencia updatedArticuloLicencia = service.save(aArticuloLicencia);

            // Formatear el mensaje
            String mensaje = String.format(
                    "Artículo de licencia %s creado correctamente",
                    updatedArticuloLicencia.getArticulo());

            return Response.ok(null, mensaje);
        } catch (DataIntegrityViolationException e) {
            return Response
                    .dbError("No se puede actualizar el artículo de licencia debido a que ya existe otro idéntico");
        }
    }

    /**
     * Elimina una artículo de licencia existente según su ID.
     * 
     * @param id Identificador único de la artículo de licencia a eliminar
     * @return ResponseEntity con un mensaje de éxito si la operación es correcta o
     *         error en caso contrario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable int id) {
        ArticuloLicencia deletedArticuloLicencia = service.findById(id);
        if (deletedArticuloLicencia == null) {
            return Response.notFound("Designación con ID " + id + " no encontrada para eliminar");
        }

        try {
            service.delete(id);
            String mensaje = String.format(
                    "Artículo de licencia %s eliminado correctamente",
                    deletedArticuloLicencia.getArticulo());

            return Response.ok(null, mensaje);
        } catch (Exception e) {
            return Response.dbError("No se puede eliminar el articulo de licencia debido a dependencias existentes");
        }
    }

}
