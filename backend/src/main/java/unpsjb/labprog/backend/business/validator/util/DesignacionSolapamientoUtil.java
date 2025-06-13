package unpsjb.labprog.backend.business.validator.util;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Clase utilitaria para validaciones de solapamiento de designaciones. Esta
 * clase encapsula la lógica de acceso al repositorio y proporciona métodos
 * estáticos para que los validadores no necesiten inyección de dependencias.
 */
@Component
public class DesignacionSolapamientoUtil {

    private static DesignacionRepository designacionRepository;
    private static LicenciaRepository licenciaRepository;

    public DesignacionSolapamientoUtil(DesignacionRepository designacionRepository,
            LicenciaRepository licenciaRepository) {
        DesignacionSolapamientoUtil.designacionRepository = designacionRepository;
        DesignacionSolapamientoUtil.licenciaRepository = licenciaRepository;
    }

    /**
     * Busca designaciones que se solapen con el período especificado para el
     * mismo cargo
     *
     * @param cargoId ID del cargo a verificar
     * @param fechaInicio Fecha de inicio del período a verificar
     * @param fechaFin Fecha de fin del período a verificar
     * @param designacionId ID de la designación a excluir (útil para
     * actualizaciones, puede ser null para nuevas)
     * @return Lista de designaciones que se solapan con el período especificado
     */
    public static List<Designacion> buscarDesignacionesSuperpuestas(Integer cargoId,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin,
            Integer designacionId) {
        if (designacionRepository == null) {
            throw new IllegalStateException("DesignacionSolapamientoUtil no ha sido inicializado correctamente");
        }

        return designacionRepository.findDesignacionesSuperpuestas(
                cargoId, fechaInicio, fechaFin, designacionId);
    }

    /**
     * Busca licencias que se solapen con el período especificado para una
     * persona
     *
     * @param personaDni DNI de la persona a verificar
     * @param fechaInicio Fecha de inicio del período a verificar
     * @param fechaFin Fecha de fin del período a verificar
     * @return Lista de licencias ordenadas que se solapan con el período
     */
    public static List<Licencia> buscarLicenciasParaCoberturaContinua(Long personaDni,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {
        if (licenciaRepository == null) {
            throw new IllegalStateException("DesignacionSolapamientoUtil no ha sido inicializado correctamente");
        }

        return licenciaRepository.findLicenciasParaCoberturaContinua(
                personaDni, fechaInicio, fechaFin);
    }

    /**
     * Verifica si las licencias proporcionadas cubren de forma continua el
     * período especificado. Las licencias deben estar ordenadas por fecha de
     * inicio.
     *
     * @param licencias Lista de licencias ordenadas por fecha de inicio
     * @param fechaInicio Fecha de inicio del período a verificar
     * @param fechaFin Fecha de fin del período a verificar
     * @return true si las licencias cubren completamente el período, false en
     * caso contrario
     */
    public static boolean verificarCoberturaContinua(List<Licencia> licencias,
            LocalDateTime fechaInicio, LocalDateTime fechaFin) {

        if (licencias == null || licencias.isEmpty()) {
            return false;
        }

        // Verificar que la primera licencia cubra el inicio del período
        if (licencias.get(0).getPedidoDesde().isAfter(fechaInicio)) {
            return false;
        }

        LocalDateTime cobertura = licencias.get(0).getPedidoHasta();

        // Verificar continuidad entre licencias
        for (int i = 1; i < licencias.size(); i++) {
            Licencia licencia = licencias.get(i);

            // Si hay un gap mayor a 1 día, no hay continuidad
            if (licencia.getPedidoDesde().isAfter(cobertura.plusDays(1))) {
                break;
            }

            // Extender la cobertura si esta licencia va más allá
            if (licencia.getPedidoHasta().isAfter(cobertura)) {
                cobertura = licencia.getPedidoHasta();
            }
        }

        // Verificar que la cobertura llegue hasta el final del período
        return !cobertura.isBefore(fechaFin);
    }

    /**
     * Verifica si existen designaciones superpuestas para un cargo específico
     *
     * @param cargoId ID del cargo a verificar
     * @param fechaInicio Fecha de inicio del período a verificar
     * @param fechaFin Fecha de fin del período a verificar
     * @param designacionId ID de la designación a excluir (opcional, puede ser
     * null)
     * @return true si existen designaciones superpuestas, false en caso
     * contrario
     */
    public static boolean existenDesignacionesSuperpuestas(Integer cargoId,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin,
            Integer designacionId) {
        List<Designacion> designacionesSuperpuestas = buscarDesignacionesSuperpuestas(
                cargoId, fechaInicio, fechaFin, designacionId);
        return designacionesSuperpuestas != null && !designacionesSuperpuestas.isEmpty();
    }

    /**
     * Versión simplificada sin designacionId (para designaciones nuevas)
     */
    public static boolean existenDesignacionesSuperpuestas(Integer cargoId,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {
        return existenDesignacionesSuperpuestas(cargoId, fechaInicio, fechaFin, null);
    }
}
