package unpsjb.labprog.backend.business.validator.licencia.validators;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.util.DiasCalculadorUtil;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador específico para licencias del artículo 23A: Atención de un miembro
 * del grupo familiar.
 *
 * <p>
 * Aplica las siguientes reglas de negocio específicas del artículo 23A:</p>
 * <ul>
 * <li>Máximo 30 días por año calendario</li>
 * </ul>
 *
 * <p>
 * El validador calcula automáticamente los días ya utilizados por la persona en
 * el año y verifica que la nueva solicitud no supere el límite anual
 * establecido.</p>
 *
 * <p>
 * Forma parte del patrón Chain of Responsibility para la validación de
 * licencias y implementa el patrón Singleton para optimización de memoria.</p>
 *
 * @author Mariano Bonansea
 * @version 1.0
 * @since 1.0
 */
public class Articulo23aValidator implements Validator<Licencia> {

    private static Articulo23aValidator instance = null;

    private static final int MAX_DIAS_POR_ANIO = 30;
    private static final String ARTICULO_CODE = "23A";

    /**
     * Constructor privado para implementar el patrón Singleton.
     */
    private Articulo23aValidator() {
        // Constructor privado para Singleton
    }

    /**
     * Obtiene la única instancia del validador.
     *
     * @return la instancia única de Articulo23aValidator
     */
    public static Articulo23aValidator getInstance() {
        if (instance == null) {
            instance = new Articulo23aValidator();
        }
        return instance;
    }

    /**
     * Valida que la licencia del artículo 23A cumpla con el límite anual
     * establecido.
     *
     * @param licencia la licencia a validar
     * @throws BusinessLogicException si se supera el límite anual de 30 días
     * del artículo 23A
     */
    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        // Solo aplica para artículo 23A
        if (!ARTICULO_CODE.equals(licencia.getArticuloLicencia().getArticulo())) {
            return; // No aplica para este artículo
        }

        LocalDate inicio = licencia.getPedidoDesde();
        LocalDate fin = licencia.getPedidoHasta();

        // Calcular días solicitados en esta licencia
        long diasSolicitados = ChronoUnit.DAYS.between(inicio, fin) + 1;

        // Calcular días ya utilizados en el año usando la clase utilitaria
        long diasYaUtilizados = DiasCalculadorUtil.calcularDiasAnio(
                ARTICULO_CODE,
                inicio,
                licencia.getPersona().getDni(),
                licencia.getId() > 0 ? licencia.getId() : null);

        // Verificar que no supere el límite anual
        if (diasYaUtilizados + diasSolicitados > MAX_DIAS_POR_ANIO) {
            throw new BusinessLogicException(
                    "NO se otorga Licencia artículo " + ARTICULO_CODE + " a "
                    + licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido()
                    + " debido a que supera el tope de " + MAX_DIAS_POR_ANIO + " días de licencia");
        }
    }
}
