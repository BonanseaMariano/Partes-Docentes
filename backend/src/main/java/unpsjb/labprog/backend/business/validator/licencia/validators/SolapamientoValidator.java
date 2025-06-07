package unpsjb.labprog.backend.business.validator.licencia.validators;

import java.util.List;

import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador para verificar solapamiento entre licencias. Implementa el patrón
 * Singleton requerido por el ValidatorFactory.
 */
public class SolapamientoValidator implements Validator<Licencia> {

    // Singleton
    private static SolapamientoValidator instance = null;
    private LicenciaRepository licenciaRepository;

    private SolapamientoValidator() {
        // Constructor privado para Singleton
        // La inyección se hará después de la creación
    }

    public static SolapamientoValidator getInstance() {
        if (instance == null) {
            instance = new SolapamientoValidator();
        }
        return instance;
    }

    /**
     * Método para inyectar dependencias después de la creación
     */
    public void setLicenciaRepository(LicenciaRepository licenciaRepository) {
        this.licenciaRepository = licenciaRepository;
    }

    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        if (licenciaRepository == null) {
            throw new IllegalStateException("LicenciaRepository no ha sido inyectado");
        }

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
            throw new BusinessLogicException("NO se otorga Licencia artículo "
                    + licencia.getArticuloLicencia().getArticulo() + " a "
                    + licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido()
                    + " debido a que ya posee una licencia en el mismo período");
        }
    }
}
