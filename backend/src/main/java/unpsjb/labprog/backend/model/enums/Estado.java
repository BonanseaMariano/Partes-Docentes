package unpsjb.labprog.backend.model.enums;

/**
 * Enum que representa los estados posibles de una licencia
 */
public enum Estado {
    VALIDO("Válido"),
    INVALIDO("Inválido");

    private final String valor;

    Estado(String valor) {
        this.valor = valor;
    }

    /**
     * Método para obtener el valor del estado
     *
     * @return valor del estado
     */
    public String getValor() {
        return valor;
    }
}
