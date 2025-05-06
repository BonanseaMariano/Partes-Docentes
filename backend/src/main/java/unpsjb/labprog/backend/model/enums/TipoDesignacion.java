package unpsjb.labprog.backend.model.enums;

/**
 * Enum que representa los tipos de designación posibles
 */
public enum TipoDesignacion {
    CARGO("Cargo"),
    ESPACIO_CURRICULAR("Espacio Curricular");

    private final String valor;

    TipoDesignacion(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }
}