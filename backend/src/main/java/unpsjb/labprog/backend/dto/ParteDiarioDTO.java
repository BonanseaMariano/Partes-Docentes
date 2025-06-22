package unpsjb.labprog.backend.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import unpsjb.labprog.backend.model.Designacion;

/**
 * DTO para representar el parte diario de docentes en licencia. Contiene la
 * información de todos los docentes que están de licencia en una fecha
 * específica, incluyendo sus reemplazos si los tienen.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public class ParteDiarioDTO {

    /**
     * Fecha del parte diario
     */
    @JsonProperty("Fecha")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecha;

    /**
     * Lista de docentes en licencia para la fecha
     */
    @JsonProperty("Docentes")
    private List<DocenteLicencia> docentes;

    /**
     * Constructor por defecto.
     */
    public ParteDiarioDTO() {
    }

    /**
     * Constructor completo.
     *
     * @param fecha la fecha del parte diario
     * @param docentes la lista de docentes en licencia
     */
    public ParteDiarioDTO(LocalDate fecha, List<DocenteLicencia> docentes) {
        this.fecha = fecha;
        this.docentes = docentes;
    }

    /**
     * Obtiene la fecha del parte diario.
     *
     * @return la fecha del parte diario
     */
    public LocalDate getFecha() {
        return fecha;
    }

    /**
     * Establece la fecha del parte diario.
     *
     * @param fecha la fecha del parte diario
     */
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    /**
     * Obtiene la lista de docentes en licencia.
     *
     * @return la lista de docentes en licencia
     */
    public List<DocenteLicencia> getDocentes() {
        return docentes;
    }

    /**
     * Establece la lista de docentes en licencia.
     *
     * @param docentes la lista de docentes en licencia
     */
    public void setDocentes(List<DocenteLicencia> docentes) {
        this.docentes = docentes;
    }

    /**
     * Clase interna que representa a un docente en licencia con toda la
     * información relevante para el parte diario.
     */
    public static class DocenteLicencia {

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
         * Artículo de la licencia
         */
        @JsonProperty("Artículo")
        private String articulo;

        /**
         * Descripción del artículo de licencia
         */
        @JsonProperty("Descripción")
        private String descripcion;

        /**
         * Fecha de inicio de la licencia
         */
        @JsonProperty("Desde")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate desde;

        /**
         * Fecha de fin de la licencia
         */
        @JsonProperty("Hasta")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate hasta;

        /**
         * Lista de designaciones que reemplazan al docente
         */
        @JsonProperty("Reemplazos")
        private List<Designacion> reemplazos;

        /**
         * Constructor por defecto.
         */
        public DocenteLicencia() {
        }

        /**
         * Constructor completo.
         *
         * @param dni el DNI del docente
         * @param nombre el nombre del docente
         * @param apellido el apellido del docente
         * @param articulo el artículo de la licencia
         * @param descripcion la descripción del artículo
         * @param desde la fecha de inicio de la licencia
         * @param hasta la fecha de fin de la licencia
         * @param reemplazos las designaciones de reemplazo
         */
        public DocenteLicencia(Long dni, String nombre, String apellido,
                String articulo, String descripcion,
                LocalDate desde, LocalDate hasta, List<Designacion> reemplazos) {
            this.dni = dni;
            this.nombre = nombre;
            this.apellido = apellido;
            this.articulo = articulo;
            this.descripcion = descripcion;
            this.desde = desde;
            this.hasta = hasta;
            this.reemplazos = reemplazos;
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

        /**
         * Obtiene el artículo de la licencia.
         *
         * @return el artículo de la licencia
         */
        public String getArticulo() {
            return articulo;
        }

        /**
         * Establece el artículo de la licencia.
         *
         * @param articulo el artículo de la licencia
         */
        public void setArticulo(String articulo) {
            this.articulo = articulo;
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
         * Obtiene la fecha de inicio de la licencia.
         *
         * @return la fecha de inicio
         */
        public LocalDate getDesde() {
            return desde;
        }

        /**
         * Establece la fecha de inicio de la licencia.
         *
         * @param desde la fecha de inicio
         */
        public void setDesde(LocalDate desde) {
            this.desde = desde;
        }

        /**
         * Obtiene la fecha de fin de la licencia.
         *
         * @return la fecha de fin
         */
        public LocalDate getHasta() {
            return hasta;
        }

        /**
         * Establece la fecha de fin de la licencia.
         *
         * @param hasta la fecha de fin
         */
        public void setHasta(LocalDate hasta) {
            this.hasta = hasta;
        }

        /**
         * Obtiene las designaciones de reemplazo.
         *
         * @return las designaciones de reemplazo
         */
        public List<Designacion> getReemplazos() {
            return reemplazos;
        }

        /**
         * Establece las designaciones de reemplazo.
         *
         * @param reemplazos las designaciones de reemplazo
         */
        public void setReemplazos(List<Designacion> reemplazos) {
            this.reemplazos = reemplazos;
        }
    }
}
