package unpsjb.labprog.backend.business.validator.licencia.validators;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import unpsjb.labprog.backend.business.validator.base.Validator;
import unpsjb.labprog.backend.business.validator.util.DiasCalculadorUtil;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador específico para licencias de artículo 5A: Enfermedad de corta
 * evolución. Implementa el patrón Singleton requerido por
 * LicenciaValidatorFactory.
 *
 * <p>
 * Reglas de validación aplicadas:</p>
 * <ul>
 * <li>Máximo 30 días por año calendario</li>
 * <li>Debe presentar certificado médico obligatorio</li>
 * </ul>
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public class Articulo5aValidator implements Validator<Licencia> {

    /**
     * Instancia única del validador (patrón Singleton)
     */
    private static Articulo5aValidator instance = null;

    /**
     * Máximo de días permitidos por año para artículo 5A
     */
    private static final int MAX_DIAS_POR_ANIO = 30;

    /**
     * Código del artículo que valida este validador
     */
    private static final String ARTICULO_CODE = "5A";

    /**
     * Constructor privado para implementar el patrón Singleton.
     */
    private Articulo5aValidator() {
        // Constructor privado para Singleton
    }

    /**
     * Obtiene la instancia única del validador.
     *
     * @return la instancia única del validador
     */
    public static Articulo5aValidator getInstance() {
        if (instance == null) {
            instance = new Articulo5aValidator();
        }
        return instance;
    }

    /**
     * Valida las reglas específicas del artículo 5A. Solo aplica para licencias
     * con artículo 5A.
     *
     * @param licencia la licencia a validar
     * @throws BusinessLogicException si no cumple las reglas del artículo 5A
     */
    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        // Solo aplica para artículo 5A
        if (!ARTICULO_CODE.equals(licencia.getArticuloLicencia().getArticulo())) {
            return; // No aplica para este artículo
        }

        // 1. Verificar que tenga certificado médico
        if (licencia.getCertificadoMedico() == null || !licencia.getCertificadoMedico()) {
            throw new BusinessLogicException(
                    "NO se otorga Licencia artículo " + ARTICULO_CODE + " a "
                    + licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido()
                    + " debido a que no presentó certificado médico");
        }

        // 2. Verificar límite de días por año
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
