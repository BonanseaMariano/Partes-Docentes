package unpsjb.labprog.backend.dto;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO para representar el reporte conceptual anual con estadísticas generales
 * de licencias y reportes de docentes. Contiene información consolidada de
 * todas las licencias y designaciones de un año específico.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public class ReporteConceptoDTO {

    /**
     * El año del reporte conceptual
     */
    @JsonProperty("Anio")
    private Integer año;

    /**
     * Estadísticas generales del año
     */
    @JsonProperty("EstadisticasGenerales")
    private EstadisticasGenerales estadisticasGenerales;

    /**
     * Distribución de días de licencias por artículo
     */
    @JsonProperty("DistribucionDiasLicencias")
    private Map<String, Integer> distribucionDiasLicencias;

    /**
     * Calificación general del período
     */
    @JsonProperty("CalificacionGeneral")
    private String calificacionGeneral;

    /**
     * Lista de reportes individuales de docentes
     */
    @JsonProperty("ReportesDocentes")
    private List<ReporteDTO> reportesDocentes;

    /**
     * Constructor por defecto.
     */
    public ReporteConceptoDTO() {
    }

    /**
     * Constructor completo.
     *
     * @param año el año del reporte
     * @param estadisticasGenerales las estadísticas generales
     * @param distribucionDiasLicencias la distribución de días por artículo
     * @param calificacionGeneral la calificación general
     * @param reportesDocentes los reportes individuales de docentes
     */
    public ReporteConceptoDTO(Integer año, EstadisticasGenerales estadisticasGenerales,
            Map<String, Integer> distribucionDiasLicencias,
            String calificacionGeneral, List<ReporteDTO> reportesDocentes) {
        this.año = año;
        this.estadisticasGenerales = estadisticasGenerales;
        this.distribucionDiasLicencias = distribucionDiasLicencias;
        this.calificacionGeneral = calificacionGeneral;
        this.reportesDocentes = reportesDocentes;
    }

    /**
     * Obtiene el año del reporte.
     *
     * @return el año del reporte
     */
    public Integer getAño() {
        return año;
    }

    /**
     * Establece el año del reporte.
     *
     * @param año el año del reporte
     */
    public void setAño(Integer año) {
        this.año = año;
    }

    /**
     * Obtiene las estadísticas generales.
     *
     * @return las estadísticas generales
     */
    public EstadisticasGenerales getEstadisticasGenerales() {
        return estadisticasGenerales;
    }

    /**
     * Establece las estadísticas generales.
     *
     * @param estadisticasGenerales las estadísticas generales
     */
    public void setEstadisticasGenerales(EstadisticasGenerales estadisticasGenerales) {
        this.estadisticasGenerales = estadisticasGenerales;
    }

    /**
     * Obtiene la distribución de días de licencias por artículo.
     *
     * @return la distribución de días por artículo
     */
    public Map<String, Integer> getDistribucionDiasLicencias() {
        return distribucionDiasLicencias;
    }

    /**
     * Establece la distribución de días de licencias por artículo.
     *
     * @param distribucionDiasLicencias la distribución de días por artículo
     */
    public void setDistribucionDiasLicencias(Map<String, Integer> distribucionDiasLicencias) {
        this.distribucionDiasLicencias = distribucionDiasLicencias;
    }

    /**
     * Obtiene la calificación general del período.
     *
     * @return la calificación general
     */
    public String getCalificacionGeneral() {
        return calificacionGeneral;
    }

    /**
     * Establece la calificación general del período.
     *
     * @param calificacionGeneral la calificación general
     */
    public void setCalificacionGeneral(String calificacionGeneral) {
        this.calificacionGeneral = calificacionGeneral;
    }

    /**
     * Obtiene la lista de reportes individuales de docentes.
     *
     * @return los reportes de docentes
     */
    public List<ReporteDTO> getReportesDocentes() {
        return reportesDocentes;
    }

    /**
     * Establece la lista de reportes individuales de docentes.
     *
     * @param reportesDocentes los reportes de docentes
     */
    public void setReportesDocentes(List<ReporteDTO> reportesDocentes) {
        this.reportesDocentes = reportesDocentes;
    }

    /**
     * Clase interna que representa las estadísticas generales de licencias de
     * un período determinado.
     */
    public static class EstadisticasGenerales {

        /**
         * Total de designaciones en el período
         */
        @JsonProperty("TotalDesignaciones")
        private Integer totalDesignaciones;

        /**
         * Total de licencias otorgadas
         */
        @JsonProperty("TotalLicencias")
        private Integer totalLicencias;

        /**
         * Cantidad de licencias sin suplente asignado
         */
        @JsonProperty("LicenciasSinSuplente")
        private Integer licenciasSinSuplente;

        /**
         * Total de días de licencias
         */
        @JsonProperty("TotalDiasLicencias")
        private Integer totalDiasLicencias;

        /**
         * Cantidad de licencias agrupadas por artículo
         */
        @JsonProperty("LicenciasPorArticulo")
        private Map<String, Integer> licenciasPorArticulo;

        /**
         * Días de licencias agrupados por artículo
         */
        @JsonProperty("DiasLicenciasPorArticulo")
        private Map<String, Integer> diasLicenciasPorArticulo;

        /**
         * Promedio de licencias por designación
         */
        @JsonProperty("PromedioLicenciasPorDesignacion")
        private Double promedioLicenciasPorDesignacion;

        /**
         * Porcentaje de días de licencia sobre el total anual
         */
        @JsonProperty("PorcentajeDiasLicenciaAnual")
        private Double porcentajeDiasLicenciaAnual;

        /**
         * Constructor por defecto.
         */
        public EstadisticasGenerales() {
        }

        /**
         * Constructor completo.
         *
         * @param totalDesignaciones total de designaciones
         * @param totalLicencias total de licencias
         * @param licenciasSinSuplente licencias sin suplente
         * @param totalDiasLicencias total de días de licencias
         * @param licenciasPorArticulo licencias por artículo
         * @param diasLicenciasPorArticulo días por artículo
         * @param promedioLicenciasPorDesignacion promedio de licencias por
         * designación
         * @param porcentajeDiasLicenciaAnual porcentaje anual de días de
         * licencia
         */
        public EstadisticasGenerales(Integer totalDesignaciones,
                Integer totalLicencias, Integer licenciasSinSuplente, Integer totalDiasLicencias, Map<String, Integer> licenciasPorArticulo,
                Map<String, Integer> diasLicenciasPorArticulo,
                Double promedioLicenciasPorDesignacion, Double porcentajeDiasLicenciaAnual) {
            this.totalDesignaciones = totalDesignaciones;
            this.totalLicencias = totalLicencias;
            this.licenciasSinSuplente = licenciasSinSuplente;
            this.totalDiasLicencias = totalDiasLicencias;
            this.licenciasPorArticulo = licenciasPorArticulo;
            this.diasLicenciasPorArticulo = diasLicenciasPorArticulo;
            this.promedioLicenciasPorDesignacion = promedioLicenciasPorDesignacion;
            this.porcentajeDiasLicenciaAnual = porcentajeDiasLicenciaAnual;
        }

        /**
         * Obtiene el total de designaciones.
         *
         * @return el total de designaciones
         */
        public Integer getTotalDesignaciones() {
            return totalDesignaciones;
        }

        /**
         * Establece el total de designaciones.
         *
         * @param totalDesignaciones el total de designaciones
         */
        public void setTotalDesignaciones(Integer totalDesignaciones) {
            this.totalDesignaciones = totalDesignaciones;
        }

        /**
         * Obtiene el total de licencias.
         *
         * @return el total de licencias
         */
        public Integer getTotalLicencias() {
            return totalLicencias;
        }

        /**
         * Establece el total de licencias.
         *
         * @param totalLicencias el total de licencias
         */
        public void setTotalLicencias(Integer totalLicencias) {
            this.totalLicencias = totalLicencias;
        }

        /**
         * Obtiene las licencias sin suplente.
         *
         * @return las licencias sin suplente
         */
        public Integer getLicenciasSinSuplente() {
            return licenciasSinSuplente;
        }

        /**
         * Establece las licencias sin suplente.
         *
         * @param licenciasSinSuplente las licencias sin suplente
         */
        public void setLicenciasSinSuplente(Integer licenciasSinSuplente) {
            this.licenciasSinSuplente = licenciasSinSuplente;
        }

        /**
         * Obtiene el total de días de licencias.
         *
         * @return el total de días de licencias
         */
        public Integer getTotalDiasLicencias() {
            return totalDiasLicencias;
        }

        /**
         * Establece el total de días de licencias.
         *
         * @param totalDiasLicencias el total de días de licencias
         */
        public void setTotalDiasLicencias(Integer totalDiasLicencias) {
            this.totalDiasLicencias = totalDiasLicencias;
        }

        /**
         * Obtiene las licencias agrupadas por artículo.
         *
         * @return las licencias por artículo
         */
        public Map<String, Integer> getLicenciasPorArticulo() {
            return licenciasPorArticulo;
        }

        /**
         * Establece las licencias agrupadas por artículo.
         *
         * @param licenciasPorArticulo las licencias por artículo
         */
        public void setLicenciasPorArticulo(Map<String, Integer> licenciasPorArticulo) {
            this.licenciasPorArticulo = licenciasPorArticulo;
        }

        /**
         * Obtiene los días de licencias agrupados por artículo.
         *
         * @return los días por artículo
         */
        public Map<String, Integer> getDiasLicenciasPorArticulo() {
            return diasLicenciasPorArticulo;
        }

        /**
         * Establece los días de licencias agrupados por artículo.
         *
         * @param diasLicenciasPorArticulo los días por artículo
         */
        public void setDiasLicenciasPorArticulo(Map<String, Integer> diasLicenciasPorArticulo) {
            this.diasLicenciasPorArticulo = diasLicenciasPorArticulo;
        }

        /**
         * Obtiene el promedio de licencias por designación.
         *
         * @return el promedio de licencias por designación
         */
        public Double getPromedioLicenciasPorDesignacion() {
            return promedioLicenciasPorDesignacion;
        }

        /**
         * Establece el promedio de licencias por designación.
         *
         * @param promedioLicenciasPorDesignacion el promedio de licencias por
         * designación
         */
        public void setPromedioLicenciasPorDesignacion(Double promedioLicenciasPorDesignacion) {
            this.promedioLicenciasPorDesignacion = promedioLicenciasPorDesignacion;
        }

        /**
         * Obtiene el porcentaje de días de licencia anual.
         *
         * @return el porcentaje de días de licencia anual
         */
        public Double getPorcentajeDiasLicenciaAnual() {
            return porcentajeDiasLicenciaAnual;
        }

        /**
         * Establece el porcentaje de días de licencia anual.
         *
         * @param porcentajeDiasLicenciaAnual el porcentaje de días de licencia
         * anual
         */
        public void setPorcentajeDiasLicenciaAnual(Double porcentajeDiasLicenciaAnual) {
            this.porcentajeDiasLicenciaAnual = porcentajeDiasLicenciaAnual;
        }
    }
}
