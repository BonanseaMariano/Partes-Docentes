package unpsjb.labprog.backend.business.validator.licencia.validators;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.util.DiasCalculadorUtil;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador específico para licencias del artículo 36A: Asuntos particulares.
 *
 * <p>
 * Aplica las siguientes reglas de negocio específicas del artículo 36A:</p>
 * <ul>
 * <li>Máximo 2 días por mes calendario</li>
 * <li>Máximo 6 días por año calendario</li>
 * </ul>
 *
 * <p>
 * El validador calcula automáticamente los días ya utilizados por la persona en
 * el período correspondiente y verifica que la nueva solicitud no supere los
 * límites.</p>
 *
 * <p>
 * Forma parte del patrón Chain of Responsibility para la validación de
 * licencias y implementa el patrón Singleton para optimización de memoria.</p>
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public class Articulo36aValidator implements Validator<Licencia> {

    private static Articulo36aValidator instance = null;

    private static final int MAX_DIAS_POR_MES = 2;
    private static final int MAX_DIAS_POR_ANIO = 6;
    private static final String ARTICULO_CODE = "36A";

    /**
     * Constructor privado para implementar el patrón Singleton.
     */
    private Articulo36aValidator() {
        // Constructor privado para Singleton
    }

    /**
     * Obtiene la única instancia del validador.
     *
     * @return la instancia única de Articulo36aValidator
     */
    public static Articulo36aValidator getInstance() {
        if (instance == null) {
            instance = new Articulo36aValidator();
        }
        return instance;
    }

    /**
     * Valida que la licencia del artículo 36A cumpla con los límites
     * establecidos.
     *
     * @param licencia la licencia a validar
     * @throws BusinessLogicException si se superan los límites mensuales o
     * anuales del artículo 36A
     */
    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        // Solo aplica para artículo 36A
        if (!ARTICULO_CODE.equals(licencia.getArticuloLicencia().getArticulo())) {
            return; // No aplica para este artículo
        }

        LocalDate inicio = licencia.getPedidoDesde();
        LocalDate fin = licencia.getPedidoHasta();

        // Calcular días solicitados en esta licencia
        long diasSolicitados = ChronoUnit.DAYS.between(inicio, fin) + 1;

        // Verificar días por mes
        validarDiasPorMes(licencia, diasSolicitados);

        // Verificar días por año
        validarDiasPorAnio(licencia, diasSolicitados);
    }

    /**
     * Valida que no se supere el límite mensual de días para el artículo 36A.
     *
     * @param licencia la licencia a validar
     * @param diasSolicitados cantidad de días solicitados en esta licencia
     * @throws BusinessLogicException si se supera el límite de 2 días por mes
     */
    private void validarDiasPorMes(Licencia licencia, long diasSolicitados) throws BusinessLogicException {
        LocalDate inicio = licencia.getPedidoDesde();

        // Calcular días ya utilizados en el mes usando la clase utilitaria
        long diasDelMes = DiasCalculadorUtil.calcularDiasMes(
                ARTICULO_CODE,
                inicio,
                licencia.getPersona().getDni(),
                licencia.getId() > 0 ? licencia.getId() : null);

        // Verificar que no supere el límite mensual
        if (diasDelMes + diasSolicitados > MAX_DIAS_POR_MES) {
            throw new BusinessLogicException(
                    "NO se otorga Licencia artículo " + ARTICULO_CODE + " a "
                    + licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido()
                    + " debido a que supera el tope de " + MAX_DIAS_POR_MES + " días de licencia por mes");
        }
    }

    /**
     * Valida que no se supere el límite anual de días para el artículo 36A.
     *
     * @param licencia la licencia a validar
     * @param diasSolicitados cantidad de días solicitados en esta licencia
     * @throws BusinessLogicException si se supera el límite de 6 días por año
     */
    private void validarDiasPorAnio(Licencia licencia, long diasSolicitados) throws BusinessLogicException {
        LocalDate inicio = licencia.getPedidoDesde();

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
                    + " debido a que supera el tope de " + MAX_DIAS_POR_ANIO + " días de licencia por año");
        }
    }
}
