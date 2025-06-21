package unpsjb.labprog.backend.model.enums;

/**
 * Enumeración que representa los estados de validación de una licencia. Define
 * si una licencia cumple o no con las reglas de negocio establecidas.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public enum Estado {
    VALIDO("Válido"),
    INVALIDO("Inválido");

    private final String valor;

    Estado(String valor) {
        this.valor = valor;
    }

    /**
     * Obtiene la representación textual del estado.
     *
     * @return valor del estado para mostrar en la interfaz
     */
    public String getValor() {
        return valor;
    }
}
