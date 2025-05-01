package unpsjb.labprog.backend.business.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Cargo;

/**
 * Repositorio para la entidad Cargo
 * Proporciona métodos para acceder y manipular los datos de los cargos
 */
@Repository
public interface CargoRepository extends JpaRepository<Cargo, Integer> {

}
