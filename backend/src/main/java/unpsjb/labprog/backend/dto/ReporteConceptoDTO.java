package unpsjb.labprog.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import unpsjb.labprog.backend.model.enums.TipoDesignacion;

public class ReporteConceptoDTO {

    @JsonProperty("Año")
    private Integer año;

    @JsonProperty("Docente")
    private DocenteInfo docente;

    @JsonProperty("Designaciones")
    private List<DesignacionConDias> designaciones;

    @JsonProperty("EstadisticasLicencias")
    private EstadisticasLicencias estadisticasLicencias;

    @JsonProperty("Calificacion")
    private String calificacion;

    // Constructores
    public ReporteConceptoDTO() {
    }

    public ReporteConceptoDTO(Integer año, DocenteInfo docente,
            List<DesignacionConDias> designaciones,
            EstadisticasLicencias estadisticasLicencias,
            String calificacion) {
        this.año = año;
        this.docente = docente;
        this.designaciones = designaciones;
        this.estadisticasLicencias = estadisticasLicencias;
        this.calificacion = calificacion;
    }

    // Getters y Setters
    public Integer getAño() {
        return año;
    }

    public void setAño(Integer año) {
        this.año = año;
    }

    public DocenteInfo getDocente() {
        return docente;
    }

    public void setDocente(DocenteInfo docente) {
        this.docente = docente;
    }

    public List<DesignacionConDias> getDesignaciones() {
        return designaciones;
    }

    public void setDesignaciones(List<DesignacionConDias> designaciones) {
        this.designaciones = designaciones;
    }

    public EstadisticasLicencias getEstadisticasLicencias() {
        return estadisticasLicencias;
    }

    public void setEstadisticasLicencias(EstadisticasLicencias estadisticasLicencias) {
        this.estadisticasLicencias = estadisticasLicencias;
    }

    public String getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(String calificacion) {
        this.calificacion = calificacion;
    }

    // Clases internas
    public static class DocenteInfo {

        @JsonProperty("DNI")
        private Long dni;

        @JsonProperty("Nombre")
        private String nombre;

        @JsonProperty("Apellido")
        private String apellido;

        public DocenteInfo() {
        }

        public DocenteInfo(Long dni, String nombre, String apellido) {
            this.dni = dni;
            this.nombre = nombre;
            this.apellido = apellido;
        }

        // Getters y Setters
        public Long getDni() {
            return dni;
        }

        public void setDni(Long dni) {
            this.dni = dni;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public String getApellido() {
            return apellido;
        }

        public void setApellido(String apellido) {
            this.apellido = apellido;
        }
    }

    public static class DesignacionInfo {

        @JsonProperty("SituacionRevista")
        private String situacionRevista;

        @JsonProperty("FechaInicio")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDateTime fechaInicio;

        @JsonProperty("FechaFin")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDateTime fechaFin;

        @JsonProperty("Cargo")
        private CargoInfo cargo;

        public DesignacionInfo() {
        }

        public DesignacionInfo(String situacionRevista, LocalDateTime fechaInicio,
                LocalDateTime fechaFin, CargoInfo cargo) {
            this.situacionRevista = situacionRevista;
            this.fechaInicio = fechaInicio;
            this.fechaFin = fechaFin;
            this.cargo = cargo;
        }

        // Getters y Setters
        public String getSituacionRevista() {
            return situacionRevista;
        }

        public void setSituacionRevista(String situacionRevista) {
            this.situacionRevista = situacionRevista;
        }

        public LocalDateTime getFechaInicio() {
            return fechaInicio;
        }

        public void setFechaInicio(LocalDateTime fechaInicio) {
            this.fechaInicio = fechaInicio;
        }

        public LocalDateTime getFechaFin() {
            return fechaFin;
        }

        public void setFechaFin(LocalDateTime fechaFin) {
            this.fechaFin = fechaFin;
        }

        public CargoInfo getCargo() {
            return cargo;
        }

        public void setCargo(CargoInfo cargo) {
            this.cargo = cargo;
        }

