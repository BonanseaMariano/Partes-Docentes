package unpsjb.labprog.backend.business.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import unpsjb.labprog.backend.model.Licencia;

public interface LicenciaRepository extends JpaRepository<Licencia, Integer> {

    /**
     * Busca licencias que se solapen con el periodo especificado para la misma
     * persona.
     * 
     * La consulta verifica si hay solapamiento entre dos períodos, es decir,
     * si la fecha de inicio de una licencia es menor o igual a la fecha de fin de
     * otra,
     * y la fecha de fin de una licencia es mayor o igual a la fecha de inicio de
     * otra.
     *
     * @param personaDni  El DNI de la persona a verificar
     * @param pedidoDesde Fecha de inicio del periodo a verificar
     * @param pedidoHasta Fecha de fin del periodo a verificar
     * @param licenciaId  ID de la licencia a excluir (útil para actualizaciones,
     *                    puede ser null para nuevas)
     * @return Lista de licencias que se solapan con el periodo especificado
     */
    @Query(value = "SELECT l FROM Licencia l WHERE l.persona.dni = :personaDni " +
            "AND (:licenciaId IS NULL OR l.id != :licenciaId) " +
            "AND (l.pedidoDesde <= :pedidoHasta AND l.pedidoHasta >= :pedidoDesde)")
    List<Licencia> findLicenciasSuperPuestas(
            @Param("personaDni") Long personaDni,
            @Param("pedidoDesde") LocalDateTime pedidoDesde,
            @Param("pedidoHasta") LocalDateTime pedidoHasta,
            @Param("licenciaId") Integer licenciaId);
}
