package unpsjb.labprog.backend.business.validator.articulos;

import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Interfaz para validadores específicos de artículos de licencia.
 * Cada implementación validará las reglas específicas de un artículo.
 */
public interface ArticuloLicenciaValidator {
    /**
     * Código del artículo que puede validar este validador
     */
    String getArticuloCode();

    /**
     * Valida las reglas específicas para un artículo de licencia
     * 
     * @param licencia Licencia a validar
     * @throws BusinessLogicException si no cumple con las reglas del artículo
     */
    void validar(Licencia licencia) throws BusinessLogicException;
}
