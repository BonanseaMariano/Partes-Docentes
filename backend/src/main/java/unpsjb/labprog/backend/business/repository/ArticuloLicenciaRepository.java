package unpsjb.labprog.backend.business.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.ArticuloLicencia;

@Repository
public interface ArticuloLicenciaRepository extends JpaRepository<ArticuloLicencia, Integer> {

    /**
     * Busca un artículo de licencia por su código
     * 
     * @param articulo El código del artículo (ej: "5A")
     * @return El artículo encontrado o vacío si no existe
     */
    Optional<ArticuloLicencia> findByArticulo(String articulo);

    /**
     * Busca artículos de licencia por su código o descripción
     * 
     * @param term Término de búsqueda que se aplicará tanto al campo articulo como
     *             al campo descripción
     * @return Lista de artículos de licencia que coinciden con el término de
     *         búsqueda
     */
    @Query("SELECT a FROM ArticuloLicencia a WHERE " +
            "UPPER(a.articulo) LIKE CONCAT('%', UPPER(?1), '%') OR " +
            "UPPER(a.descripcion) LIKE CONCAT('%', UPPER(?1), '%')")
    List<ArticuloLicencia> search(String term);
}
