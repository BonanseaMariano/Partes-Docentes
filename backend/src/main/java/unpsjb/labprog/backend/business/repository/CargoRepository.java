package unpsjb.labprog.backend.business.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.enums.TipoDesignacion;
import unpsjb.labprog.backend.model.enums.Turno;

/**
 * Repositorio para la entidad Cargo Proporciona métodos para acceder y
 * manipular los datos de los cargos
 */
@Repository
public interface CargoRepository extends JpaRepository<Cargo, Integer> {

    /**
     * Busca un cargo por cualquiera de sus campos o por los campos de la
     * División asociada
     *
     * @param term Cadena a buscar en los campos del cargo o de su división
     * asociada
     * @return Cargos que coinciden con la búsqueda
     */
    @Query("SELECT c FROM Cargo c LEFT JOIN c.division d WHERE "
            + "UPPER(c.nombre) LIKE CONCAT('%', UPPER(?1), '%') OR "
            + "CAST(c.cargaHoraria AS string) LIKE ?1 OR "
            + "UPPER(c.tipoDesignacion) LIKE CONCAT('%', UPPER(?1), '%') OR "
            + "(d IS NOT NULL AND ("
            + "CAST(d.anio AS string) LIKE ?1 OR "
            + "CAST(d.numDivision AS string) LIKE ?1 OR "
            + "UPPER(d.orientacion) LIKE CONCAT('%', UPPER(?1), '%') OR "
            + "UPPER(d.turno) LIKE CONCAT('%', UPPER(?1), '%')))")
    List<Cargo> search(String term);

    /**
     * Busca un cargo por nombre, tipo designación y, opcionalmente, por los
     * atributos de la división (año, número y turno).
     *
     * @param nombre Nombre del cargo a buscar
     * @param tipoDesignacion Tipo de designación del cargo a buscar
     * @param anio Año de la división (opcional)
     * @param numDivision Número de la división (opcional)
     * @param turno Turno de la división (opcional)
     * @return Un cargo que coincida con los criterios de búsqueda o vacío si no
     * se encuentra
     */
    @Query("SELECT c FROM Cargo c LEFT JOIN c.division d "
            + "WHERE c.nombre = :nombre AND c.tipoDesignacion = :tipoDesignacion "
            + "AND (:anio IS NULL OR d.anio = :anio) "
            + "AND (:numDivision IS NULL OR d.numDivision = :numDivision) "
            + "AND (:turno IS NULL OR d.turno = :turno)")
    Optional<Cargo> findByNombreAndTipoDesignacionAndDivision(
            @Param("nombre") String nombre,
            @Param("tipoDesignacion") TipoDesignacion tipoDesignacion,
            @Param("anio") Integer anio,
            @Param("numDivision") Integer numDivision,
            @Param("turno") Turno turno);

    /**
     * Busca cargos de tipo ESPACIO_CURRICULAR con división de un turno
     * específico que estén vigentes en una fecha determinada
     *
     * @param turno Turno de la división
     * @param fecha Fecha para verificar vigencia del cargo
     * @return Lista de cargos que cumplen los criterios
     */
    @Query("SELECT c FROM Cargo c JOIN c.division d "
            + "WHERE c.tipoDesignacion = 'ESPACIO_CURRICULAR' "
            + "AND d.turno = :turno "
            + "AND (c.fechaInicio IS NULL OR DATE(c.fechaInicio) <= :fecha) "
            + "AND (c.fechaFin IS NULL OR DATE(c.fechaFin) >= :fecha)")
    List<Cargo> findEspaciosCurricularesByTurnoAndFechaVigente(
            @Param("turno") Turno turno,
            @Param("fecha") java.time.LocalDate fecha);

}
