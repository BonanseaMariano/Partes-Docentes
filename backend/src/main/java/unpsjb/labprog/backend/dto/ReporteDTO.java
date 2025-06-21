package unpsjb.labprog.backend.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import unpsjb.labprog.backend.model.enums.TipoDesignacion;

/**
 * DTO para representar el reporte individual de un docente con sus
 * designaciones, estadísticas de licencias y calificación durante un año
 * específico. Contiene información detallada de las designaciones y análisis de
 * licencias.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public class ReporteDTO {

    /**
     * Año del reporte
     */
    @JsonProperty("Anio")
    private Integer año;

    /**
     * Información básica del docente
     */
    @JsonProperty("Docente")
    private DocenteInfo docente;

    /**
     * Lista de designaciones con días calculados para el año
     */
    @JsonProperty("Designaciones")
    private List<DesignacionConDias> designaciones;

    /**
     * Estadísticas de licencias del docente
     */
    @JsonProperty("EstadisticasLicencias")
    private EstadisticasLicencias estadisticasLicencias;

    /**
     * Calificación del docente para el período
     */
    @JsonProperty("Calificacion")
    private String calificacion;

    /**
     * Constructor por defecto.
     */
    public ReporteDTO() {
    }

    /**
     * Constructor completo.
     *
     * @param año el año del reporte
     * @param docente la información del docente
     * @param designaciones las designaciones con días calculados
     * @param estadisticasLicencias las estadísticas de licencias
     * @param calificacion la calificación del período
     */
    public ReporteDTO(Integer año, DocenteInfo docente,
            List<DesignacionConDias> designaciones,
            EstadisticasLicencias estadisticasLicencias,
            String calificacion) {
        this.año = año;
        this.docente = docente;
        this.designaciones = designaciones;
        this.estadisticasLicencias = estadisticasLicencias;
        this.calificacion = calificacion;
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
     * Obtiene la información del docente.
     *
     * @return la información del docente
     */
    public DocenteInfo getDocente() {
        return docente;
    }

    /**
     * Establece la información del docente.
     *
     * @param docente la información del docente
     */
    public void setDocente(DocenteInfo docente) {
        this.docente = docente;
    }

    /**
     * Obtiene las designaciones con días calculados.
     *
     * @return las designaciones con días calculados
     */
    public List<DesignacionConDias> getDesignaciones() {
        return designaciones;
    }

    /**
     * Establece las designaciones con días calculados.
     *
     * @param designaciones las designaciones con días calculados
     */
    public void setDesignaciones(List<DesignacionConDias> designaciones) {
        this.designaciones = designaciones;
    }

    /**
     * Obtiene las estadísticas de licencias.
     *
     * @return las estadísticas de licencias
     */
    public EstadisticasLicencias getEstadisticasLicencias() {
        return estadisticasLicencias;
    }

    /**
     * Establece las estadísticas de licencias.
     *
     * @param estadisticasLicencias las estadísticas de licencias
     */
    public void setEstadisticasLicencias(EstadisticasLicencias estadisticasLicencias) {
        this.estadisticasLicencias = estadisticasLicencias;
    }

    /**
     * Obtiene la calificación del período.
     *
     * @return la calificación del período
     */
    public String getCalificacion() {
        return calificacion;
    }

    /**
     * Establece la calificación del período.
     *
     * @param calificacion la calificación del período
     */
    public void setCalificacion(String calificacion) {
        this.calificacion = calificacion;
    }

    /**
     * Clase interna que representa la información básica de un docente.
     */
    public static class DocenteInfo {

        /**
         * DNI del docente
         */
        @JsonProperty("DNI")
        private Long dni;

        /**
         * Nombre del docente
         */
        @JsonProperty("Nombre")
        private String nombre;

        /**
         * Apellido del docente
         */
        @JsonProperty("Apellido")
        private String apellido;

        /**
         * Constructor por defecto.
         */
        public DocenteInfo() {
        }

        /**
         * Constructor completo.
         *
         * @param dni el DNI del docente
         * @param nombre el nombre del docente
         * @param apellido el apellido del docente
         */
        public DocenteInfo(Long dni, String nombre, String apellido) {
            this.dni = dni;
            this.nombre = nombre;
            this.apellido = apellido;
        }

        /**
         * Obtiene el DNI del docente.
         *
         * @return el DNI del docente
         */
        public Long getDni() {
            return dni;
        }

        /**
         * Establece el DNI del docente.
         *
         * @param dni el DNI del docente
         */
        public void setDni(Long dni) {
            this.dni = dni;
        }

        /**
         * Obtiene el nombre del docente.
         *
         * @return el nombre del docente
         */
        public String getNombre() {
            return nombre;
        }

        /**
         * Establece el nombre del docente.
         *
         * @param nombre el nombre del docente
         */
        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        /**
         * Obtiene el apellido del docente.
         *
         * @return el apellido del docente
         */
        public String getApellido() {
            return apellido;
        }

        /**
         * Establece el apellido del docente.
         *
         * @param apellido el apellido del docente
         */
        public void setApellido(String apellido) {
            this.apellido = apellido;
        }
    }

    /**
     * Clase interna que representa la información básica de una designación.
     */
    public static class DesignacionInfo {

        /**
         * Situación de revista de la designación
         */
        @JsonProperty("SituacionRevista")
        private String situacionRevista;

        /**
         * Fecha de inicio de la designación
         */
        @JsonProperty("FechaInicio")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate fechaInicio;

        /**
         * Fecha de fin de la designación
         */
        @JsonProperty("FechaFin")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate fechaFin;

        /**
         * Información del cargo asociado
         */
        @JsonProperty("Cargo")
        private CargoInfo cargo;

        /**
         * Constructor por defecto.
         */
        public DesignacionInfo() {
        }

        /**
         * Constructor completo.
         *
         * @param situacionRevista la situación de revista
         * @param fechaInicio la fecha de inicio
         * @param fechaFin la fecha de fin
         * @param cargo la información del cargo
         */
        public DesignacionInfo(String situacionRevista, LocalDate fechaInicio,
                LocalDate fechaFin, CargoInfo cargo) {
            this.situacionRevista = situacionRevista;
            this.fechaInicio = fechaInicio;
            this.fechaFin = fechaFin;
            this.cargo = cargo;
        }

        /**
         * Obtiene la situación de revista.
         *
         * @return la situación de revista
         */
        public String getSituacionRevista() {
            return situacionRevista;
        }

        /**
         * Establece la situación de revista.
         *
         * @param situacionRevista la situación de revista
         */
        public void setSituacionRevista(String situacionRevista) {
            this.situacionRevista = situacionRevista;
        }

        /**
         * Obtiene la fecha de inicio.
         *
         * @return la fecha de inicio
         */
        public LocalDate getFechaInicio() {
            return fechaInicio;
        }

        /**
         * Establece la fecha de inicio.
         *
         * @param fechaInicio la fecha de inicio
         */
        public void setFechaInicio(LocalDate fechaInicio) {
            this.fechaInicio = fechaInicio;
        }

        /**
         * Obtiene la fecha de fin.
         *
         * @return la fecha de fin
         */
        public LocalDate getFechaFin() {
            return fechaFin;
        }

        /**
         * Establece la fecha de fin.
         *
         * @param fechaFin la fecha de fin
         */
        public void setFechaFin(LocalDate fechaFin) {
            this.fechaFin = fechaFin;
        }

        /**
         * Obtiene la información del cargo.
         *
         * @return la información del cargo
         */
        public CargoInfo getCargo() {
            return cargo;
        }

        /**
         * Establece la información del cargo.
         *
         * @param cargo la información del cargo
         */
        public void setCargo(CargoInfo cargo) {
            this.cargo = cargo;
        }

        /**
         * Clase interna que representa la información de un cargo dentro de una
         * designación.
         */
        public static class CargoInfo {

            /**
             * Nombre del cargo
             */
            @JsonProperty("Nombre")
            private String nombre;

            /**
             * Carga horaria del cargo
             */
            @JsonProperty("CargaHoraria")
            private Integer cargaHoraria;

            /**
             * Fecha de inicio del cargo
             */
            @JsonProperty("FechaInicio")
            @JsonFormat(pattern = "yyyy-MM-dd")
            private LocalDate fechaInicio;

            /**
             * Fecha de fin del cargo
             */
            @JsonProperty("FechaFin")
            @JsonFormat(pattern = "yyyy-MM-dd")
            private LocalDate fechaFin;

            /**
             * Tipo de designación del cargo
             */
            @JsonProperty("TipoDesignacion")
            private TipoDesignacion tipoDesignacion;

            /**
             * Información de la división asociada
             */
            @JsonProperty("Division")
            private DivisionInfo division;

            /**
             * Constructor por defecto.
             */
            public CargoInfo() {
            }

            /**
             * Constructor completo.
             *
             * @param nombre el nombre del cargo
             * @param cargaHoraria la carga horaria
             * @param fechaInicio la fecha de inicio
             * @param fechaFin la fecha de fin
             * @param tipoDesignacion el tipo de designación
             * @param division la información de la división
             */
            public CargoInfo(String nombre, Integer cargaHoraria, LocalDate fechaInicio,
                    LocalDate fechaFin, TipoDesignacion tipoDesignacion, DivisionInfo division) {
                this.nombre = nombre;
                this.cargaHoraria = cargaHoraria;
                this.fechaInicio = fechaInicio;
                this.fechaFin = fechaFin;
                this.tipoDesignacion = tipoDesignacion;
                this.division = division;
            }

            /**
             * Obtiene el nombre del cargo.
             *
             * @return el nombre del cargo
             */
            public String getNombre() {
                return nombre;
            }

            /**
             * Establece el nombre del cargo.
             *
             * @param nombre el nombre del cargo
             */
            public void setNombre(String nombre) {
                this.nombre = nombre;
            }

            /**
             * Obtiene la carga horaria del cargo.
             *
             * @return la carga horaria
             */
            public Integer getCargaHoraria() {
                return cargaHoraria;
            }

            /**
             * Establece la carga horaria del cargo.
             *
             * @param cargaHoraria la carga horaria
             */
            public void setCargaHoraria(Integer cargaHoraria) {
                this.cargaHoraria = cargaHoraria;
            }

            /**
             * Obtiene la fecha de inicio del cargo.
             *
             * @return la fecha de inicio
             */
            public LocalDate getFechaInicio() {
                return fechaInicio;
            }

            /**
             * Establece la fecha de inicio del cargo.
             *
             * @param fechaInicio la fecha de inicio
             */
            public void setFechaInicio(LocalDate fechaInicio) {
                this.fechaInicio = fechaInicio;
            }

            /**
             * Obtiene la fecha de fin del cargo.
             *
             * @return la fecha de fin
             */
            public LocalDate getFechaFin() {
                return fechaFin;
            }

            /**
             * Establece la fecha de fin del cargo.
             *
             * @param fechaFin la fecha de fin
             */
            public void setFechaFin(LocalDate fechaFin) {
                this.fechaFin = fechaFin;
            }

            /**
             * Obtiene el tipo de designación.
             *
             * @return el tipo de designación
             */
            public TipoDesignacion getTipoDesignacion() {
                return tipoDesignacion;
            }

            /**
             * Establece el tipo de designación.
             *
             * @param tipoDesignacion el tipo de designación
             */
            public void setTipoDesignacion(TipoDesignacion tipoDesignacion) {
                this.tipoDesignacion = tipoDesignacion;
            }

            /**
             * Obtiene la información de la división.
             *
             * @return la información de la división
             */
            public DivisionInfo getDivision() {
                return division;
            }

            /**
             * Establece la información de la división.
             *
             * @param division la información de la división
             */
            public void setDivision(DivisionInfo division) {
                this.division = division;
            }

            /**
             * Clase interna que representa la información de una división.
             */
            public static class DivisionInfo {

                /**
                 * Año de la división
                 */
                @JsonProperty("Anio")
                private Integer anio;

                /**
                 * Número de división
                 */
                @JsonProperty("NumDivision")
                private Integer numDivision;

                /**
                 * Orientación de la división
                 */
                @JsonProperty("Orientacion")
                private String orientacion;

                /**
                 * Turno de la división
                 */
                @JsonProperty("Turno")
                private String turno;

                /**
                 * Constructor por defecto.
                 */
                public DivisionInfo() {
                }

                /**
                 * Constructor completo.
                 *
                 * @param anio el año de la división
                 * @param numDivision el número de división
                 * @param orientacion la orientación
                 * @param turno el turno
                 */
                public DivisionInfo(Integer anio, Integer numDivision, String orientacion, String turno) {
                    this.anio = anio;
                    this.numDivision = numDivision;
                    this.orientacion = orientacion;
                    this.turno = turno;
                }

                /**
                 * Obtiene el año de la división.
                 *
                 * @return el año de la división
                 */
                public Integer getAnio() {
                    return anio;
                }

                /**
                 * Establece el año de la división.
                 *
                 * @param anio el año de la división
                 */
                public void setAnio(Integer anio) {
                    this.anio = anio;
                }

                /**
                 * Obtiene el número de división.
                 *
                 * @return el número de división
                 */
                public Integer getNumDivision() {
                    return numDivision;
                }

                /**
                 * Establece el número de división.
                 *
                 * @param numDivision el número de división
                 */
                public void setNumDivision(Integer numDivision) {
                    this.numDivision = numDivision;
                }

                /**
                 * Obtiene la orientación de la división.
                 *
                 * @return la orientación
                 */
                public String getOrientacion() {
                    return orientacion;
                }

                /**
                 * Establece la orientación de la división.
                 *
                 * @param orientacion la orientación
                 */
                public void setOrientacion(String orientacion) {
                    this.orientacion = orientacion;
                }

                /**
                 * Obtiene el turno de la división.
                 *
                 * @return el turno
                 */
                public String getTurno() {
                    return turno;
                }

                /**
                 * Establece el turno de la división.
                 *
                 * @param turno el turno
                 */
                public void setTurno(String turno) {
                    this.turno = turno;
                }
            }
        }
    }

    /**
     * Clase interna que representa una designación con días calculados para un
     * año específico.
     */
    public static class DesignacionConDias {

        /**
         * Información de la designación
         */
        @JsonProperty("Designacion")
        private DesignacionInfo designacion;

        /**
         * Fecha de inicio efectiva en el año
         */
        @JsonProperty("FechaInicioEnAnio")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate fechaInicioEnAño;

        /**
         * Fecha de fin efectiva en el año
         */
        @JsonProperty("FechaFinEnAnio")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate fechaFinEnAño;

        /**
         * Días totales de designación en el año
         */
        @JsonProperty("DiasDesignacionEnAnio")
        private Integer diasDesignacionEnAño;

        /**
         * Constructor por defecto.
         */
        public DesignacionConDias() {
        }

        /**
         * Constructor completo.
         *
         * @param designacion la información de la designación
         * @param fechaInicioEnAño la fecha de inicio en el año
         * @param fechaFinEnAño la fecha de fin en el año
         * @param diasDesignacionEnAño los días de designación en el año
         */
        public DesignacionConDias(DesignacionInfo designacion, LocalDate fechaInicioEnAño,
                LocalDate fechaFinEnAño, Integer diasDesignacionEnAño) {
            this.designacion = designacion;
            this.fechaInicioEnAño = fechaInicioEnAño;
            this.fechaFinEnAño = fechaFinEnAño;
            this.diasDesignacionEnAño = diasDesignacionEnAño;
        }

        /**
         * Obtiene la información de la designación.
         *
         * @return la información de la designación
         */
        public DesignacionInfo getDesignacion() {
            return designacion;
        }

        /**
         * Establece la información de la designación.
         *
         * @param designacion la información de la designación
         */
        public void setDesignacion(DesignacionInfo designacion) {
            this.designacion = designacion;
        }

        /**
         * Obtiene la fecha de inicio en el año.
         *
         * @return la fecha de inicio en el año
         */
        public LocalDate getFechaInicioEnAño() {
            return fechaInicioEnAño;
        }

        /**
         * Establece la fecha de inicio en el año.
         *
         * @param fechaInicioEnAño la fecha de inicio en el año
         */
        public void setFechaInicioEnAño(LocalDate fechaInicioEnAño) {
            this.fechaInicioEnAño = fechaInicioEnAño;
        }

        /**
         * Obtiene la fecha de fin en el año.
         *
         * @return la fecha de fin en el año
         */
        public LocalDate getFechaFinEnAño() {
            return fechaFinEnAño;
        }

        /**
         * Establece la fecha de fin en el año.
         *
         * @param fechaFinEnAño la fecha de fin en el año
         */
        public void setFechaFinEnAño(LocalDate fechaFinEnAño) {
            this.fechaFinEnAño = fechaFinEnAño;
        }

        /**
         * Obtiene los días de designación en el año.
         *
         * @return los días de designación en el año
         */
        public Integer getDiasDesignacionEnAño() {
            return diasDesignacionEnAño;
        }

        /**
         * Establece los días de designación en el año.
         *
         * @param diasDesignacionEnAño los días de designación en el año
         */
        public void setDiasDesignacionEnAño(Integer diasDesignacionEnAño) {
            this.diasDesignacionEnAño = diasDesignacionEnAño;
        }
    }

    /**
     * Clase interna que representa las estadísticas de licencias de un docente
     * para un período específico.
     */
    public static class EstadisticasLicencias {

        /**
         * Total de días de licencia del docente
         */
        @JsonProperty("TotalDiasLicencia")
        private Integer totalDiasLicencia;

        /**
         * Porcentaje de licencia sobre el total anual
         */
        @JsonProperty("PorcentajeLicenciaAnual")
        private Double porcentajeLicenciaAnual;

        /**
         * Distribución de licencias por mes
         */
        @JsonProperty("LicenciasPorMes")
        private Map<String, Integer> licenciasPorMes;

        /**
         * Licencias agrupadas por artículo con detalles
         */
        @JsonProperty("LicenciasPorArticulo")
        private Map<String, LicenciasPorArticulo> licenciasPorArticulo;

        /**
         * Constructor por defecto.
         */
        public EstadisticasLicencias() {
        }

        /**
         * Obtiene el total de días de licencia.
         *
         * @return el total de días de licencia
         */
        public Integer getTotalDiasLicencia() {
            return totalDiasLicencia;
        }

        /**
         * Establece el total de días de licencia.
         *
         * @param totalDiasLicencia el total de días de licencia
         */
        public void setTotalDiasLicencia(Integer totalDiasLicencia) {
            this.totalDiasLicencia = totalDiasLicencia;
        }

        /**
         * Obtiene el porcentaje de licencia anual.
         *
         * @return el porcentaje de licencia anual
         */
        public Double getPorcentajeLicenciaAnual() {
            return porcentajeLicenciaAnual;
        }

        /**
         * Establece el porcentaje de licencia anual.
         *
         * @param porcentajeLicenciaAnual el porcentaje de licencia anual
         */
        public void setPorcentajeLicenciaAnual(Double porcentajeLicenciaAnual) {
            this.porcentajeLicenciaAnual = porcentajeLicenciaAnual;
        }

        /**
         * Obtiene las licencias distribuidas por mes.
         *
         * @return las licencias por mes
         */
        public Map<String, Integer> getLicenciasPorMes() {
            return licenciasPorMes;
        }

        /**
         * Establece las licencias distribuidas por mes.
         *
         * @param licenciasPorMes las licencias por mes
         */
        public void setLicenciasPorMes(Map<String, Integer> licenciasPorMes) {
            this.licenciasPorMes = licenciasPorMes;
        }

        /**
         * Obtiene las licencias agrupadas por artículo.
         *
         * @return las licencias por artículo
         */
        public Map<String, LicenciasPorArticulo> getLicenciasPorArticulo() {
            return licenciasPorArticulo;
        }

        /**
         * Establece las licencias agrupadas por artículo.
         *
         * @param licenciasPorArticulo las licencias por artículo
         */
        public void setLicenciasPorArticulo(Map<String, LicenciasPorArticulo> licenciasPorArticulo) {
            this.licenciasPorArticulo = licenciasPorArticulo;
        }
    }

    /**
     * Clase interna que representa el detalle de licencias agrupadas por
     * artículo específico.
     */
    public static class LicenciasPorArticulo {

        /**
         * Descripción del artículo de licencia
         */
        @JsonProperty("Descripcion")
        private String descripcion;

        /**
         * Total de días de licencia para este artículo
         */
        @JsonProperty("Dias")
        private Integer dias;

        /**
         * Cantidad de licencias de este artículo
         */
        @JsonProperty("Cantidad")
        private Integer cantidad;

        /**
         * Constructor por defecto.
         */
        public LicenciasPorArticulo() {
        }

        /**
         * Constructor completo.
         *
         * @param descripcion la descripción del artículo
         * @param dias los días totales de licencia
         * @param cantidad la cantidad de licencias
         */
        public LicenciasPorArticulo(String descripcion, Integer dias, Integer cantidad) {
            this.descripcion = descripcion;
            this.dias = dias;
            this.cantidad = cantidad;
        }

        /**
         * Obtiene la descripción del artículo.
         *
         * @return la descripción del artículo
         */
        public String getDescripcion() {
            return descripcion;
        }

        /**
         * Establece la descripción del artículo.
         *
         * @param descripcion la descripción del artículo
         */
        public void setDescripcion(String descripcion) {
            this.descripcion = descripcion;
        }

        /**
         * Obtiene los días totales de licencia.
         *
         * @return los días totales de licencia
         */
        public Integer getDias() {
            return dias;
        }

        /**
         * Establece los días totales de licencia.
         *
         * @param dias los días totales de licencia
         */
        public void setDias(Integer dias) {
            this.dias = dias;
        }

        /**
         * Obtiene la cantidad de licencias.
         *
         * @return la cantidad de licencias
         */
        public Integer getCantidad() {
            return cantidad;
        }

        /**
         * Establece la cantidad de licencias.
         *
         * @param cantidad la cantidad de licencias
         */
        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
    }
}
