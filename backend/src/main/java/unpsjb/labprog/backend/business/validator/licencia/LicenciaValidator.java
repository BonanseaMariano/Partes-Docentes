package unpsjb.labprog.backend.business.validator.licencia;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.validator.base.ValidationChain;
import unpsjb.labprog.backend.business.validator.config.ValidationConfigLoader;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador principal para licencias que utiliza el patrón Command combinado
 * con Chain of Responsibility para ejecutar validaciones configurables. Permite
 * configurar el orden de validaciones dinámicamente sin recompilar, usando
 * archivos de configuración externos.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Component
public class LicenciaValidator {

    /**
     * Cargador de configuraciones de validación
     */
    @Autowired
    private ValidationConfigLoader configLoader;

    /**
     * Valida todas las reglas de negocio específicas para las licencias usando
     * el patrón Command con configuración dinámica. La cadena de validaciones
     * se construye basándose en la configuración externa.
     *
     * @param licencia la licencia a validar
     * @throws BusinessLogicException si no se cumplen las reglas de negocio
     */
    public void validar(Licencia licencia) throws BusinessLogicException {
        // Construir cadena de validación basada en configuración
        ValidationChain<Licencia> validationChain = configLoader.buildLicenciaValidationChain();

        // Ejecutar todas las validaciones en orden configurado
        validationChain.execute(licencia);
    }

    /**
     * Permite actualizar la configuración de validaciones en caliente sin
     * necesidad de reiniciar la aplicación.
     *
     * @param newOrderConfig nueva configuración del orden (ej:
     * "fecha,solapamiento,articulo")
     * @param stopOnFirstError si debe parar en el primer error encontrado
     */
    public void updateValidationConfiguration(String newOrderConfig, boolean stopOnFirstError) {
        configLoader.updateConfiguration(newOrderConfig, stopOnFirstError);
    }

    /**
     * Obtiene la lista de validaciones disponibles en el sistema.
     *
     * @return lista de nombres de validaciones disponibles
     */
    public java.util.List<String> getAvailableValidations() {
        return configLoader.getAvailableValidations();
    }
}
