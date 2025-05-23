package unpsjb.labprog.backend.business.validator.licencia;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.validator.licencia.articulos.ArticuloLicenciaValidator;
import unpsjb.labprog.backend.business.validator.licencia.articulos.ArticuloValidatorFactory;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validación para aplicar reglas específicas según el artículo de licencia
 */
@Component
public class ArticuloEspecificoRule implements LicenciaValidationRule {

    @Autowired
    private ArticuloValidatorFactory articuloValidatorFactory;

    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        ArticuloLicenciaValidator aValidator = articuloValidatorFactory
                .getValidador(licencia.getArticuloLicencia().getArticulo())
                .orElseThrow(() -> new BusinessLogicException("No se encontró un validador para el artículo " +
                        licencia.getArticuloLicencia().getArticulo()));

        aValidator.validar(licencia);
    }
}