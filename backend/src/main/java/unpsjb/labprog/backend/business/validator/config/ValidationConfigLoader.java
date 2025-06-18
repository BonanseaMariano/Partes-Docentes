package unpsjb.labprog.backend.business.validator.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.validator.base.GenericFechaValidator;
import unpsjb.labprog.backend.business.validator.base.ValidationChain;
import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.factory.LicenciaValidatorFactory;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Cargador de configuración para cadenas de validación. Permite configurar el
 * orden y tipos de validaciones desde archivos de propiedades. Usa directamente
 * los Validators sin capa intermedia de Commands. SIMPLIFICADO: Elimina la capa
 * innecesaria de ValidationCommands.
 */
@Component
public class ValidationConfigLoader {

    private static final Logger logger = LoggerFactory.getLogger(ValidationConfigLoader.class);

    private static final String CONFIG_FILE = "validation-config.properties";
    private static final String LICENCIA_VALIDATION_ORDER_KEY = "licencia.validation.order";
    private static final String LICENCIA_STOP_ON_ERROR_KEY = "licencia.validation.stopOnFirstError";

    // Configuración por defecto si no existe archivo de configuración
    private static final String DEFAULT_VALIDATION_ORDER = "fecha,designaciones,solapamiento,articulo";
    private static final boolean DEFAULT_STOP_ON_ERROR = true;

    // Cache de validadores para evitar recrearlos
    private final Map<String, Validator<Licencia>> validatorCache;

    private Properties validationConfig;
    private long lastModified = 0;

    public ValidationConfigLoader() {
        this.validatorCache = new HashMap<>();
        loadConfiguration();
    }

    /**
     * Carga la configuración de validaciones desde el archivo de propiedades.
     */
    private void loadConfiguration() {
        validationConfig = new Properties();

        try {
            ClassPathResource resource = new ClassPathResource(CONFIG_FILE);
            if (resource.exists()) {
                try (InputStream is = resource.getInputStream()) {
                    validationConfig.load(is);
                    lastModified = System.currentTimeMillis();
                    logger.info("Configuración de validaciones cargada desde: {}", CONFIG_FILE);
                }
            } else {
                // Usar configuración por defecto
                setDefaultConfiguration();
                logger.info("Usando configuración de validaciones por defecto");
            }
        } catch (IOException e) {
            logger.error("Error cargando configuración de validaciones: {}", e.getMessage());
            setDefaultConfiguration();
        }
    }

    /**
     * Establece la configuración por defecto.
     */
    private void setDefaultConfiguration() {
        validationConfig.setProperty(LICENCIA_VALIDATION_ORDER_KEY, DEFAULT_VALIDATION_ORDER);
        validationConfig.setProperty(LICENCIA_STOP_ON_ERROR_KEY, String.valueOf(DEFAULT_STOP_ON_ERROR));
    }

    /**
     * Recarga la configuración si el archivo ha sido modificado.
     */
    public void reloadIfNeeded() {
        try {
            ClassPathResource resource = new ClassPathResource(CONFIG_FILE);
            if (resource.exists()) {
                long currentModified = resource.getFile().lastModified();
                if (currentModified > lastModified) {
                    loadConfiguration();
                    logger.info("Configuración de validaciones recargada automáticamente");
                }
            }
        } catch (IOException e) {
            // No hacer nada, mantener configuración actual
        }
    }

    /**
     * Construye una cadena de validación para licencias basada en la
     * configuración. SIMPLIFICADO: Usa directamente los Validators sin Commands
     * intermedios.
     *
     * @return Cadena de validación configurada
     */
    public ValidationChain<Licencia> buildLicenciaValidationChain() {
        reloadIfNeeded(); // Recargar configuración si es necesario

        String orderConfig = validationConfig.getProperty(LICENCIA_VALIDATION_ORDER_KEY, DEFAULT_VALIDATION_ORDER);
        boolean stopOnError = "true".equals(
                validationConfig.getProperty(LICENCIA_STOP_ON_ERROR_KEY, String.valueOf(DEFAULT_STOP_ON_ERROR))
        );

        ValidationChain<Licencia> chain = new ValidationChain<>(stopOnError);

        // Parsear orden de validaciones
        List<String> validationOrder = Arrays.asList(orderConfig.split(","));

        for (String validationName : validationOrder) {
            String trimmedName = validationName.trim();
            if (!trimmedName.isEmpty()) {
                Validator<Licencia> validator = createValidator(trimmedName);
                if (validator != null) {
                    chain.addValidator(validator, trimmedName);
                } else {
                    logger.warn("No se pudo crear el validador: {}", trimmedName);
                }
            }
        }

        return chain;
    }

