package unpsjb.labprog.backend.exception;

/**
 * Excepción central para violaciones de reglas de negocio del sistema.
 *
 * <p>
 * Esta excepción se utiliza cuando una operación no puede completarse debido a
 * violaciones de reglas de negocio específicas de la aplicación. Es la
 * excepción principal utilizada por el sistema de validaciones y los servicios
 * de negocio para reportar errores funcionales.</p>
 *
 * <p>
 * Tipos de violaciones que maneja:</p>
 * <ul>
 * <li>Validaciones de licencias (límites de días, solapamientos, etc.)</li>
 * <li>Restricciones de designaciones (cargos incompatibles, períodos
 * inválidos)</li>
 * <li>Reglas de integridad entre entidades</li>
 * <li>Limitaciones temporales y de estado</li>
 * <li>Validaciones de datos específicas del dominio</li>
 * </ul>
 *
 * @author Mariano Bonansea
 * @version 1.0
 * @since 1.0
 */
public class BusinessLogicException extends Exception {

    /**
     * Constructor básico que crea una excepción con un mensaje descriptivo.
     *
     * <p>
     * Este constructor es el más utilizado en el sistema, especialmente en las
     * validaciones donde se proporciona un mensaje claro sobre qué regla de
     * negocio fue violada.</p>
     *
     * @param message mensaje descriptivo que explica la violación de regla de
     * negocio
     */
    public BusinessLogicException(String message) {
        super(message);
    }

    /**
     * Constructor que permite especificar tanto el mensaje como la causa
     * original del error.
     *
     * <p>
     * Útil para encadenar excepciones cuando una violación de negocio es
     * causada por un error técnico subyacente, manteniendo la trazabilidad
     * completa.</p>
     *
     * @param message mensaje descriptivo que explica la violación de regla de
     * negocio
     * @param cause la excepción que causó este error de negocio
     */
    public BusinessLogicException(String message, Throwable cause) {
        super(message, cause);
    }
}
