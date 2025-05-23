package unpsjb.labprog.backend.business.validator.licencia;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validación para verificar que no haya solapamiento con otras licencias
 */
@Component
public class SolapamientoLicenciasRule implements LicenciaValidationRule {

    @Autowired
    private LicenciaRepository licenciaRepository;

    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        // Obtenemos el ID de la licencia (será null si es nueva)
        Integer licenciaId = licencia.getId() > 0 ? licencia.getId() : null;

        // Buscamos licencias que se solapen para la misma persona
        List<Licencia> licenciasSolapadas = licenciaRepository.findLicenciasSuperPuestas(
                licencia.getPersona().getDni(),
                licencia.getPedidoDesde(),
                licencia.getPedidoHasta(),
                licenciaId);

        // Verificar si existen licencias solapadas
        if (!licenciasSolapadas.isEmpty()) {
            // Hay al menos una licencia que se solapa
            throw new BusinessLogicException("NO se otorga Licencia artículo " +
                    licencia.getArticuloLicencia().getArticulo() + " a " +
                    licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido() +
                    " debido a que ya posee una licencia en el mismo período");
        }
    }
}