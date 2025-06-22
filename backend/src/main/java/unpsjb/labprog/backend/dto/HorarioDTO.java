package unpsjb.labprog.backend.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import unpsjb.labprog.backend.model.enums.DiaSemana;
import unpsjb.labprog.backend.model.enums.Turno;

/**
 * DTO para representar los horarios de espacios curriculares organizados en una
 * grilla semanal por turno y fecha específica. Permite estructurar la
 * información de horarios para su visualización en el frontend.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public class HorarioDTO {

    /**
     * Fecha para la cual se muestra el horario
     */
    @JsonProperty("fecha")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecha;

    /**
     * Turno del horario (MAÑANA, TARDE, NOCHE)
     */
    @JsonProperty("turno")
    private Turno turno;

    /**
     * Grilla de horarios organizados por día de la semana y hora
     */
    @JsonProperty("grilla")
    private Map<DiaSemana, List<HoraEspacioCurricular>> grilla;

    /**
     * Constructor por defecto.
     */
    public HorarioDTO() {
    }

    /**
     * Constructor completo.
     *
     * @param fecha la fecha del horario
     * @param turno el turno del horario
     * @param grilla la grilla de horarios por día y hora
     */
    public HorarioDTO(LocalDate fecha, Turno turno, Map<DiaSemana, List<HoraEspacioCurricular>> grilla) {
        this.fecha = fecha;
        this.turno = turno;
        this.grilla = grilla;
    }

    /**
     * Obtiene la fecha del horario.
     *
     * @return la fecha del horario
     */
    public LocalDate getFecha() {
        return fecha;
    }

    /**
     * Establece la fecha del horario.
     *
     * @param fecha la fecha del horario
     */
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    /**
     * Obtiene el turno del horario.
     *
     * @return el turno del horario
     */
    public Turno getTurno() {
        return turno;
    }

    /**
     * Establece el turno del horario.
     *
     * @param turno el turno del horario
     */
    public void setTurno(Turno turno) {
        this.turno = turno;
    }

    /**
     * Obtiene la grilla de horarios por día de la semana.
     *
     * @return la grilla de horarios
     */
    public Map<DiaSemana, List<HoraEspacioCurricular>> getGrilla() {
        return grilla;
    }

    /**
     * Establece la grilla de horarios por día de la semana.
     *
     * @param grilla la grilla de horarios
     */
    public void setGrilla(Map<DiaSemana, List<HoraEspacioCurricular>> grilla) {
        this.grilla = grilla;
    }

    /**
     * Clase interna que representa un espacio curricular asignado a una hora
     * específica de la grilla horaria.
     */
    public static class HoraEspacioCurricular {

        /**
         * Hora específica dentro del turno
         */
        @JsonProperty("hora")
        private int hora;

        /**
         * Nombre del espacio curricular
         */
        @JsonProperty("espacio_curricular")
        private String espacioCurricular;

        /**
         * División asignada
         */
        @JsonProperty("division")
        private String division;

        /**
         * Docente asignado
         */
        @JsonProperty("docente")
        private String docente;

        /**
         * Indica si el docente está de licencia
         */
        @JsonProperty("docente_de_licencia")
        private boolean docenteDeLicencia = false;

        /**
         * Indica si el espacio curricular tiene docente asignado
         */
        @JsonProperty("tiene_docente_asignado")
        private boolean tieneDocenteAsignado = true;

        /**
         * Constructor por defecto.
         */
        public HoraEspacioCurricular() {
        }

        /**
         * Constructor sin indicación de licencia.
         *
         * @param hora la hora del espacio curricular
         * @param espacioCurricular el nombre del espacio curricular
         * @param division la división asignada
         * @param docente el docente asignado (puede ser null)
         */
        public HoraEspacioCurricular(int hora, String espacioCurricular, String division, String docente) {
            this.hora = hora;
            this.espacioCurricular = espacioCurricular;
            this.division = division;
            this.docente = docente;
            this.docenteDeLicencia = false;
            this.tieneDocenteAsignado = (docente != null);
        }

        /**
         * Constructor completo.
         *
         * @param hora la hora del espacio curricular
         * @param espacioCurricular el nombre del espacio curricular
         * @param division la división asignada
         * @param docente el docente asignado (puede ser null)
         * @param docenteDeLicencia indica si el docente está de licencia
         */
        public HoraEspacioCurricular(int hora, String espacioCurricular, String division, String docente, boolean docenteDeLicencia) {
            this.hora = hora;
            this.espacioCurricular = espacioCurricular;
            this.division = division;
            this.docente = docente;
            this.docenteDeLicencia = docenteDeLicencia;
            this.tieneDocenteAsignado = (docente != null);
        }

        /**
         * Obtiene la hora del espacio curricular.
         *
         * @return la hora del espacio curricular
         */
        public int getHora() {
            return hora;
        }

        /**
         * Establece la hora del espacio curricular.
         *
         * @param hora la hora del espacio curricular
         */
        public void setHora(int hora) {
            this.hora = hora;
        }

        /**
         * Obtiene el nombre del espacio curricular.
         *
         * @return el nombre del espacio curricular
         */
        public String getEspacioCurricular() {
            return espacioCurricular;
        }

        /**
         * Establece el nombre del espacio curricular.
         *
         * @param espacioCurricular el nombre del espacio curricular
         */
        public void setEspacioCurricular(String espacioCurricular) {
            this.espacioCurricular = espacioCurricular;
        }

        /**
         * Obtiene la división asignada.
         *
         * @return la división asignada
         */
        public String getDivision() {
            return division;
        }

        /**
         * Establece la división asignada.
         *
         * @param division la división asignada
         */
        public void setDivision(String division) {
            this.division = division;
        }

        /**
         * Obtiene el docente asignado.
         *
         * @return el docente asignado
         */
        public String getDocente() {
            return docente;
        }

        /**
         * Establece el docente asignado.
         *
         * @param docente el docente asignado
         */
        public void setDocente(String docente) {
            this.docente = docente;
        }

        /**
         * Indica si el docente está de licencia.
         *
         * @return true si el docente está de licencia, false en caso contrario
         */
        public boolean isDocenteDeLicencia() {
            return docenteDeLicencia;
        }

        /**
         * Establece si el docente está de licencia.
         *
         * @param docenteDeLicencia true si el docente está de licencia
         */
        public void setDocenteDeLicencia(boolean docenteDeLicencia) {
            this.docenteDeLicencia = docenteDeLicencia;
        }

        /**
         * Indica si el espacio curricular tiene docente asignado.
         *
         * @return true si tiene docente asignado, false en caso contrario
         */
        public boolean isTieneDocenteAsignado() {
            return tieneDocenteAsignado;
        }

        /**
         * Establece si el espacio curricular tiene docente asignado.
         *
         * @param tieneDocenteAsignado true si tiene docente asignado
         */
        public void setTieneDocenteAsignado(boolean tieneDocenteAsignado) {
            this.tieneDocenteAsignado = tieneDocenteAsignado;
        }
    }
}
