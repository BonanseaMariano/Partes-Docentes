package unpsjb.labprog.backend.business.validator.util;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Utilidad para cálculos especializados de días de licencia según diferentes
 * artículos.
 *
 * <p>
 * Esta clase proporciona métodos estáticos para calcular días de licencia
 * utilizados en períodos específicos (mensual y anual), facilitando la
 * validación de límites establecidos por diferentes artículos de licencia.</p>
 *
 * <p>
 * Características principales:</p>
 * <ul>
 * <li>Encapsula la lógica de acceso al repositorio de licencias</li>
 * <li>Proporciona métodos estáticos para evitar inyección de dependencias en
 * validadores</li>
 * <li>Soporta cálculos tanto mensuales como anuales</li>
 * <li>Excluye automáticamente la licencia actual en modificaciones</li>
 * </ul>
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Component
public class DiasCalculadorUtil {

    private static LicenciaRepository licenciaRepository;

    /**
     * Constructor que inicializa la referencia estática al repositorio de
     * licencias.
     *
     * @param licenciaRepository el repositorio de licencias a utilizar
     */
    public DiasCalculadorUtil(LicenciaRepository licenciaRepository) {
        DiasCalculadorUtil.licenciaRepository = licenciaRepository;
    }

    /**
     * Calcula los días de licencia ya utilizados en un año específico para un
     * artículo
     *
     * @param codigoArticulo El código del artículo de licencia
     * @param fecha Una fecha dentro del año a consultar
     * @param personaDni DNI de la persona
     * @param licenciaId ID de la licencia a excluir (opcional, puede ser null)
     * @return Total de días utilizados en el año
     */
    public static long calcularDiasAnio(String codigoArticulo, LocalDate fecha, Long personaDni, Integer licenciaId) {
        if (licenciaRepository == null) {
            throw new IllegalStateException("LicenciaCalculadorUtil no ha sido inicializado correctamente");
        }

        int anio = fecha.getYear();

        List<Licencia> licenciasDelAnio = licenciaRepository.findLicenciasPorPersonaArticuloYAnio(
                personaDni,
                codigoArticulo,
                anio,
                licenciaId);

        return licenciasDelAnio.stream()
                .mapToLong(lic -> ChronoUnit.DAYS.between(
                lic.getPedidoDesde(),
                lic.getPedidoHasta()) + 1)
                .sum();
    }

    /**
     * Calcula los días de licencia ya utilizados en un mes específico para un
     * artículo
     *
     * @param codigoArticulo El código del artículo de licencia
     * @param fecha Una fecha dentro del mes a consultar
     * @param personaDni DNI de la persona
     * @param licenciaId ID de la licencia a excluir (opcional, puede ser null)
     * @return Total de días utilizados en el mes
     */
    public static long calcularDiasMes(String codigoArticulo, LocalDate fecha, Long personaDni, Integer licenciaId) {
        if (licenciaRepository == null) {
            throw new IllegalStateException("LicenciaCalculadorUtil no ha sido inicializado correctamente");
        }

        int anio = fecha.getYear();
        int mes = fecha.getMonthValue();

        List<Licencia> licenciasDelMes = licenciaRepository.findLicenciasPorPersonaArticuloYMes(
                personaDni,
                codigoArticulo,
                anio,
                mes,
                licenciaId);

        return licenciasDelMes.stream()
                .mapToLong(lic -> ChronoUnit.DAYS.between(
                lic.getPedidoDesde(),
                lic.getPedidoHasta()) + 1)
                .sum();
    }

    /**
     * Versión simplificada para calcular días del año (sin excluir licencia)
     */
    public static long calcularDiasAnio(String codigoArticulo, LocalDate fecha, Long personaDni) {
        return calcularDiasAnio(codigoArticulo, fecha, personaDni, null);
    }

    /**
     * Versión simplificada para calcular días del mes (sin excluir licencia)
     */
    public static long calcularDiasMes(String codigoArticulo, LocalDate fecha, Long personaDni) {
        return calcularDiasMes(codigoArticulo, fecha, personaDni, null);
    }
}
