package unpsjb.labprog.backend.business.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import unpsjb.labprog.backend.model.Designacion;

public interface DesignacionRepository extends JpaRepository<Designacion, Integer> {

        /**
         * Busca designaciones que se solapen con el periodo especificado para el mismo
         * cargo.
         * 
         * La consulta maneja casos donde la fecha de fin puede ser nula, lo que indica
         * un período indefinido. La función utiliza la lógica de negación de la no
         * superposición para determinar si dos períodos se solapan.
         *
         * @param cargoId       El ID del cargo a verificar
         * @param fechaInicio   Fecha de inicio del periodo a verificar
         * @param fechaFin      Fecha de fin del periodo a verificar (puede ser null
         *                      para periodos indefinidos)
         * @param designacionId ID de la designación a excluir (útil para
         *                      actualizaciones, puede ser null para nuevas)
         * @return Lista de designaciones que se solapan con el periodo especificado
         */
        @Query(value = "SELECT d FROM Designacion d WHERE d.cargo.id = :cargo " +
                        "AND (:designacionId IS NULL OR d.id != :designacionId) " +
                        "AND (" +
                        "  (d.fechaInicio <= COALESCE(:fechaFin, d.fechaInicio) " +
                        "   AND COALESCE(d.fechaFin, :fechaFin) >= :fechaInicio)" +
                        "  OR (d.fechaFin IS NULL AND CAST(:fechaFin AS java.time.LocalDateTime) IS NULL)" +
                        ")")
        List<Designacion> findDesignacionesSuperpuestas(
                        @Param("cargo") Integer cargoId,
                        @Param("fechaInicio") LocalDateTime fechaInicio,
                        @Param("fechaFin") LocalDateTime fechaFin,
                        @Param("designacionId") Integer designacionId);

        /**
         * Busca designaciones para una persona específica que se encuentran activas
         * durante
         * el período especificado por las fechas de inicio y fin.
         * 
         * La consulta considera que una designación está activa durante el período si:
         * - La fecha de inicio de la designación es anterior o igual a la fecha de fin
         * de la licencia, Y
         * - La fecha de fin de la designación es posterior o igual a la fecha de inicio
         * de la licencia, O es null (vigente)
         *
         * @param personaDni  El DNI de la persona a buscar
         * @param fechaInicio Fecha de inicio de la licencia a verificar
         * @param fechaFin    Fecha de fin de la licencia a verificar
         * @return Lista de designaciones activas para la persona durante el período
         *         especificado
         */
        @Query(value = "SELECT d FROM Designacion d WHERE d.persona.dni = :personaDni " +
                        "AND d.fechaInicio <= :fechaFin " +
                        "AND (d.fechaFin IS NULL OR d.fechaFin >= :fechaInicio)")
        List<Designacion> findDesignacionesActivasPorPersonaYPeriodo(
                        @Param("personaDni") Long personaDni,
                        @Param("fechaInicio") LocalDateTime fechaInicio,
                        @Param("fechaFin") LocalDateTime fechaFin);

        /**
         * Verifica si una persona tiene al menos una designación (cargo) en la
         * institución.
         *
         * @param personaDni El DNI de la persona a verificar
         * @return true si la persona tiene al menos una designación, false en caso
         *         contrario
         */
        @Query(value = "SELECT COUNT(d) > 0 FROM Designacion d WHERE d.persona.dni = :personaDni")
        boolean existsDesignacionesPorPersona(@Param("personaDni") Long personaDni);
}
