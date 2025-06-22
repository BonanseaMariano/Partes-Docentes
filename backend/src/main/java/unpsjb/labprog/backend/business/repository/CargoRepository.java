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
 * Repositorio para la gestión de entidades Cargo. Proporciona métodos para
 * consultas específicas sobre cargos.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Repository
public interface CargoRepository extends JpaRepository<Cargo, Integer> {

    /**
     * Realiza una búsqueda general por campos del cargo y de su división
     * asociada. Busca en nombre, carga horaria, tipo de designación y datos de
     * la división.
     *
     * @param term Término a buscar en los campos del cargo o división
     * @return Lista de cargos que coinciden con la búsqueda
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
     * Busca un cargo específico por nombre, tipo de designación y datos de
     * división. Los parámetros de división son opcionales (pueden ser null).
     *
     * @param nombre Nombre del cargo
     * @param tipoDesignacion Tipo de designación del cargo
     * @param anio Año de la división (opcional)
     * @param numDivision Número de la división (opcional)
     * @param turno Turno de la división (opcional)
     * @return Optional con el cargo encontrado, vacío si no existe
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
     * Busca espacios curriculares de un turno específico que estén vigentes en
     * una fecha.
     *
     * @param turno Turno de la división
     * @param fecha Fecha para verificar vigencia
     * @return Lista de espacios curriculares vigentes
     */
    @Query("SELECT c FROM Cargo c JOIN c.division d "
            + "WHERE c.tipoDesignacion = 'ESPACIO_CURRICULAR' "
            + "AND d.turno = :turno "
            + "AND (c.fechaInicio IS NULL OR DATE(c.fechaInicio) <= :fecha) "
            + "AND (c.fechaFin IS NULL OR DATE(c.fechaFin) >= :fecha)")
    List<Cargo> findEspaciosCurricularesByTurnoAndFechaVigente(
            @Param("turno") Turno turno,
            @Param("fecha") java.time.LocalDate fecha);

    /**
     * Busca espacios curriculares de un turno y año específicos que estén
     * vigentes en una fecha.
     *
     * @param turno Turno de la división
     * @param anio Año de la división
     * @param fecha Fecha para verificar vigencia
     * @return Lista de espacios curriculares vigentes
     */
    @Query("SELECT c FROM Cargo c JOIN c.division d "
            + "WHERE c.tipoDesignacion = 'ESPACIO_CURRICULAR' "
            + "AND d.turno = :turno "
            + "AND d.anio = :anio "
            + "AND (c.fechaInicio IS NULL OR DATE(c.fechaInicio) <= :fecha) "
            + "AND (c.fechaFin IS NULL OR DATE(c.fechaFin) >= :fecha)")
    List<Cargo> findEspaciosCurricularesByTurnoAndAnioAndFechaVigente(
            @Param("turno") Turno turno,
            @Param("anio") Integer anio,
            @Param("fecha") java.time.LocalDate fecha);

    /**
     * Obtiene los años únicos de divisiones con espacios curriculares vigentes
     * para un turno. Útil para filtrar años disponibles en interfaces de
     * usuario.
     *
     * @param turno Turno de la división
     * @param fecha Fecha para verificar vigencia
     * @return Lista de años únicos ordenados
     */
    @Query("SELECT DISTINCT d.anio FROM Cargo c JOIN c.division d "
            + "WHERE c.tipoDesignacion = 'ESPACIO_CURRICULAR' "
            + "AND d.turno = :turno "
            + "AND (c.fechaInicio IS NULL OR DATE(c.fechaInicio) <= :fecha) "
            + "AND (c.fechaFin IS NULL OR DATE(c.fechaFin) >= :fecha) "
            + "ORDER BY d.anio")
    List<Integer> findAniosDisponiblesByTurnoAndFechaVigente(
            @Param("turno") Turno turno,
            @Param("fecha") java.time.LocalDate fecha);

}
