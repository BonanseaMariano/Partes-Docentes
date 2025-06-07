package unpsjb.labprog.backend.business.validator.licencia.validators;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador específico para artículo 23A: Atención de un miembro del grupo familiar.
 * Reglas: Máximo 30 días por año.
 * Implementa el patrón Singleton requerido por el ValidatorFactory.
 */
public class Articulo23aValidator implements Validator<Licencia> {

    // Singleton
    private static Articulo23aValidator instance = null;
    private LicenciaRepository licenciaRepository;
    
    private static final int MAX_DIAS_POR_ANIO = 30;
    private static final String ARTICULO_CODE = "23A";

    private Articulo23aValidator() {
        // Constructor privado para Singleton
        // La inyección se hará después de la creación
    }

    public static Articulo23aValidator getInstance() {
        if (instance == null)
            instance = new Articulo23aValidator();
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

        // Solo aplica para artículo 23A
        if (!ARTICULO_CODE.equals(licencia.getArticuloLicencia().getArticulo())) {
            return; // No aplica para este artículo
        }

        LocalDateTime inicio = licencia.getPedidoDesde();
        LocalDateTime fin = licencia.getPedidoHasta();
        int anio = inicio.getYear();

        // Calcular días solicitados en esta licencia
        long diasSolicitados = ChronoUnit.DAYS.between(inicio.toLocalDate(), fin.toLocalDate()) + 1;

        // Buscar licencias existentes del mismo artículo para el mismo año
        List<Licencia> licenciasDelAnio = licenciaRepository.findLicenciasPorPersonaArticuloYAnio(
                licencia.getPersona().getDni(),
                ARTICULO_CODE,
                anio,
                licencia.getId() > 0 ? licencia.getId() : null);

        // Calcular días ya utilizados
        long diasYaUtilizados = licenciasDelAnio.stream()
                .mapToLong(lic -> ChronoUnit.DAYS.between(lic.getPedidoDesde().toLocalDate(),
                        lic.getPedidoHasta().toLocalDate()) + 1)
                .sum();

        // Verificar que no supere el límite anual
        if (diasYaUtilizados + diasSolicitados > MAX_DIAS_POR_ANIO) {
            throw new BusinessLogicException(
                    "NO se otorga Licencia artículo " + ARTICULO_CODE + " a " +
                            licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido() +
                            " debido a que supera el tope de " + MAX_DIAS_POR_ANIO + " días de licencia");
        }
    }
}
