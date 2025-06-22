package unpsjb.labprog.backend.business.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import unpsjb.labprog.backend.model.Designacion;

/**
 * Repositorio para la gestión de entidades Designacion. Proporciona métodos
 * para consultas específicas sobre designaciones.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public interface DesignacionRepository extends JpaRepository<Designacion, Integer> {

    /**
     * Busca designaciones que se solapen con el período especificado para el
     * mismo cargo. Maneja casos donde la fecha de fin puede ser nula (período
     * indefinido).
     *
     * @param cargoId ID del cargo a verificar
     * @param fechaInicio Fecha de inicio del período
     * @param fechaFin Fecha de fin del período (null para períodos indefinidos)
     * @param designacionId ID de designación a excluir (null para nuevas
     * designaciones)
     * @return Lista de designaciones que se solapan con el período
     */
    @Query(value = "SELECT d FROM Designacion d WHERE d.cargo.id = :cargo "
            + "AND (:designacionId IS NULL OR d.id != :designacionId) "
            + "AND ("
            + "  (d.fechaInicio <= COALESCE(:fechaFin, d.fechaInicio) "
            + "   AND COALESCE(d.fechaFin, :fechaFin) >= :fechaInicio)"
            + "  OR (d.fechaFin IS NULL AND CAST(:fechaFin AS java.time.LocalDate) IS NULL)"
            + ")")
    List<Designacion> findDesignacionesSuperpuestas(
            @Param("cargo") Integer cargoId,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin,
            @Param("designacionId") Integer designacionId);

    /**
     * Busca designaciones de una persona que contengan completamente el período
     * especificado. Útil para validar que una persona tenga cargo activo
     * durante toda una licencia.
     *
     * @param personaDni DNI de la persona
     * @param fechaInicio Fecha de inicio del período a verificar
     * @param fechaFin Fecha de fin del período a verificar
     * @return Lista de designaciones que contienen el período completo
     */
    @Query(value = "SELECT d FROM Designacion d WHERE d.persona.dni = :personaDni "
            + "AND d.fechaInicio <= :fechaInicio "
            + "AND (d.fechaFin IS NULL OR d.fechaFin >= :fechaFin)")
    List<Designacion> findDesignacionesActivasPorPersonaYPeriodo(
            @Param("personaDni") Long personaDni,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin);

    /**
     * Verifica si una persona tiene al menos una designación en la institución.
     *
     * @param personaDni DNI de la persona a verificar
     * @return true si tiene al menos una designación, false en caso contrario
     */
    @Query(value = "SELECT COUNT(d) > 0 FROM Designacion d WHERE d.persona.dni = :personaDni")
    boolean existsDesignacionesPorPersona(@Param("personaDni") Long personaDni);

    /**
     * Busca designaciones que contengan completamente el período especificado
     * para un cargo. Útil para verificar cobertura completa de un período.
     *
     * @param cargoId ID del cargo
     * @param fechaInicio Fecha de inicio del período
     * @param fechaFin Fecha de fin del período
     * @param designacionId ID de designación a excluir (null para nuevas
     * designaciones)
     * @return Lista de designaciones que contienen el período completo
     */
    @Query(value = "SELECT d FROM Designacion d WHERE d.cargo.id = :cargo "
            + "AND (:designacionId IS NULL OR d.id != :designacionId) "
            + "AND d.fechaInicio <= :fechaInicio "
            + "AND (d.fechaFin IS NULL OR (CAST(:fechaFin AS java.time.LocalDate) IS NOT NULL AND d.fechaFin >= :fechaFin))")
    List<Designacion> findDesignacionesContenedoras(
            @Param("cargo") Integer cargoId,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin,
            @Param("designacionId") Integer designacionId);

    /**
     * Busca designaciones activas para un cargo en una fecha específica.
     *
     * @param cargoId ID del cargo
     * @param fecha Fecha para verificar la designación activa
     * @return Lista de designaciones activas en esa fecha
     */
    @Query(value = "SELECT d FROM Designacion d WHERE d.cargo.id = :cargoId "
            + "AND d.fechaInicio <= :fecha "
            + "AND (d.fechaFin IS NULL OR d.fechaFin >= :fecha)")
    List<Designacion> findDesignacionActivaPorCargoYFecha(
            @Param("cargoId") Integer cargoId,
            @Param("fecha") LocalDate fecha);
}