    /**
     * Crea un validador por nombre usando el factory existente y
     * GenericFechaValidator. SIMPLIFICADO: Usa directamente los Validators sin
     * reflexión compleja.
     *
     * @param validatorName Nombre del validador a crear (ej: "fecha",
     * "designaciones", "limitedias")
     * @return Instancia del validador o null si no se encuentra
     */
    private Validator<Licencia> createValidator(String validatorName) {
        if (validatorName == null || validatorName.trim().isEmpty()) {
            return null;
        }

        String normalizedName = validatorName.toLowerCase().trim();

        // Buscar en cache primero
        if (validatorCache.containsKey(normalizedName)) {
            return validatorCache.get(normalizedName);
        }

        // Casos especiales
        if ("fecha".equals(normalizedName) || "fechas".equals(normalizedName)) {
            Validator<Licencia> validator = GenericFechaValidator.getInstance();
            validatorCache.put(normalizedName, validator);
            logger.debug("Validador cargado: '{}' → {}", normalizedName, validator.getClass().getSimpleName());
            return validator;
        } else if ("articulo".equals(normalizedName) || "articulos".equals(normalizedName)) {
            // Crear validador especial para artículos que delega al validador específico
            Validator<Licencia> validator = new ArticuloDynamicValidator();
            validatorCache.put(normalizedName, validator);
            logger.debug("Validador cargado: '{}' → ArticuloDynamicValidator", normalizedName);
            return validator;
        } else {
            // Usar LicenciaValidatorFactory para el resto
            Validator<Licencia> validator = LicenciaValidatorFactory.getInstance().getValidator(normalizedName);
            if (validator != null) {
                validatorCache.put(normalizedName, validator);
                logger.debug("Validador cargado: '{}' → {}", normalizedName, validator.getClass().getSimpleName());
            } else {
                logger.warn("No se encontró validador para: {}", normalizedName);
            }
            return validator;
        }
    }

    /**
     * Validador dinámico para artículos que determina el validador específico
     * basado en el artículo de la licencia (5a, 23a, 36a, etc.).
     */
    private static class ArticuloDynamicValidator implements Validator<Licencia> {

        @Override
        public void validate(Licencia licencia) throws BusinessLogicException {
            if (licencia.getArticuloLicencia() == null || licencia.getArticuloLicencia().getArticulo() == null) {
                throw new BusinessLogicException("No se puede validar: licencia sin artículo definido");
            }

            String articuloCode = licencia.getArticuloLicencia().getArticulo().toLowerCase();
            Validator<Licencia> articuloValidator = LicenciaValidatorFactory.getInstance().getValidator("articulo" + articuloCode);

            if (articuloValidator != null) {
                articuloValidator.validate(licencia);
            } else {
                // Solo log de warning, no error - podría ser un artículo sin validaciones específicas
                LoggerFactory.getLogger(ValidationConfigLoader.class)
                        .warn("No se encontró validador específico para artículo: {}", articuloCode);
            }
        }
    }

    /**
     * Obtiene la configuración actual de validaciones.
     *
     * @return Properties con la configuración
     */
    public Properties getValidationConfig() {
        return new Properties(validationConfig);
    }

    /**
     * Actualiza la configuración de validaciones en caliente.
     *
     * @param newOrderConfig Nueva configuración del orden de validaciones
     * @param stopOnFirstError Si debe parar en el primer error
     */
    public void updateConfiguration(String newOrderConfig, boolean stopOnFirstError) {
        if (newOrderConfig != null && !newOrderConfig.trim().isEmpty()) {
            validationConfig.setProperty(LICENCIA_VALIDATION_ORDER_KEY, newOrderConfig.trim());
        }
        validationConfig.setProperty(LICENCIA_STOP_ON_ERROR_KEY, String.valueOf(stopOnFirstError));

        logger.info("Configuración de validaciones actualizada en caliente: {}", newOrderConfig);
    }

    /**
     * Obtiene las validaciones disponibles actualmente en cache.
     *
     * @return Lista de nombres de validaciones disponibles
     */
    public List<String> getAvailableValidations() {
        return Arrays.asList(validatorCache.keySet().toArray(String[]::new));
    }
}
