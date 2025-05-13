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
         * Asume que fechaInicio y fechaFin nunca son nulos, es decir, siempre se
         * especifica un período completo. La consulta está simplificada para verificar
         * solo los casos donde hay solapamiento real entre períodos.
         *
         * @param cargoId       El ID del cargo a verificar
         * @param fechaInicio   Fecha de inicio del periodo a verificar
         * @param fechaFin      Fecha de fin del periodo a verificar
         * @param designacionId ID de la designación a excluir (útil para
         *                      actualizaciones, puede ser null para nuevas)
         * @return Lista de designaciones que se solapan con el periodo especificado
         */
        @Query(value = "SELECT d FROM Designacion d WHERE d.cargo.id = :cargo " +
                        "AND (:designacionId IS NULL OR d.id != :designacionId) " +
                        "AND NOT (" +
                        "  (:fechaFin < d.fechaInicio) OR " +
                        "  (:fechaInicio > d.fechaFin)" +
                        ")")
        List<Designacion> findDesignacionesSuperpuestas(
                        @Param("cargo") Integer cargoId,
                        @Param("fechaInicio") LocalDateTime fechaInicio,
                        @Param("fechaFin") LocalDateTime fechaFin,
                        @Param("designacionId") Integer designacionId);
}
