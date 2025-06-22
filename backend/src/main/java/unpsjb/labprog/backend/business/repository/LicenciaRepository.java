package unpsjb.labprog.backend.business.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import unpsjb.labprog.backend.model.Licencia;
import unpsjb.labprog.backend.model.Persona;

/**
 * Repositorio para la gestión de entidades Licencia. Proporciona métodos para
 * consultas específicas sobre licencias.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public interface LicenciaRepository extends JpaRepository<Licencia, Integer> {

    /**
     * Busca licencias válidas que se solapen con el período especificado. Útil
     * para detectar conflictos de fechas entre licencias de la misma persona.
     *
     * @param personaDni DNI de la persona
     * @param pedidoDesde Fecha de inicio del período
     * @param pedidoHasta Fecha de fin del período
     * @param licenciaId ID de licencia a excluir (null para nuevas licencias)
     * @return Lista de licencias que se solapan con el período
     */
    @Query(value = "SELECT l FROM Licencia l WHERE l.persona.dni = :personaDni "
            + "AND (:licenciaId IS NULL OR l.id != :licenciaId) "
            + "AND (l.pedidoDesde <= :pedidoHasta AND l.pedidoHasta >= :pedidoDesde) "
            + "AND l.estado = unpsjb.labprog.backend.model.enums.Estado.VALIDO")
    List<Licencia> findLicenciasSuperPuestas(
            @Param("personaDni") Long personaDni,
            @Param("pedidoDesde") LocalDate pedidoDesde,
            @Param("pedidoHasta") LocalDate pedidoHasta,
            @Param("licenciaId") Integer licenciaId);

    /**
     * Busca licencias válidas para una persona por artículo y año. Útil para
     * verificar límites anuales de ciertos tipos de licencias.
     *
     * @param personaDni DNI de la persona
     * @param articuloCode Código del artículo de licencia
     * @param anio Año a consultar
     * @param licenciaId ID de licencia a excluir (null para nuevas licencias)
     * @return Lista de licencias que cumplen los criterios
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
     * Busca licencias válidas para una persona por artículo, año y mes. Útil
     * para verificar límites mensuales de ciertos tipos de licencias.
     *
     * @param personaDni DNI de la persona
     * @param articuloCode Código del artículo de licencia
     * @param anio Año a consultar
     * @param mes Mes a consultar (1-12)
     * @param licenciaId ID de licencia a excluir (null para nuevas licencias)
     * @return Lista de licencias que cumplen los criterios
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
     * Busca licencias válidas de una persona que estén completamente dentro de
     * un período. La licencia debe comenzar y terminar dentro del rango de
     * fechas especificado.
     *
     * @param persona La persona asociada a las licencias
     * @param pedidoDesde Fecha desde la cual buscar licencias
     * @param pedidoHasta Fecha hasta la cual buscar licencias
     * @return Lista de licencias contenidas en el período
     */
    @Query("SELECT l FROM Licencia l WHERE l.persona = :persona "
            + "AND l.pedidoDesde >= :pedidoDesde "
            + "AND l.pedidoHasta <= :pedidoHasta "
            + "AND l.estado = unpsjb.labprog.backend.model.enums.Estado.VALIDO")
    List<Licencia> findValidLicenciasByPersonaAndPeriod(
            @Param("persona") Persona persona,
            @Param("pedidoDesde") LocalDate pedidoDesde,
            @Param("pedidoHasta") LocalDate pedidoHasta);

    /**
     * Busca todas las licencias válidas que estén activas en una fecha
     * específica. Ordenadas por apellido y nombre de la persona.
     *
     * @param fecha La fecha a consultar
     * @return Lista de licencias activas en esa fecha
     */
    @Query("SELECT l FROM Licencia l WHERE l.estado = unpsjb.labprog.backend.model.enums.Estado.VALIDO "
            + "AND l.pedidoDesde <= :fecha "
            + "AND l.pedidoHasta >= :fecha "
            + "ORDER BY l.persona.apellido, l.persona.nombre")
    List<Licencia> findLicenciasValidasEnFecha(
            @Param("fecha") LocalDate fecha);

    /**
     * Busca licencias que se solapen con un período para verificar cobertura
     * continua. Retorna las licencias ordenadas por fecha de inicio.
     *
     * @param personaDni DNI de la persona
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
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin);

    /**
     * Busca todas las licencias válidas de una persona en un año específico.
     * Útil para generar reportes anuales. Ordenadas por fecha de inicio.
     *
     * @param persona La persona asociada a las licencias
     * @param anio El año a consultar
     * @return Lista de licencias de la persona en el año especificado
     */
    @Query("SELECT l FROM Licencia l WHERE l.persona = :persona "
            + "AND EXTRACT(YEAR FROM l.pedidoDesde) = :anio "
            + "AND l.estado = unpsjb.labprog.backend.model.enums.Estado.VALIDO "
            + "ORDER BY l.pedidoDesde")
    List<Licencia> findLicenciasPorPersonaYAño(
            @Param("persona") Persona persona,
            @Param("anio") Integer anio);

    /**
     * Verifica si una persona tiene al menos una licencia activa en una fecha
     * específica.
     *
     * @param persona La persona a verificar
     * @param fecha La fecha para verificar licencias activas
     * @return true si tiene licencias activas, false en caso contrario
     */
    @Query("SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END FROM Licencia l "
            + "WHERE l.persona = :persona "
            + "AND l.pedidoDesde <= :fecha "
            + "AND l.pedidoHasta >= :fecha "
            + "AND l.estado = unpsjb.labprog.backend.model.enums.Estado.VALIDO")
    boolean tienePersonaLicenciaActivaEnFecha(
            @Param("persona") Persona persona,
            @Param("fecha") LocalDate fecha);
}
