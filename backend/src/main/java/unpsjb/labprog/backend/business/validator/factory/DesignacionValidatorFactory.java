package unpsjb.labprog.backend.business.validator.factory;

import java.util.HashMap;
import java.util.Map;

import unpsjb.labprog.backend.business.validator.base.Validator;

/**
 * Fábrica de validadores específica para designaciones que utiliza reflexión
 * automática. Implementa el patrón Singleton y cache de instancias para
 * optimizar rendimiento.
 *
 * Convenciones de nomenclatura: - Para validador "fecha" busca clase:
 * unpsjb.labprog.backend.business.validator.designacion.validators.FechaValidator
 * - Para validador "solapamiento" busca clase:
 * unpsjb.labprog.backend.business.validator.designacion.validators.SolapamientoValidator
 */
public class DesignacionValidatorFactory {

    // Cache de instancias de validadores para evitar recrearlos
    private final Map<String, Validator<?>> validatorMap;

    // Singleton
    private static DesignacionValidatorFactory instance = null;

    private DesignacionValidatorFactory() {
        this.validatorMap = new HashMap<>();
    }

    public static DesignacionValidatorFactory getInstance() {
        if (instance == null) {
            instance = new DesignacionValidatorFactory();
        }
        return instance;
    }

    /**
     * Obtiene un validador por nombre. Si no está en cache, lo carga usando
     * reflexión.
     *
     * @param validatorName Nombre del validador (ej: "fecha", "solapamiento")
     * @return Instancia del validador o null si no se encuentra
     */
    @SuppressWarnings("unchecked")
    public <T> Validator<T> getValidator(String validatorName) {

        if (!validatorMap.containsKey(validatorName)) {

            // Construir nombre de clase siguiendo convenciones
            String name = "unpsjb.labprog.backend.business.validator.designacion.validators."
                    + capitalizeFirst(validatorName.toLowerCase()) + "Validator";

            try {

                Class<?> validatorClass = Class.forName(name);
                Validator<T> validatorInstance = (Validator<T>) validatorClass.getMethod("getInstance").invoke(null);
                validatorMap.put(validatorName, validatorInstance);

            } catch (ClassNotFoundException | NoSuchMethodException | IllegalAccessException
                    | java.lang.reflect.InvocationTargetException e) {
                // Manejar errores de reflexión - el validador no existe o no es un singleton válido
                return null;
            }
        }

        return (Validator<T>) validatorMap.get(validatorName);
    }

    /**
     * Capitaliza la primera letra de una cadena
     */
    private String capitalizeFirst(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    /**
     * Limpia el cache de validadores (útil para testing)
     */
    public void clearCache() {
        validatorMap.clear();
    }
}
