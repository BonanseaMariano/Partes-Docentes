package unpsjb.labprog.backend.model.enums;

/**
 * Enumeración que representa los días de la semana. Proporciona valores para
 * cada día con nombres legibles para mostrar en la interfaz.
 *
 * @author Mariano Bonansea
 * @version 1.0
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
     * Obtiene el nombre legible del día de la semana.
     *
     * @return nombre del día para mostrar en la interfaz
     */
    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
