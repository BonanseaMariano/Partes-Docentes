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
import unpsjb.labprog.backend.business.validator.factory.CargoValidatorFactory;
import unpsjb.labprog.backend.business.validator.factory.DesignacionValidatorFactory;
import unpsjb.labprog.backend.business.validator.factory.LicenciaValidatorFactory;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Cargador de configuración para cadenas de validación. Permite configurar el
 * orden y tipos de validaciones desde archivos de propiedades. Usa directamente
 * los Validators sin capa intermedia de Commands.
 *
 * REQUERIMIENTO: El archivo validation-config.properties DEBE existir en
 * src/main/resources/ y contener TODA la configuración necesaria. No hay
 * configuración por defecto.
 *
 * Configuración requerida: - licencia.validation.order -
 * designacion.validation.order - cargo.validation.order
 *
 * Configuración opcional (por defecto "true"): -
 * licencia.validation.stopOnFirstError -
 * designacion.validation.stopOnFirstError - cargo.validation.stopOnFirstError
 */
@Component
public class ValidationConfigLoader {

    private static final Logger logger = LoggerFactory.getLogger(ValidationConfigLoader.class);

    private static final String CONFIG_FILE = "validation-config.properties";

    // Claves de configuración para LICENCIAS
    private static final String LICENCIA_VALIDATION_ORDER_KEY = "licencia.validation.order";
    private static final String LICENCIA_STOP_ON_ERROR_KEY = "licencia.validation.stopOnFirstError";

    // Claves de configuración para DESIGNACIONES
    private static final String DESIGNACION_VALIDATION_ORDER_KEY = "designacion.validation.order";
    private static final String DESIGNACION_STOP_ON_ERROR_KEY = "designacion.validation.stopOnFirstError";

