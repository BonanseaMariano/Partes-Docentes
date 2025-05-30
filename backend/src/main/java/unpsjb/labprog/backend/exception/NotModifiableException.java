package unpsjb.labprog.backend.exception;

/**
 * Excepción personalizada para indicar que una entidad no puede ser modificada
 * debido a restricciones de negocio o estado. Se utiliza para señalar que una
 * operación de modificación no está permitida en el contexto actual.
 */
public class NotModifiableException extends Exception {

    /**
     * Constructor para la excepción con un mensaje descriptivo
     *
     * @param message mensaje descriptivo que explica el error de modificación
     */
    public NotModifiableException(String message) {
        super(message);
    }

    /**
     * Constructor para la excepción con un mensaje descriptivo y la causa
     * original
     *
     * @param message mensaje descriptivo que explica el error de modificación
     * @param cause causa original del error
     */
    public NotModifiableException(String message, Throwable cause) {
        super(message, cause);
    }

}