        public static class CargoInfo {

            @JsonProperty("Nombre")
            private String nombre;

            @JsonProperty("CargaHoraria")
            private Integer cargaHoraria;

            @JsonProperty("FechaInicio")
            @JsonFormat(pattern = "yyyy-MM-dd")
            private LocalDateTime fechaInicio;

            @JsonProperty("FechaFin")
            @JsonFormat(pattern = "yyyy-MM-dd")
            private LocalDateTime fechaFin;

            @JsonProperty("TipoDesignacion")
            private TipoDesignacion tipoDesignacion;

            @JsonProperty("Division")
            private DivisionInfo division;

            public CargoInfo() {
            }

            public CargoInfo(String nombre, Integer cargaHoraria, LocalDateTime fechaInicio,
                    LocalDateTime fechaFin, TipoDesignacion tipoDesignacion, DivisionInfo division) {
                this.nombre = nombre;
                this.cargaHoraria = cargaHoraria;
                this.fechaInicio = fechaInicio;
                this.fechaFin = fechaFin;
                this.tipoDesignacion = tipoDesignacion;
                this.division = division;
            }

            // Getters y Setters
            public String getNombre() {
                return nombre;
            }

            public void setNombre(String nombre) {
                this.nombre = nombre;
            }

            public Integer getCargaHoraria() {
                return cargaHoraria;
            }

            public void setCargaHoraria(Integer cargaHoraria) {
                this.cargaHoraria = cargaHoraria;
            }

            public LocalDateTime getFechaInicio() {
                return fechaInicio;
            }

            public void setFechaInicio(LocalDateTime fechaInicio) {
                this.fechaInicio = fechaInicio;
            }

            public LocalDateTime getFechaFin() {
                return fechaFin;
            }

            public void setFechaFin(LocalDateTime fechaFin) {
                this.fechaFin = fechaFin;
            }

            public TipoDesignacion getTipoDesignacion() {
                return tipoDesignacion;
            }

            public void setTipoDesignacion(TipoDesignacion tipoDesignacion) {
                this.tipoDesignacion = tipoDesignacion;
            }

            public DivisionInfo getDivision() {
                return division;
            }

            public void setDivision(DivisionInfo division) {
                this.division = division;
            }

            public static class DivisionInfo {

                @JsonProperty("Anio")
                private Integer anio;

                @JsonProperty("NumDivision")
                private Integer numDivision;

                @JsonProperty("Orientacion")
                private String orientacion;

                @JsonProperty("Turno")
                private String turno;

                public DivisionInfo() {
                }

                public DivisionInfo(Integer anio, Integer numDivision, String orientacion, String turno) {
                    this.anio = anio;
                    this.numDivision = numDivision;
                    this.orientacion = orientacion;
                    this.turno = turno;
                }

                // Getters y Setters
                public Integer getAnio() {
                    return anio;
                }

                public void setAnio(Integer anio) {
                    this.anio = anio;
                }

                public Integer getNumDivision() {
                    return numDivision;
                }

                public void setNumDivision(Integer numDivision) {
                    this.numDivision = numDivision;
                }

                public String getOrientacion() {
                    return orientacion;
                }

                public void setOrientacion(String orientacion) {
                    this.orientacion = orientacion;
                }

                public String getTurno() {
                    return turno;
                }

                public void setTurno(String turno) {
                    this.turno = turno;
                }
            }
        }
    }

    public static class DesignacionConDias {

        @JsonProperty("Designacion")
        private DesignacionInfo designacion;

        @JsonProperty("FechaInicioEnAño")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate fechaInicioEnAño;

        @JsonProperty("FechaFinEnAño")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate fechaFinEnAño;

        @JsonProperty("DiasDesignacionEnAño")
        private Integer diasDesignacionEnAño;

        public DesignacionConDias() {
        }

