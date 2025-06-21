package unpsjb.labprog.backend.exception;

/**
 * Excepción especializada para operaciones de modificación no permitidas.
 *
 * <p>
 * Esta excepción se lanza cuando se intenta modificar una entidad que, debido a
 * su estado actual o restricciones de negocio, no puede ser alterada. Es común
 * en operaciones que intentan modificar registros que han sido procesados,
 * aprobados o que tienen dependencias que impiden su modificación.</p>
 *
 * <p>
 * Casos de uso típicos:</p>
 * <ul>
 * <li>Modificación de designaciones ya procesadas</li>
 * <li>Alteración de licencias en estado aprobado</li>
 * <li>Cambios en entidades con dependencias críticas</li>
 * <li>Operaciones sobre registros en estado final</li>
 * </ul>
 *
 * <p>
 * Al ser una excepción checked, obliga al código cliente a manejar
 * explícitamente este escenario de error.</p>
 *
 * @author Mariano Bonansea
 * @version 1.0
 * @since 1.0
 */
public class NotModifiableException extends Exception {

    /**
     * Constructor básico que crea una excepción con un mensaje descriptivo.
     *
     * @param message mensaje descriptivo que explica por qué la modificación no
     * está permitida
     */
    public NotModifiableException(String message) {
        super(message);
    }

    /**
     * Constructor que permite especificar tanto el mensaje como la causa
     * original del error.
     *
     * <p>
     * Útil para encadenar excepciones y mantener la trazabilidad del error
     * original.</p>
     *
     * @param message mensaje descriptivo que explica por qué la modificación no
     * está permitida
     * @param cause la excepción que causó este error
     */
    public NotModifiableException(String message, Throwable cause) {
        super(message, cause);
    }

}
