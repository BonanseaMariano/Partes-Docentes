package unpsjb.labprog.backend.model.enums;

/**
 * Enumeración que representa los tipos de designación disponibles en el
 * sistema. Distingue entre cargos administrativos y espacios curriculares de
 * enseñanza.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public enum TipoDesignacion {
    CARGO("Cargo"),
    ESPACIO_CURRICULAR("Espacio Curricular");

    private final String valor;

    TipoDesignacion(String valor) {
        this.valor = valor;
    }

    /**
     * Obtiene la representación textual del tipo de designación.
     *
     * @return valor del tipo de designación para mostrar en la interfaz
     */
    public String getValor() {
        return valor;
    }
}
