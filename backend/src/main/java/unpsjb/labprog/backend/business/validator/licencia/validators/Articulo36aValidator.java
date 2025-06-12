package unpsjb.labprog.backend.business.validator.licencia.validators;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.util.DiasCalculadorUtil;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador específico para artículo 36A: Asuntos particulares. Reglas: Máximo
 * 2 días por mes y máximo 6 días por año. Implementa el patrón Singleton
 * requerido por el ValidatorFactory.
 */
public class Articulo36aValidator implements Validator<Licencia> {

    // Singleton
    private static Articulo36aValidator instance = null;

    private static final int MAX_DIAS_POR_MES = 2;
    private static final int MAX_DIAS_POR_ANIO = 6;
    private static final String ARTICULO_CODE = "36A";

    private Articulo36aValidator() {
        // Constructor privado para Singleton
    }

    public static Articulo36aValidator getInstance() {
        if (instance == null) {
            instance = new Articulo36aValidator();
        }
        return instance;
    }

    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        // Solo aplica para artículo 36A
        if (!ARTICULO_CODE.equals(licencia.getArticuloLicencia().getArticulo())) {
            return; // No aplica para este artículo
        }

        LocalDateTime inicio = licencia.getPedidoDesde();
        LocalDateTime fin = licencia.getPedidoHasta();

        // Calcular días solicitados en esta licencia
        long diasSolicitados = ChronoUnit.DAYS.between(inicio.toLocalDate(), fin.toLocalDate()) + 1;

        // Verificar días por mes
        validarDiasPorMes(licencia, diasSolicitados);

        // Verificar días por año
        validarDiasPorAnio(licencia, diasSolicitados);
    }

    private void validarDiasPorMes(Licencia licencia, long diasSolicitados) throws BusinessLogicException {
        LocalDateTime inicio = licencia.getPedidoDesde();

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

    private void validarDiasPorAnio(Licencia licencia, long diasSolicitados) throws BusinessLogicException {
        LocalDateTime inicio = licencia.getPedidoDesde();

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
