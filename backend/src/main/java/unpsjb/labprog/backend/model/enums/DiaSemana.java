package unpsjb.labprog.backend.model.enums;

/**
 * Enumeration que representa los días de la semana.
 */
public enum DiaSemana {
    LUNES("Lunes"),
    MARTES("Martes"),
    MIERCOLES("Miércoles"),
    JUEVES("Jueves"),
    VIERNES("Viernes"),
    SABADO("Sábado"),
    DOMINGO("Domingo");

    private final String displayName;

    DiaSemana(String displayName) {
        this.displayName = displayName;
    }

    /**
     * Obtiene el nombre para mostrar del día de la semana.
     * 
     * @return Nombre del día para mostrar
     */
    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}