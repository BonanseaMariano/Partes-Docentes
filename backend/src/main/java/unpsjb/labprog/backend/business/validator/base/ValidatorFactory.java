package unpsjb.labprog.backend.business.validator.base;

import java.util.HashMap;
import java.util.Map;

/**
 * Fábrica de validadores que utiliza reflexión automática para cargar validadores bajo demanda.
 * Implementa el patrón Singleton y cache de instancias para optimizar rendimiento.
 * 
 * Convenciones de nomenclatura:
 * - Para validador "solapamiento" busca clase: unpsjb.labprog.backend.business.validator.licencia.validators.SolapamientoValidator
 * - Para validador "designaciones" busca clase: unpsjb.labprog.backend.business.validator.licencia.validators.DesignacionesValidator
 * - Para validador "articulo5a" busca clase: unpsjb.labprog.backend.business.validator.licencia.validators.Articulo5aValidator
 */
public class ValidatorFactory {

    // Cache de instancias de validadores para evitar recrearlos
    private Map<String, Validator<?>> validatorMap;

    // Singleton
    private static ValidatorFactory instance = null;

    private ValidatorFactory() {
        validatorMap = new HashMap<>();
    }

    public static ValidatorFactory getInstance() {
        if (instance == null)
            instance = new ValidatorFactory();
        return instance;        
    }

    /**
     * Obtiene un validador por nombre. Si no está en cache, lo carga usando reflexión.
     * 
     * @param validatorName Nombre del validador (ej: "solapamiento", "designaciones", "articulo5a")
     * @return Instancia del validador o null si no se encuentra
     */
    @SuppressWarnings("unchecked")
    public <T> Validator<T> getValidator(String validatorName) {
        
        if (!validatorMap.containsKey(validatorName)) {
            
            // Construir nombre de clase siguiendo convenciones
            String name = "unpsjb.labprog.backend.business.validator.licencia.validators." + 
                         capitalizeFirst(validatorName.toLowerCase()) + "Validator";
            
            try {
                
                Class<?> validatorClass = Class.forName(name);                
                Validator<T> validatorInstance = (Validator<T>) validatorClass.getMethod("getInstance").invoke(null);
                validatorMap.put(validatorName, validatorInstance);

            } catch (ClassNotFoundException cnfe) {
                System.err.println("No se encontró la clase: " + name);
                return null;
            } catch (NoSuchMethodException nsme) {
                System.err.println("La clase " + name + " no implementa el método getInstance.");
                return null;
            } catch (Exception e) {
                System.err.println("Ocurrió un error invocando el método getInstance de la clase " + name + ": " + e.getMessage());
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
