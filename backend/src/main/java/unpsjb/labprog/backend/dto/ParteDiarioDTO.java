package unpsjb.labprog.backend.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import unpsjb.labprog.backend.model.Designacion;

public class ParteDiarioDTO {

    @JsonProperty("Fecha")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecha;

    @JsonProperty("Docentes")
    private List<DocenteLicencia> docentes;

    // Constructores
    public ParteDiarioDTO() {
    }

    public ParteDiarioDTO(LocalDate fecha, List<DocenteLicencia> docentes) {
        this.fecha = fecha;
        this.docentes = docentes;
    }

    // Getters y Setters
    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public List<DocenteLicencia> getDocentes() {
        return docentes;
    }

    public void setDocentes(List<DocenteLicencia> docentes) {
        this.docentes = docentes;
    }

    // Clase interna para los docentes en licencia
    public static class DocenteLicencia {

        @JsonProperty("DNI")
        private Long dni;

        @JsonProperty("Nombre")
        private String nombre;

        @JsonProperty("Apellido")
        private String apellido;

        @JsonProperty("Artículo")
        private String articulo;

        @JsonProperty("Descripción")
        private String descripcion;

        @JsonProperty("Desde")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate desde;

        @JsonProperty("Hasta")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate hasta;

        @JsonProperty("Reemplazos")
        private List<Designacion> reemplazos;

        // Constructor vacío
        public DocenteLicencia() {
        }

        // Constructor completo
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

        public String getArticulo() {
            return articulo;
        }

        public void setArticulo(String articulo) {
            this.articulo = articulo;
        }

        public String getDescripcion() {
            return descripcion;
        }

        public void setDescripcion(String descripcion) {
            this.descripcion = descripcion;
        }

        public LocalDate getDesde() {
            return desde;
        }

        public void setDesde(LocalDate desde) {
            this.desde = desde;
        }

        public LocalDate getHasta() {
            return hasta;
        }

        public void setHasta(LocalDate hasta) {
            this.hasta = hasta;
        }

        public List<Designacion> getReemplazos() {
            return reemplazos;
        }

        public void setReemplazos(List<Designacion> reemplazos) {
            this.reemplazos = reemplazos;
        }
    }
}
