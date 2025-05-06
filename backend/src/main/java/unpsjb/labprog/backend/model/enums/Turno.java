package unpsjb.labprog.backend.model.enums;

/**
 * Enum que representa los turnos posibles para una division
 */
public enum Turno {
    MANIANA("Mañana"),
    TARDE("Tarde"),
    VESPERTINO("Vespertino"),
    NOCHE("Noche");

    private final String valor;

    Turno(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }
}
