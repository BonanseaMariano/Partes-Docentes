package unpsjb.labprog.backend.exception;

/**
 * Excepción personalizada para errores de lógica de negocio
 * Se utiliza para indicar que una operación no puede completarse porque
 * viola alguna regla de negocio específica de la aplicación.
 */
public class BusinessLogicException extends Exception {

    /**
     * Constructor para la excepción con un mensaje descriptivo
     * 
     * @param message mensaje descriptivo que explica el error de lógica de negocio
     */
    public BusinessLogicException(String message) {
        super(message);
    }

    /**
     * Constructor para la excepción con un mensaje descriptivo y la causa original
     * 
     * @param message mensaje descriptivo que explica el error de lógica de negocio
     * @param cause   causa original del error
     */
    public BusinessLogicException(String message, Throwable cause) {
        super(message, cause);
    }
}