package unpsjb.labprog.backend.business.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.business.repository.ArticuloLicenciaRepository;
import unpsjb.labprog.backend.model.ArticuloLicencia;

/**
 * Servicio que implementa la lógica de negocio para la entidad ArticuloLicencia
 * 
 * @see ArticuloLicencia
 */
@Service
public class ArticuloLicenciaService {

    @Autowired
    private ArticuloLicenciaRepository repository;

    /**
     * Busca todas las licencias registradas
     * 
     * @return Lista de todas las licencias
     */
    public List<ArticuloLicencia> findAll() {
        return repository.findAll();
    }

    /**
     * Busca un artículo de licencia por su ID
     * 
     * @param id ID del artículo de licencia
     * @return Artículo de licencia encontrado o null si no existe
     */
    public ArticuloLicencia findById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Busca un artículo de licencia por su código
     * 
     * @param articulo Código del artículo (ej: "5A")
     * @return Artículo de licencia encontrado o null si no existe
     */
    public ArticuloLicencia findByArticulo(String articulo) {
        return repository.findByArticulo(articulo).orElse(null);
    }

    /**
     * Guarda un artículo de licencia
     * 
     * @param articuloLicencia Artículo de licencia a guardar
     * @return Artículo de licencia guardado
     */
    @Transactional
    public ArticuloLicencia save(ArticuloLicencia articuloLicencia) {
        return repository.save(articuloLicencia);
    }

    /**
     * Elimina un artículo de licencia por su id
     * 
     * @param id id del artículo de licencia a eliminar
     */
    @Transactional
    public void delete(int id) {
        repository.deleteById(id);
    }

    /**
     * Busca articulos de licencia por un término de búsqueda.
     * 
     * @param term el término de búsqueda
     * @return una lista de articulos de licencia que coinciden con el término de
     *         búsqueda
     */
    public List<ArticuloLicencia> search(String term) {
        return repository.search("%" + term.toUpperCase() + "%");
    }

}
