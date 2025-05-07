package unpsjb.labprog.backend.business.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Persona;

/**
 * Repositorio para la entidad Persona
 * Proporciona métodos para acceder y manipular los datos de las personas
 */
@Repository
public interface PersonaRepository extends JpaRepository<Persona, Integer> {

    /**
     * Busca una persona por su DNI
     * 
     * @param dni DNI de la persona a buscar
     * @return Persona encontrada o null si no existe
     */
    Optional<Persona> findByDni(long dni);

    /**
     * Busca una persona por su CUIL
     * 
     * @param cuil CUIL de la persona a buscar
     * @return Persona encontrada o null si no existe
     */
    Optional<Persona> findByCuil(String cuil);

    /**
     * Busca una persona por su DNI, nombre o apellido
     * 
     * @param term Cadena a buscar en DNI, nombre o apellido
     * @return Personas que coinciden con la búsqueda
     */
    @Query("SELECT e FROM Persona e WHERE " +
            "CAST(e.dni AS string) LIKE CONCAT('%', ?1, '%') OR " +
            "UPPER(e.nombre) LIKE CONCAT('%', UPPER(?1), '%') OR " +
            "UPPER(e.apellido) LIKE CONCAT('%', UPPER(?1), '%')")
    List<Persona> search(String term);
}