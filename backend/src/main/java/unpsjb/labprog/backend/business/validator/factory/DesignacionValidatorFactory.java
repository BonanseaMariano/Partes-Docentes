package unpsjb.labprog.backend.business.validator.factory;

import java.util.HashMap;
import java.util.Map;

import unpsjb.labprog.backend.business.validator.base.Validator;

/**
 * Fábrica de validadores específica para designaciones que utiliza reflexión
 * automática para cargar validadores dinámicamente. Implementa el patrón
 * Singleton y cache de instancias para optimizar rendimiento.
 *
 * <p>
 * Convenciones de nomenclatura:</p>
 * <ul>
 * <li>Para validador "fecha" busca clase:
 * {@code unpsjb.labprog.backend.business.validator.designacion.validators.FechaValidator}</li>
 * <li>Para validador "solapamiento" busca clase:
 * {@code unpsjb.labprog.backend.business.validator.designacion.validators.SolapamientoValidator}</li>
 * </ul>
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public class DesignacionValidatorFactory {

    /**
     * Cache de instancias de validadores para evitar recrearlos
     */
    private final Map<String, Validator<?>> validatorMap;

    /**
     * Instancia única de la fábrica (patrón Singleton)
     */
    private static DesignacionValidatorFactory instance = null;

    /**
     * Constructor privado para implementar el patrón Singleton.
     */
    private DesignacionValidatorFactory() {
        this.validatorMap = new HashMap<>();
    }

    /**
     * Obtiene la instancia única de la fábrica de validadores de designación.
     *
     * @return la instancia única de la fábrica
     */
    public static DesignacionValidatorFactory getInstance() {
        if (instance == null) {
            instance = new DesignacionValidatorFactory();
        }
        return instance;
    }

    /**
     * Obtiene un validador por nombre. Si no está en cache, lo carga usando
     * reflexión siguiendo las convenciones de nomenclatura.
     *
     * @param <T> el tipo de entidad que validará el validador
     * @param validatorName el nombre del validador (ej: "fecha",
     * "solapamiento")
     * @return la instancia del validador o null si no se encuentra
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
     * Capitaliza la primera letra de una cadena.
     *
     * @param str la cadena a capitalizar
     * @return la cadena con la primera letra en mayúscula
     */
    private String capitalizeFirst(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    /**
     * Limpia el cache de validadores. Útil para testing y reinicios del
     * sistema.
     */
    public void clearCache() {
        validatorMap.clear();
    }
}
