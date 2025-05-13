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
                        "  (d.fechaInicio <= COALESCE(:fechaFin, CAST('9999-12-31' as java.time.LocalDateTime))) " +
                        "  AND " +
                        "  (COALESCE(d.fechaFin, CAST('9999-12-31' as java.time.LocalDateTime)) >= :fechaInicio)" +
                        ")")
        List<Designacion> findDesignacionesSuperpuestas(
                        @Param("cargo") Integer cargoId,
                        @Param("fechaInicio") LocalDateTime fechaInicio,
                        @Param("fechaFin") LocalDateTime fechaFin,
                        @Param("designacionId") Integer designacionId);
}
