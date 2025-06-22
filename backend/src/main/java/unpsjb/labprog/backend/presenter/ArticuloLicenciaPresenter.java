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
 * Controlador REST para la gestión de artículos de licencia. Proporciona
 * endpoints para operaciones CRUD sobre artículos de licencia, que definen los
 * tipos de permisos y ausencias disponibles en el sistema.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@RestController
@RequestMapping("articulos-licencias")
public class ArticuloLicenciaPresenter {

    /**
     * Servicio de lógica de negocio para artículos de licencia.
     */
    @Autowired
    private ArticuloLicenciaService service;

    /**
     * Obtiene todos los artículos de licencia registrados en el sistema.
     *
     * @return respuesta con la lista completa de artículos de licencia
     */
    @GetMapping
    public ResponseEntity<Object> findAll() {
        return Response.ok(service.findAll());
    }

    /**
     * Busca un artículo de licencia por su identificador único.
     *
     * @param id identificador del artículo de licencia
     * @return respuesta con el artículo encontrado o mensaje de error
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable int id) {
        ArticuloLicencia articuloLicenciaOrNull = service.findById(id);
        return (articuloLicenciaOrNull != null) ? Response.ok(articuloLicenciaOrNull)
                : Response.notFound("Artículo de licencia con ID " + id + " no encontrado");
    }

    /**
     * Busca un artículo de licencia por su código específico.
     *
     * @param articulo código del artículo (ej: "5A")
     * @return respuesta con el artículo encontrado o mensaje de error
     */
    @GetMapping("/articulo/{articulo}")
    public ResponseEntity<Object> findByArticulo(@PathVariable String articulo) {
        ArticuloLicencia articuloLicenciaOrNull = service.findByArticulo(articulo);
        return (articuloLicenciaOrNull != null) ? Response.ok(articuloLicenciaOrNull)
                : Response.notFound("Licencia con artículo " + articulo + " no encontrada");
    }

    /**
     * Crea un nuevo artículo de licencia en el sistema.
     *
     * @param aArticuloLicencia datos del artículo de licencia a crear
     * @return respuesta con mensaje de éxito o error
     */
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody ArticuloLicencia aArticuloLicencia) {
        try {
            ArticuloLicencia createdArticuloLicencia = service.save(aArticuloLicencia);

            String mensaje = String.format(
                    "Artículo de licencia %s creado correctamente",
                    createdArticuloLicencia.getArticulo());

            return Response.ok(null, mensaje);
        } catch (DataIntegrityViolationException e) {
            return Response.dbError("No se puede crear el articulo de licencia debido a que ya existe otra idéntica");
        }
    }

    /**
     * Actualiza un artículo de licencia existente en el sistema.
     *
     * @param aArticuloLicencia datos actualizados del artículo de licencia
     * @return respuesta con mensaje de éxito o error
     */
    @PutMapping
    public ResponseEntity<Object> update(@RequestBody ArticuloLicencia aArticuloLicencia) {
        ArticuloLicencia existingArticuloLicencia = service.findById(aArticuloLicencia.getId());
        if (existingArticuloLicencia == null) {
            return Response.notFound(
                    "Artículo de licencia con ID " + aArticuloLicencia.getId() + " no encontrada para actualizar");
        }

        try {
            ArticuloLicencia updatedArticuloLicencia = service.save(aArticuloLicencia);

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
     * Elimina un artículo de licencia del sistema.
     *
     * @param id identificador del artículo de licencia a eliminar
     * @return respuesta con mensaje de éxito o error
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

    /**
     * Busca artículos de licencia que coincidan con un término de búsqueda.
     *
     * @param term término de búsqueda
     * @return respuesta con la lista de artículos que coinciden con el término
     */
    @GetMapping("/search/{term}")
    public ResponseEntity<Object> search(@PathVariable String term) {
        return Response.ok(service.search(term));
    }

}