    // Claves de configuración para CARGOS
    private static final String CARGO_VALIDATION_ORDER_KEY = "cargo.validation.order";
    private static final String CARGO_STOP_ON_ERROR_KEY = "cargo.validation.stopOnFirstError";

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
     * REQUERIDO: El archivo validation-config.properties debe existir y
     * contener toda la configuración.
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
                logger.error("ARCHIVO REQUERIDO NO ENCONTRADO: {}. Las validaciones no funcionarán.", CONFIG_FILE);
                throw new IllegalStateException("Archivo de configuración requerido no encontrado: " + CONFIG_FILE);
            }
        } catch (IOException e) {
            logger.error("Error cargando configuración de validaciones: {}", e.getMessage());
            throw new IllegalStateException("Error cargando configuración de validaciones", e);
        }
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

        String orderConfig = validationConfig.getProperty(LICENCIA_VALIDATION_ORDER_KEY);
        if (orderConfig == null || orderConfig.trim().isEmpty()) {
            throw new IllegalStateException("Configuración requerida no encontrada: " + LICENCIA_VALIDATION_ORDER_KEY);
        }

        boolean stopOnError = "true".equals(validationConfig.getProperty(LICENCIA_STOP_ON_ERROR_KEY, "true"));

        ValidationChain<Licencia> chain = new ValidationChain<>(stopOnError);

        // Parsear orden de validaciones
        List<String> validationOrder = Arrays.asList(orderConfig.split(","));

        for (String validationName : validationOrder) {
            String trimmedName = validationName.trim();
            if (!trimmedName.isEmpty()) {
                Validator<Licencia> validator = createLicenciaValidator(trimmedName);
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
     * Crea un validador de licencias por nombre usando el factory existente y
     * GenericFechaValidator. SIMPLIFICADO: Usa directamente los Validators sin
     * reflexión compleja.
     *
     * @param validatorName Nombre del validador a crear (ej: "fecha",
     * "designaciones", "limitedias")
     * @return Instancia del validador o null si no se encuentra
     */
    private Validator<Licencia> createLicenciaValidator(String validatorName) {
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

    /**
     * Construye una cadena de validación para designaciones basada en la
     * configuración. NUEVO: Soporte para validaciones configurables de
     * designaciones.
     *
     * @return Cadena de validación configurada para designaciones
     */
    public ValidationChain<Designacion> buildDesignacionValidationChain() {
        reloadIfNeeded(); // Recargar configuración si es necesario

        String orderConfig = validationConfig.getProperty(DESIGNACION_VALIDATION_ORDER_KEY);
        if (orderConfig == null || orderConfig.trim().isEmpty()) {
            throw new IllegalStateException("Configuración requerida no encontrada: " + DESIGNACION_VALIDATION_ORDER_KEY);
        }

        boolean stopOnError = "true".equals(validationConfig.getProperty(DESIGNACION_STOP_ON_ERROR_KEY, "true"));

        ValidationChain<Designacion> chain = new ValidationChain<>(stopOnError);

        // Parsear orden de validaciones
        List<String> validationOrder = Arrays.asList(orderConfig.split(","));

        for (String validationName : validationOrder) {
            String trimmedName = validationName.trim();
            if (!trimmedName.isEmpty()) {
                Validator<Designacion> validator = createDesignacionValidator(trimmedName);
                if (validator != null) {
                    chain.addValidator(validator, trimmedName);
                } else {
                    logger.warn("No se pudo crear el validador de designación: {}", trimmedName);
                }
            }
        }

        return chain;
    }

    /**
     * Crea un validador de designaciones por nombre usando el
     * DesignacionValidatorFactory.
     *
     * @param validatorName Nombre del validador a crear (ej: "solapamiento",
     * "cargo")
     * @return Instancia del validador o null si no se encuentra
     */
    private Validator<Designacion> createDesignacionValidator(String validatorName) {
        if (validatorName == null || validatorName.trim().isEmpty()) {
            return null;
        }

        String normalizedName = validatorName.toLowerCase().trim();

        // Usar DesignacionValidatorFactory para todos los casos
        Validator<Designacion> validator = DesignacionValidatorFactory.getInstance().getValidator(normalizedName);

        if (validator != null) {
            logger.debug("Validador de designación cargado: '{}' → {}", normalizedName, validator.getClass().getSimpleName());
        } else {
            logger.warn("No se encontró validador de designación para: {}", normalizedName);
        }

        return validator;
    }

    /**
     * Construye una cadena de validación para cargos basada en la
     * configuración. NUEVO: Soporte para validaciones configurables de cargos.
     *
     * @return Cadena de validación configurada para cargos
     */
    public ValidationChain<Cargo> buildCargoValidationChain() {
        reloadIfNeeded(); // Recargar configuración si es necesario

        String orderConfig = validationConfig.getProperty(CARGO_VALIDATION_ORDER_KEY);
        if (orderConfig == null || orderConfig.trim().isEmpty()) {
            throw new IllegalStateException("Configuración requerida no encontrada: " + CARGO_VALIDATION_ORDER_KEY);
        }

        boolean stopOnError = "true".equals(validationConfig.getProperty(CARGO_STOP_ON_ERROR_KEY, "true"));

        ValidationChain<Cargo> chain = new ValidationChain<>(stopOnError);

        // Parsear orden de validaciones
        List<String> validationOrder = Arrays.asList(orderConfig.split(","));

        for (String validationName : validationOrder) {
            String trimmedName = validationName.trim();
            if (!trimmedName.isEmpty()) {
                Validator<Cargo> validator = createCargoValidator(trimmedName);
                if (validator != null) {
                    chain.addValidator(validator, trimmedName);
                } else {
                    logger.warn("No se pudo crear el validador de cargo: {}", trimmedName);
                }
            }
        }

        return chain;
    }

    /**
     * Crea un validador de cargos por nombre usando el CargoValidatorFactory.
     *
     * @param validatorName Nombre del validador a crear (ej: "nombre",
     * "division")
     * @return Instancia del validador o null si no se encuentra
     */
    private Validator<Cargo> createCargoValidator(String validatorName) {
        if (validatorName == null || validatorName.trim().isEmpty()) {
            return null;
        }

        String normalizedName = validatorName.toLowerCase().trim();

        // Usar CargoValidatorFactory para todos los casos
        Validator<Cargo> validator = CargoValidatorFactory.getInstance().getValidator(normalizedName);

        if (validator != null) {
            logger.debug("Validador de cargo cargado: '{}' → {}", normalizedName, validator.getClass().getSimpleName());
        } else {
            logger.warn("No se encontró validador de cargo para: {}", normalizedName);
        }

        return validator;
    }
}