        public DesignacionConDias(DesignacionInfo designacion, LocalDate fechaInicioEnAño,
                LocalDate fechaFinEnAño, Integer diasDesignacionEnAño) {
            this.designacion = designacion;
            this.fechaInicioEnAño = fechaInicioEnAño;
            this.fechaFinEnAño = fechaFinEnAño;
            this.diasDesignacionEnAño = diasDesignacionEnAño;
        }

        // Getters y Setters
        public DesignacionInfo getDesignacion() {
            return designacion;
        }

        public void setDesignacion(DesignacionInfo designacion) {
            this.designacion = designacion;
        }

        public LocalDate getFechaInicioEnAño() {
            return fechaInicioEnAño;
        }

        public void setFechaInicioEnAño(LocalDate fechaInicioEnAño) {
            this.fechaInicioEnAño = fechaInicioEnAño;
        }

        public LocalDate getFechaFinEnAño() {
            return fechaFinEnAño;
        }

        public void setFechaFinEnAño(LocalDate fechaFinEnAño) {
            this.fechaFinEnAño = fechaFinEnAño;
        }

        public Integer getDiasDesignacionEnAño() {
            return diasDesignacionEnAño;
        }

        public void setDiasDesignacionEnAño(Integer diasDesignacionEnAño) {
            this.diasDesignacionEnAño = diasDesignacionEnAño;
        }
    }

    public static class EstadisticasLicencias {

        @JsonProperty("TotalDiasLicencia")
        private Integer totalDiasLicencia;

        @JsonProperty("PorcentajeLicenciaAnual")
        private Double porcentajeLicenciaAnual;

        @JsonProperty("LicenciasPorMes")
        private Map<String, Integer> licenciasPorMes;

        @JsonProperty("LicenciasPorArticulo")
        private Map<String, LicenciasPorArticulo> licenciasPorArticulo;

        @JsonProperty("PromedioLicenciasMensual")
        private Double promedioLicenciasMensual;

        public EstadisticasLicencias() {
        }

        // Getters y Setters
        public Integer getTotalDiasLicencia() {
            return totalDiasLicencia;
        }

        public void setTotalDiasLicencia(Integer totalDiasLicencia) {
            this.totalDiasLicencia = totalDiasLicencia;
        }

        public Double getPorcentajeLicenciaAnual() {
            return porcentajeLicenciaAnual;
        }

        public void setPorcentajeLicenciaAnual(Double porcentajeLicenciaAnual) {
            this.porcentajeLicenciaAnual = porcentajeLicenciaAnual;
        }

        public Map<String, Integer> getLicenciasPorMes() {
            return licenciasPorMes;
        }

        public void setLicenciasPorMes(Map<String, Integer> licenciasPorMes) {
            this.licenciasPorMes = licenciasPorMes;
        }

        public Map<String, LicenciasPorArticulo> getLicenciasPorArticulo() {
            return licenciasPorArticulo;
        }

        public void setLicenciasPorArticulo(Map<String, LicenciasPorArticulo> licenciasPorArticulo) {
            this.licenciasPorArticulo = licenciasPorArticulo;
        }

        public Double getPromedioLicenciasMensual() {
            return promedioLicenciasMensual;
        }

        public void setPromedioLicenciasMensual(Double promedioLicenciasMensual) {
            this.promedioLicenciasMensual = promedioLicenciasMensual;
        }
    }

    public static class LicenciasPorArticulo {

        @JsonProperty("Descripcion")
        private String descripcion;

        @JsonProperty("Dias")
        private Integer dias;

        @JsonProperty("Cantidad")
        private Integer cantidad;

        public LicenciasPorArticulo() {
        }

        public LicenciasPorArticulo(String descripcion, Integer dias, Integer cantidad) {
            this.descripcion = descripcion;
            this.dias = dias;
            this.cantidad = cantidad;
        }

        // Getters y Setters
        public String getDescripcion() {
            return descripcion;
        }

        public void setDescripcion(String descripcion) {
            this.descripcion = descripcion;
        }

        public Integer getDias() {
            return dias;
        }

        public void setDias(Integer dias) {
            this.dias = dias;
        }

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
    }
}
