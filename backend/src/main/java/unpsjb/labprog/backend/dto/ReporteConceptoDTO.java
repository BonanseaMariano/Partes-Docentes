package unpsjb.labprog.backend.dto;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ReporteConceptoDTO {

    @JsonProperty("Anio")
    private Integer año;

    @JsonProperty("EstadisticasGenerales")
    private EstadisticasGenerales estadisticasGenerales;

    @JsonProperty("DistribucionDiasLicencias")
    private Map<String, Integer> distribucionDiasLicencias;

    @JsonProperty("CalificacionGeneral")
    private String calificacionGeneral;

    // Constructores
    public ReporteConceptoDTO() {
    }

    public ReporteConceptoDTO(Integer año, EstadisticasGenerales estadisticasGenerales,
            Map<String, Integer> distribucionDiasLicencias,
            String calificacionGeneral) {
        this.año = año;
        this.estadisticasGenerales = estadisticasGenerales;
        this.distribucionDiasLicencias = distribucionDiasLicencias;
        this.calificacionGeneral = calificacionGeneral;
    }

    // Getters y Setters
    public Integer getAño() {
        return año;
    }

    public void setAño(Integer año) {
        this.año = año;
    }

    public EstadisticasGenerales getEstadisticasGenerales() {
        return estadisticasGenerales;
    }

    public void setEstadisticasGenerales(EstadisticasGenerales estadisticasGenerales) {
        this.estadisticasGenerales = estadisticasGenerales;
    }

    public Map<String, Integer> getDistribucionDiasLicencias() {
        return distribucionDiasLicencias;
    }

    public void setDistribucionDiasLicencias(Map<String, Integer> distribucionDiasLicencias) {
        this.distribucionDiasLicencias = distribucionDiasLicencias;
    }

    public String getCalificacionGeneral() {
        return calificacionGeneral;
    }

    public void setCalificacionGeneral(String calificacionGeneral) {
        this.calificacionGeneral = calificacionGeneral;
    }

    // Clase interna para las estadísticas generales
    public static class EstadisticasGenerales {

        @JsonProperty("TotalDesignaciones")
        private Integer totalDesignaciones;

        @JsonProperty("TotalDocentes")
        private Integer totalDocentes;

        @JsonProperty("TotalLicencias")
        private Integer totalLicencias;

        @JsonProperty("TotalDiasLicencias")
        private Integer totalDiasLicencias;

        @JsonProperty("LicenciasPorArticulo")
        private Map<String, Integer> licenciasPorArticulo;

        @JsonProperty("DiasLicenciasPorArticulo")
        private Map<String, Integer> diasLicenciasPorArticulo;

        @JsonProperty("PromedioLicenciasPorDesignacion")
        private Double promedioLicenciasPorDesignacion;

        @JsonProperty("PorcentajeDiasLicenciaAnual")
        private Double porcentajeDiasLicenciaAnual;

        // Constructores
        public EstadisticasGenerales() {
        }

        public EstadisticasGenerales(Integer totalDesignaciones, Integer totalDocentes,
                Integer totalLicencias, Integer totalDiasLicencias, Map<String, Integer> licenciasPorArticulo,
                Map<String, Integer> diasLicenciasPorArticulo,
                Double promedioLicenciasPorDesignacion, Double porcentajeDiasLicenciaAnual) {
            this.totalDesignaciones = totalDesignaciones;
            this.totalDocentes = totalDocentes;
            this.totalLicencias = totalLicencias;
            this.totalDiasLicencias = totalDiasLicencias;
            this.licenciasPorArticulo = licenciasPorArticulo;
            this.diasLicenciasPorArticulo = diasLicenciasPorArticulo;
            this.promedioLicenciasPorDesignacion = promedioLicenciasPorDesignacion;
            this.porcentajeDiasLicenciaAnual = porcentajeDiasLicenciaAnual;
        }

        // Getters y Setters
        public Integer getTotalDesignaciones() {
            return totalDesignaciones;
        }

        public void setTotalDesignaciones(Integer totalDesignaciones) {
            this.totalDesignaciones = totalDesignaciones;
        }

        public Integer getTotalDocentes() {
            return totalDocentes;
        }

        public void setTotalDocentes(Integer totalDocentes) {
            this.totalDocentes = totalDocentes;
        }

        public Integer getTotalLicencias() {
            return totalLicencias;
        }

        public void setTotalLicencias(Integer totalLicencias) {
            this.totalLicencias = totalLicencias;
        }

        public Integer getTotalDiasLicencias() {
            return totalDiasLicencias;
        }

        public void setTotalDiasLicencias(Integer totalDiasLicencias) {
            this.totalDiasLicencias = totalDiasLicencias;
        }

        public Map<String, Integer> getLicenciasPorArticulo() {
            return licenciasPorArticulo;
        }

        public void setLicenciasPorArticulo(Map<String, Integer> licenciasPorArticulo) {
            this.licenciasPorArticulo = licenciasPorArticulo;
        }

        public Map<String, Integer> getDiasLicenciasPorArticulo() {
            return diasLicenciasPorArticulo;
        }

        public void setDiasLicenciasPorArticulo(Map<String, Integer> diasLicenciasPorArticulo) {
            this.diasLicenciasPorArticulo = diasLicenciasPorArticulo;
        }

        public Double getPromedioLicenciasPorDesignacion() {
            return promedioLicenciasPorDesignacion;
        }

        public void setPromedioLicenciasPorDesignacion(Double promedioLicenciasPorDesignacion) {
            this.promedioLicenciasPorDesignacion = promedioLicenciasPorDesignacion;
        }

        public Double getPorcentajeDiasLicenciaAnual() {
            return porcentajeDiasLicenciaAnual;
        }

        public void setPorcentajeDiasLicenciaAnual(Double porcentajeDiasLicenciaAnual) {
            this.porcentajeDiasLicenciaAnual = porcentajeDiasLicenciaAnual;
        }
    }
}
