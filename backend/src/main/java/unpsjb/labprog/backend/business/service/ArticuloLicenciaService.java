package unpsjb.labprog.backend.business.service;

import java.util.List;
import java.util.Optional;

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
     * Busca un artículo de licencia por su código o lo crea si no existe
     * 
     * @param articulo    Código del artículo (ej: "5A")
     * @param descripcion Descripción del artículo (usado solo si se crea nuevo)
     * @return Artículo de licencia encontrado o creado
     */
    @Transactional
    public ArticuloLicencia findOrCreate(String articulo, String descripcion) {
        Optional<ArticuloLicencia> existente = repository.findByArticulo(articulo);

        if (existente.isPresent()) {
            return existente.get();
        } else {
            ArticuloLicencia nuevo = new ArticuloLicencia();
            nuevo.setArticulo(articulo);
            nuevo.setDescripcion(descripcion);
            return repository.save(nuevo);
        }
    }

    /**
     * Obtiene todos los artículos de licencia
     * 
     * @return Lista de todos los artículos de licencia
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
}
