package unpsjb.labprog.backend.business.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.ArticuloLicencia;

/**
 * Repositorio para la gestión de entidades ArticuloLicencia. Proporciona
 * métodos para consultas específicas sobre artículos de licencia.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Repository
public interface ArticuloLicenciaRepository extends JpaRepository<ArticuloLicencia, Integer> {

    /**
     * Busca un artículo de licencia por su código específico.
     *
     * @param articulo Código del artículo (ej: "5A", "10B")
     * @return Optional con el artículo encontrado, vacío si no existe
     */
    Optional<ArticuloLicencia> findByArticulo(String articulo);

    /**
     * Realiza una búsqueda general por código o descripción del artículo. La
     * búsqueda es insensible a mayúsculas y permite coincidencias parciales.
     *
     * @param term Término a buscar en código o descripción
     * @return Lista de artículos que coinciden con la búsqueda
     */
    @Query("SELECT a FROM ArticuloLicencia a WHERE "
            + "UPPER(a.articulo) LIKE CONCAT('%', UPPER(?1), '%') OR "
            + "UPPER(a.descripcion) LIKE CONCAT('%', UPPER(?1), '%')")
    List<ArticuloLicencia> search(String term);
}
