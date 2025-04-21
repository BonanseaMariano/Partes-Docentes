package unpsjb.labprog.backend.model.enums;

/**
 * Enum que representa los tipos de designación posibles
 */
public enum TipoDesignacion {
    CARGO("Cargo"),
    ESPACIO_CURRICULAR("Espacio Curricular");

    private String descripcion;

    private TipoDesignacion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}