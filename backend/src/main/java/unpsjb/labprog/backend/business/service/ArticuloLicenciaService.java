package unpsjb.labprog.backend.business.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.business.repository.ArticuloLicenciaRepository;
import unpsjb.labprog.backend.model.ArticuloLicencia;

/**
 * Servicio para la gestión de entidades ArticuloLicencia. Implementa la lógica
 * de negocio para operaciones con artículos de licencia.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Service
public class ArticuloLicenciaService {

    @Autowired
    private ArticuloLicenciaRepository repository;

    /**
     * Obtiene todos los artículos de licencia registrados.
     *
     * @return Lista de todos los artículos de licencia
     */
    public List<ArticuloLicencia> findAll() {
        return repository.findAll();
    }

    /**
     * Busca un artículo de licencia por su ID.
     *
     * @param id ID del artículo de licencia
     * @return Artículo de licencia encontrado o null si no existe
     */
    public ArticuloLicencia findById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Busca un artículo de licencia por su código específico.
     *
     * @param articulo Código del artículo (ej: "5A", "10B")
     * @return Artículo de licencia encontrado o null si no existe
     */
    public ArticuloLicencia findByArticulo(String articulo) {
        return repository.findByArticulo(articulo).orElse(null);
    }

    /**
     * Guarda un nuevo artículo de licencia o actualiza uno existente.
     *
     * @param articuloLicencia Artículo de licencia a guardar
     * @return Artículo de licencia guardado
     */
    @Transactional
    public ArticuloLicencia save(ArticuloLicencia articuloLicencia) {
        return repository.save(articuloLicencia);
    }

    /**
     * Elimina un artículo de licencia por su ID.
     *
     * @param id ID del artículo de licencia a eliminar
     */
    @Transactional
    public void delete(int id) {
        repository.deleteById(id);
    }

    /**
     * Busca artículos de licencia por un término de búsqueda general.
     *
     * @param term Término de búsqueda
     * @return Lista de artículos de licencia que coinciden con el término
     */
    public List<ArticuloLicencia> search(String term) {
        return repository.search("%" + term.toUpperCase() + "%");
    }

}
