package unpsjb.labprog.backend.business.validator.factory;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import unpsjb.labprog.backend.business.validator.base.Validator;

/**
 * Fábrica de validadores específica para licencias que utiliza reflexión
 * automática para cargar validadores dinámicamente. Implementa el patrón
 * Singleton y cache de instancias para optimizar rendimiento.
 *
 * <p>
 * Convenciones de nomenclatura:</p>
 * <ul>
 * <li>Para validador "solapamiento" busca clase:
 * {@code unpsjb.labprog.backend.business.validator.licencia.validators.SolapamientoValidator}</li>
 * <li>Para validador "designaciones" busca clase:
 * {@code unpsjb.labprog.backend.business.validator.licencia.validators.DesignacionesValidator}</li>
 * <li>Para validador "articulo5a" busca clase:
 * {@code unpsjb.labprog.backend.business.validator.licencia.validators.Articulo5aValidator}</li>
 * </ul>
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public class LicenciaValidatorFactory {

    /**
     * Logger para seguimiento de operaciones
     */
    private static final Logger log = LoggerFactory.getLogger(LicenciaValidatorFactory.class);

    /**
     * Cache de instancias de validadores para evitar recrearlos
     */
    private final Map<String, Validator<?>> validatorMap;

    /**
     * Instancia única de la fábrica (patrón Singleton)
     */
    private static LicenciaValidatorFactory instance = null;

    /**
     * Constructor privado para implementar el patrón Singleton.
     */
    private LicenciaValidatorFactory() {
        validatorMap = new HashMap<>();
    }

    /**
     * Obtiene la instancia única de la fábrica de validadores de licencia.
     *
     * @return la instancia única de la fábrica
     */
    public static LicenciaValidatorFactory getInstance() {
        if (instance == null) {
            instance = new LicenciaValidatorFactory();
        }
        return instance;
    }

    /**
     * Obtiene un validador por nombre. Si no está en cache, lo carga usando
     * reflexión siguiendo las convenciones de nomenclatura.
     *
     * @param <T> el tipo de entidad que validará el validador
     * @param validatorName el nombre del validador (ej: "solapamiento",
     * "designaciones", "articulo5a")
     * @return la instancia del validador o null si no se encuentra
     */
    @SuppressWarnings("unchecked")
    public <T> Validator<T> getValidator(String validatorName) {

        if (!validatorMap.containsKey(validatorName)) {

            // Construir nombre de clase siguiendo convenciones
            String name = "unpsjb.labprog.backend.business.validator.licencia.validators."
                    + capitalizeFirst(validatorName.toLowerCase()) + "Validator";

            try {

                Class<?> validatorClass = Class.forName(name);
                Validator<T> validatorInstance = (Validator<T>) validatorClass.getMethod("getInstance").invoke(null);
                validatorMap.put(validatorName, validatorInstance);

                log.debug("Validador cargado exitosamente: {} -> {}", validatorName, name);

            } catch (ClassNotFoundException cnfe) {
                log.warn("No se encontró la clase validador: {}", name);
                return null;
            } catch (NoSuchMethodException nsme) {
                log.error("La clase {} no implementa el método getInstance", name);
                return null;
            } catch (IllegalAccessException | java.lang.reflect.InvocationTargetException e) {
                log.error("Error invocando el método getInstance de la clase {}: {}", name, e.getMessage());
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
        log.debug("Limpiando cache de validadores");
        validatorMap.clear();
    }
}
