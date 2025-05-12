package unpsjb.labprog.backend.business.validator;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

@Component
public class LicenciaValidator {

    /**
     * Valida todas las reglas de negocio específicas para las licencias
     * 
     * @param licencia Licencia a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    public void validar(Licencia licencia) throws BusinessLogicException {
        // TODO: Implementar validaciones específicas para Licencia
    }
}
