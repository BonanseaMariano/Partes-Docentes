package unpsjb.labprog.backend.business.validator.util;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Clase utilitaria para cálculos de días de licencia. Esta clase encapsula la
 * lógica de acceso al repositorio y proporciona métodos estáticos para que los
 * validadores no necesiten inyección de dependencias.
 */
@Component
public class DiasCalculadorUtil {

    private static LicenciaRepository licenciaRepository;

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
    public static long calcularDiasAnio(String codigoArticulo, LocalDateTime fecha, Long personaDni, Integer licenciaId) {
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
                lic.getPedidoDesde().toLocalDate(),
                lic.getPedidoHasta().toLocalDate()) + 1)
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
    public static long calcularDiasMes(String codigoArticulo, LocalDateTime fecha, Long personaDni, Integer licenciaId) {
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
                lic.getPedidoDesde().toLocalDate(),
                lic.getPedidoHasta().toLocalDate()) + 1)
                .sum();
    }

    /**
     * Versión simplificada para calcular días del año (sin excluir licencia)
     */
    public static long calcularDiasAnio(String codigoArticulo, LocalDateTime fecha, Long personaDni) {
        return calcularDiasAnio(codigoArticulo, fecha, personaDni, null);
    }

    /**
     * Versión simplificada para calcular días del mes (sin excluir licencia)
     */
    public static long calcularDiasMes(String codigoArticulo, LocalDateTime fecha, Long personaDni) {
        return calcularDiasMes(codigoArticulo, fecha, personaDni, null);
    }
}
