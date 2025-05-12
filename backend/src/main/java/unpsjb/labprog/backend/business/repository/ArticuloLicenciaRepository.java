package unpsjb.labprog.backend.business.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
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
}
