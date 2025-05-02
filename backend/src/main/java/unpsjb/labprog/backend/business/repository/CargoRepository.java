package unpsjb.labprog.backend.business.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * Repositorio para la entidad Cargo
 * Proporciona métodos para acceder y manipular los datos de los cargos
 */
@Repository
public interface CargoRepository extends JpaRepository<Cargo, Integer> {
    /**
     * Busca un cargo por su nombre
     * 
     * @param term Cadena a buscar en el nombre
     * @return Cargos que coinciden con la búsqueda
     */
    @Query("SELECT e FROM Cargo e WHERE UPPER(e.nombre) LIKE ?1")
    List<Cargo> search(String term);

    /**
     * Busca un cargo por su nombre y tipo de designación
     * 
     * @param nombre          Nombre del cargo a buscar
     * @param tipoDesignacion Tipo de designación del cargo a buscar
     * @return Cargo encontrado o null si no existe
     */
    Optional<Cargo> findByNombreAndTipoDesignacion(String nombre, TipoDesignacion tipoDesignacion);

}
