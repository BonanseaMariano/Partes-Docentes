package unpsjb.labprog.backend.business.validator.base;

import java.util.HashMap;
import java.util.Map;

/**
 * Fábrica de validadores específica para cargos que utiliza reflexión
 * automática. Implementa el patrón Singleton y cache de instancias para
 * optimizar rendimiento.
 *
 * Convenciones de nomenclatura: - Para validador "fecha" busca clase:
 * unpsjb.labprog.backend.business.validator.cargo.validators.FechaValidator -
 * Para validador "tipodesignaciondivision" busca clase:
 * unpsjb.labprog.backend.business.validator.cargo.validators.TipodesignaciondivisionValidator
 */
public class CargoValidatorFactory {

    // Cache de instancias de validadores para evitar recrearlos
    private final Map<String, Validator<?>> validatorMap;

    // Singleton
    private static CargoValidatorFactory instance = null;

    private CargoValidatorFactory() {
        this.validatorMap = new HashMap<>();
    }

    public static CargoValidatorFactory getInstance() {
        if (instance == null) {
            instance = new CargoValidatorFactory();
        }
        return instance;
    }

    /**
     * Obtiene un validador por nombre. Si no está en cache, lo carga usando
     * reflexión.
     *
     * @param validatorName Nombre del validador (ej: "fecha",
     * "tipodesignaciondivision")
     * @return Instancia del validador o null si no se encuentra
     */
    @SuppressWarnings("unchecked")
    public <T> Validator<T> getValidator(String validatorName) {

        if (!validatorMap.containsKey(validatorName)) {

            // Construir nombre de clase siguiendo convenciones
            String name = "unpsjb.labprog.backend.business.validator.cargo.validators."
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
