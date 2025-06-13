package unpsjb.labprog.backend.business.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import unpsjb.labprog.backend.model.Licencia;
import unpsjb.labprog.backend.model.Persona;

public interface LicenciaRepository extends JpaRepository<Licencia, Integer> {

    /**
     * Busca licencias VÁLIDAS que se solapen con el periodo especificado para
     * la misma persona.
     *
     * La consulta verifica si hay solapamiento entre dos períodos, es decir, si
     * la fecha de inicio de una licencia es menor o igual a la fecha de fin de
     * otra, y la fecha de fin de una licencia es mayor o igual a la fecha de
     * inicio de otra.
     *
     * @param personaDni El DNI de la persona a verificar
     * @param pedidoDesde Fecha de inicio del periodo a verificar
     * @param pedidoHasta Fecha de fin del periodo a verificar
     * @param licenciaId ID de la licencia a excluir (útil para actualizaciones,
     * puede ser null para nuevas)
     * @return Lista de licencias que se solapan con el periodo especificado
     */
    @Query(value = "SELECT l FROM Licencia l WHERE l.persona.dni = :personaDni "
            + "AND (:licenciaId IS NULL OR l.id != :licenciaId) "
            + "AND (l.pedidoDesde <= :pedidoHasta AND l.pedidoHasta >= :pedidoDesde) "
            + "AND l.estado = unpsjb.labprog.backend.model.enums.Estado.VALIDO")
    List<Licencia> findLicenciasSuperPuestas(
            @Param("personaDni") Long personaDni,
            @Param("pedidoDesde") LocalDateTime pedidoDesde,
            @Param("pedidoHasta") LocalDateTime pedidoHasta,
            @Param("licenciaId") Integer licenciaId);

    /**
     * Busca licencias VÁLIDAS para una persona por artículo y año
     *
     * @param personaDni El DNI de la persona
     * @param articuloCode El código del artículo de licencia
     * @param anio El año a consultar
     * @param licenciaId ID de licencia a excluir (para actualizaciones)
     * @return Lista de licencias que cumplen con los criterios
     */
    @Query("SELECT l FROM Licencia l WHERE l.persona.dni = :personaDni "
            + "AND l.articuloLicencia.articulo = :articuloCode "
            + "AND EXTRACT(YEAR FROM l.pedidoDesde) = :anio "
            + "AND (:licenciaId IS NULL OR l.id != :licenciaId) "
            + "AND l.estado = unpsjb.labprog.backend.model.enums.Estado.VALIDO")
    List<Licencia> findLicenciasPorPersonaArticuloYAnio(
            @Param("personaDni") Long personaDni,
            @Param("articuloCode") String articuloCode,
            @Param("anio") Integer anio,
            @Param("licenciaId") Integer licenciaId);

    /**
     * Busca licencias VÁLIDAS para una persona por artículo, año y mes
     *
     * @param personaDni El DNI de la persona
     * @param articuloCode El código del artículo de licencia
     * @param anio El año a consultar
     * @param mes El mes a consultar (1-12)
     * @param licenciaId ID de licencia a excluir (para actualizaciones)
     * @return Lista de licencias que cumplen con los criterios
     */
    @Query("SELECT l FROM Licencia l WHERE l.persona.dni = :personaDni "
            + "AND l.articuloLicencia.articulo = :articuloCode "
            + "AND EXTRACT(YEAR FROM l.pedidoDesde) = :anio "
            + "AND EXTRACT(MONTH FROM l.pedidoDesde) = :mes "
            + "AND (:licenciaId IS NULL OR l.id != :licenciaId) "
            + "AND l.estado = unpsjb.labprog.backend.model.enums.Estado.VALIDO")
    List<Licencia> findLicenciasPorPersonaArticuloYMes(
            @Param("personaDni") Long personaDni,
            @Param("articuloCode") String articuloCode,
            @Param("anio") Integer anio,
            @Param("mes") Integer mes,
            @Param("licenciaId") Integer licenciaId);

    /**
     * Busca licencias VÁLIDAS para una persona en un periodo específico
     *
     * @param persona La persona asociada a las licencias
     * @param pedidoDesde Fecha desde la cual buscar licencias
     * @param pedidoHasta Fecha hasta la cual buscar licencias
     * @return Lista de licencias que corresponden a la persona y período
     * especificado
     */
    @Query("SELECT l FROM Licencia l WHERE l.persona = :persona "
            + "AND l.pedidoDesde >= :pedidoDesde "
            + "AND l.pedidoHasta <= :pedidoHasta "
            + "AND l.estado = unpsjb.labprog.backend.model.enums.Estado.VALIDO")
    List<Licencia> findValidLicenciasByPersonaAndPeriod(
            @Param("persona") Persona persona,
            @Param("pedidoDesde") LocalDateTime pedidoDesde,
            @Param("pedidoHasta") LocalDateTime pedidoHasta);

    /**
     * Método original mantenido para compatibilidad
     */
    List<Licencia> findByPersonaAndPedidoDesdeGreaterThanEqualAndPedidoHastaLessThanEqual(
            Persona persona,
            LocalDateTime pedidoDesde,
            LocalDateTime pedidoHasta);

    /**
     * Busca licencias VÁLIDAS que estén activas en una fecha específica
     *
     * @param fecha La fecha a consultar (inicio del día)
     * @param fechaFin La fecha a consultar (fin del día)
     * @return Lista de licencias válidas activas en esa fecha
     */
    @Query("SELECT l FROM Licencia l WHERE l.estado = unpsjb.labprog.backend.model.enums.Estado.VALIDO "
            + "AND l.pedidoDesde <= :fechaFin "
            + "AND l.pedidoHasta >= :fecha "
            + "ORDER BY l.persona.apellido, l.persona.nombre")
    List<Licencia> findLicenciasValidasEnFecha(
            @Param("fecha") LocalDateTime fecha,
            @Param("fechaFin") LocalDateTime fechaFin);

    /**
     * Verifica si existen licencias que cubran completamente un período específico.
     * Busca licencias ordenadas por fecha y verifica si forman una cobertura continua.
     *
     * @param personaDni El DNI de la persona a verificar
     * @param fechaInicio Fecha de inicio del período a cubrir
     * @param fechaFin Fecha de fin del período a cubrir
     * @return Lista de licencias ordenadas que se solapan con el período
     */
    @Query("SELECT l FROM Licencia l WHERE l.persona.dni = :personaDni "
            + "AND l.estado = unpsjb.labprog.backend.model.enums.Estado.VALIDO "
            + "AND l.pedidoDesde <= :fechaFin "
            + "AND l.pedidoHasta >= :fechaInicio "
            + "ORDER BY l.pedidoDesde")
    List<Licencia> findLicenciasParaCoberturaContinua(
            @Param("personaDni") Long personaDni,
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin);

    /**
     * Busca licencias VÁLIDAS para una persona en un año específico para
     * reporte
     *
     * @param persona La persona asociada a las licencias
     * @param anio El año a consultar
     * @return Lista de licencias válidas de la persona en el año especificado
     */
    @Query("SELECT l FROM Licencia l WHERE l.persona = :persona "
            + "AND EXTRACT(YEAR FROM l.pedidoDesde) = :anio "
            + "AND l.estado = unpsjb.labprog.backend.model.enums.Estado.VALIDO "
            + "ORDER BY l.pedidoDesde")
    List<Licencia> findLicenciasPorPersonaYAño(
            @Param("persona") Persona persona,
            @Param("anio") Integer anio);
}
