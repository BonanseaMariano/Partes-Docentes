package unpsjb.labprog.backend.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import unpsjb.labprog.backend.model.enums.DiaSemana;
import unpsjb.labprog.backend.model.enums.Turno;

/**
 * DTO para representar los horarios de espacios curriculares en una grilla
 * semanal
 */
public class HorarioDTO {

    @JsonProperty("fecha")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecha;

    @JsonProperty("turno")
    private Turno turno;

    @JsonProperty("grilla")
    private Map<DiaSemana, List<HoraEspacioCurricular>> grilla;

    // Constructores
    public HorarioDTO() {
    }

    public HorarioDTO(LocalDate fecha, Turno turno, Map<DiaSemana, List<HoraEspacioCurricular>> grilla) {
        this.fecha = fecha;
        this.turno = turno;
        this.grilla = grilla;
    }

    // Getters y Setters
    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Turno getTurno() {
        return turno;
    }

    public void setTurno(Turno turno) {
        this.turno = turno;
    }

    public Map<DiaSemana, List<HoraEspacioCurricular>> getGrilla() {
        return grilla;
    }

    public void setGrilla(Map<DiaSemana, List<HoraEspacioCurricular>> grilla) {
        this.grilla = grilla;
    }

    /**
     * Clase interna para representar un espacio curricular en una hora
     * específica
     */
    public static class HoraEspacioCurricular {

        @JsonProperty("hora")
        private int hora;

        @JsonProperty("espacio_curricular")
        private String espacioCurricular;

        @JsonProperty("division")
        private String division;

        @JsonProperty("docente")
        private String docente;

        @JsonProperty("docente_de_licencia")
        private boolean docenteDeLicencia = false;

        // Constructores
        public HoraEspacioCurricular() {
        }

        public HoraEspacioCurricular(int hora, String espacioCurricular, String division, String docente) {
            this.hora = hora;
            this.espacioCurricular = espacioCurricular;
            this.division = division;
            this.docente = docente;
            this.docenteDeLicencia = false;
        }

        public HoraEspacioCurricular(int hora, String espacioCurricular, String division, String docente, boolean docenteDeLicencia) {
            this.hora = hora;
            this.espacioCurricular = espacioCurricular;
            this.division = division;
            this.docente = docente;
            this.docenteDeLicencia = docenteDeLicencia;
        }

        // Getters y Setters
        public int getHora() {
            return hora;
        }

        public void setHora(int hora) {
            this.hora = hora;
        }

        public String getEspacioCurricular() {
            return espacioCurricular;
        }

        public void setEspacioCurricular(String espacioCurricular) {
            this.espacioCurricular = espacioCurricular;
        }

        public String getDivision() {
            return division;
        }

        public void setDivision(String division) {
            this.division = division;
        }

        public String getDocente() {
            return docente;
        }

        public void setDocente(String docente) {
            this.docente = docente;
        }

        public boolean isDocenteDeLicencia() {
            return docenteDeLicencia;
        }

        public void setDocenteDeLicencia(boolean docenteDeLicencia) {
            this.docenteDeLicencia = docenteDeLicencia;
        }
    }
}
