package unpsjb.labprog.backend.business.validator.base;

import java.util.ArrayList;
import java.util.List;

import unpsjb.labprog.backend.exception.BusinessLogicException;

/**
 * Cadena de validadores que ejecuta múltiples validaciones en el orden
 * especificado. Implementa el patrón Chain of Responsibility usando
 * directamente los Validators. Simplificado para eliminar la capa innecesaria
 * de ValidationCommands.
 */
public class ValidationChain<T> {

    private final List<Validator<T>> validators;
    private final List<String> validatorNames;
    private boolean stopOnFirstError;

    public ValidationChain() {
        this.validators = new ArrayList<>();
        this.validatorNames = new ArrayList<>();
        this.stopOnFirstError = true; // Por defecto para en el primer error
    }

    public ValidationChain(boolean stopOnFirstError) {
        this.validators = new ArrayList<>();
        this.validatorNames = new ArrayList<>();
        this.stopOnFirstError = stopOnFirstError;
    }

    /**
     * Añade un validador a la cadena con su nombre para identificación.
     *
     * @param validator Validador a añadir
     * @param validatorName Nombre del validador para logging
     * @return La misma instancia para permitir fluent interface
     */
    public ValidationChain<T> addValidator(Validator<T> validator, String validatorName) {
        if (validator != null) {
            validators.add(validator);
            validatorNames.add(validatorName != null ? validatorName : "unknown");
        }
        return this;
    }

    /**
     * Ejecuta todos los validadores en orden.
     *
     * @param entity Entidad a validar
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
     * Obtiene la lista de validadores en la cadena.
     *
     * @return Lista de validadores
     */
    public List<Validator<T>> getValidators() {
        return new ArrayList<>(validators);
    }

    /**
     * Obtiene la lista de nombres de validadores.
     *
     * @return Lista de nombres
     */
    public List<String> getValidatorNames() {
        return new ArrayList<>(validatorNames);
    }

    /**
     * Limpia todos los validadores de la cadena.
     */
    public void clear() {
        validators.clear();
        validatorNames.clear();
    }

    /**
     * Obtiene el número de validadores en la cadena.
     *
     * @return Número de validadores
     */
    public int size() {
        return validators.size();
    }

    /**
     * Configura si debe parar en el primer error o acumular todos los errores.
     *
     * @param stopOnFirstError true para parar en el primer error, false para
     * acumular
     */
    public void setStopOnFirstError(boolean stopOnFirstError) {
        this.stopOnFirstError = stopOnFirstError;
    }
}
