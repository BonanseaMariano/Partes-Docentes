package unpsjb.labprog.backend.business.validator.base;

import java.util.ArrayList;
import java.util.List;

import unpsjb.labprog.backend.exception.BusinessLogicException;

/**
 * Implementación del patrón Chain of Responsibility para validaciones
 * secuenciales.
 *
 * <p>
 * Esta clase permite ejecutar múltiples validadores en un orden específico,
 * proporcionando flexibilidad en el manejo de errores y configuración dinámica
 * de cadenas de validación.</p>
 *
 * <p>
 * Características principales:</p>
 * <ul>
 * <li>Ejecución secuencial de validadores con control de flujo</li>
 * <li>Opción de parar en el primer error o acumular todos los errores</li>
 * <li>Interfaz fluida para construcción de cadenas</li>
 * <li>Identificación de validadores para logging y debugging</li>
 * </ul>
 *
 * <p>
 * Modos de operación:</p>
 * <ul>
 * <li><strong>Fail-fast:</strong> Detiene la ejecución en el primer error</li>
 * <li><strong>Acumulativo:</strong> Ejecuta todos los validadores y reporta
 * todos los errores</li>
 * </ul>
 *
 * @param <T> tipo de entidad a validar
 * @author Mariano Bonansea
 * @version 1.0
 */
public class ValidationChain<T> {

    private final List<Validator<T>> validators;
    private final List<String> validatorNames;
    private boolean stopOnFirstError;

    /**
     * Constructor por defecto que inicializa la cadena en modo fail-fast.
     */
    public ValidationChain() {
        this.validators = new ArrayList<>();
        this.validatorNames = new ArrayList<>();
        this.stopOnFirstError = true; // Por defecto para en el primer error
    }

    /**
     * Constructor que permite especificar el comportamiento ante errores.
     *
     * @param stopOnFirstError true para modo fail-fast, false para modo
     * acumulativo
     */
    public ValidationChain(boolean stopOnFirstError) {
        this.validators = new ArrayList<>();
        this.validatorNames = new ArrayList<>();
        this.stopOnFirstError = stopOnFirstError;
    }

    /**
     * Añade un validador a la cadena con identificación para logging.
     *
     * <p>
     * Permite construir la cadena usando interfaz fluida y proporciona
     * identificación del validador para facilitar el debugging.</p>
     *
     * @param validator validador a añadir a la cadena
     * @param validatorName nombre identificativo del validador
     * @return la misma instancia para permitir método encadenado (fluent
     * interface)
     */
    public ValidationChain<T> addValidator(Validator<T> validator, String validatorName) {
        if (validator != null) {
            validators.add(validator);
            validatorNames.add(validatorName != null ? validatorName : "unknown");
        }
        return this;
    }

    /**
     * Ejecuta todos los validadores de la cadena en el orden configurado.
     *
     * <p>
     * El comportamiento depende de la configuración de
     * {@code stopOnFirstError}:</p>
     * <ul>
     * <li><strong>Modo fail-fast:</strong> Se detiene en el primer error</li>
     * <li><strong>Modo acumulativo:</strong> Ejecuta todos y reporta errores
     * agrupados</li>
     * </ul>
     *
     * @param entity entidad a validar
     * @throws BusinessLogicException si alguna validación falla
     */
    public void execute(T entity) throws BusinessLogicException {
        List<String> errors = new ArrayList<>();

        for (int i = 0; i < validators.size(); i++) {
            Validator<T> validator = validators.get(i);
            String validatorName = validatorNames.get(i);

            try {
                validator.validate(entity);
            } catch (BusinessLogicException e) {
                if (stopOnFirstError) {
                    throw e; // Para en el primer error
                } else {
                    errors.add(validatorName + ": " + e.getMessage());
                }
            }
        }

        // Si no para en el primer error y hay errores acumulados, lanzar excepción
        if (!stopOnFirstError && !errors.isEmpty()) {
            throw new BusinessLogicException("Errores de validación: " + String.join("; ", errors));
        }
    }

    /**
     * Obtiene una copia de la lista de validadores en la cadena.
     *
     * @return copia inmutable de la lista de validadores
     */
    public List<Validator<T>> getValidators() {
        return new ArrayList<>(validators);
    }

    /**
     * Obtiene una copia de la lista de nombres de validadores.
     *
     * @return copia inmutable de la lista de nombres
     */
    public List<String> getValidatorNames() {
        return new ArrayList<>(validatorNames);
    }

    /**
     * Elimina todos los validadores de la cadena, restaurando el estado
     * inicial.
     */
    public void clear() {
        validators.clear();
        validatorNames.clear();
    }

    /**
     * Obtiene el número de validadores configurados en la cadena.
     *
     * @return cantidad de validadores en la cadena
     */
    public int size() {
        return validators.size();
    }

    /**
     * Configura el comportamiento de la cadena ante errores de validación.
     *
     * @param stopOnFirstError true para modo fail-fast, false para modo
     * acumulativo
     */
    public void setStopOnFirstError(boolean stopOnFirstError) {
        this.stopOnFirstError = stopOnFirstError;
    }
}
