package unpsjb.labprog.backend.business.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
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
}