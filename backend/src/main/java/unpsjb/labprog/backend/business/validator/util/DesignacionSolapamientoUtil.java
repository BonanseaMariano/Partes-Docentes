package unpsjb.labprog.backend.business.validator.util;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Utilidad especializada para detección de solapamientos en designaciones y
 * análisis de cobertura por licencias.
 *
 * <p>
 * Esta clase maneja la lógica compleja de verificación de solapamientos entre
 * designaciones para un mismo cargo, así como el análisis de cobertura continua
 * de períodos mediante licencias. Es fundamental para mantener la integridad de
 * las designaciones y validar su coherencia temporal.</p>
 *
 * <p>
 * Funcionalidades principales:</p>
 * <ul>
 * <li>Detección de designaciones superpuestas para un mismo cargo</li>
 * <li>Análisis de cobertura continua de períodos por licencias</li>
 * <li>Verificación de continuidad temporal entre licencias</li>
 * <li>Exclusión automática de designaciones en modificación</li>
 * </ul>
 *
 * <p>
 * Los algoritmos implementados consideran las reglas de negocio específicas
 * para determinar cuándo las licencias proporcionan cobertura válida y
 * continua.</p>
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Component
public class DesignacionSolapamientoUtil {

    private static DesignacionRepository designacionRepository;
    private static LicenciaRepository licenciaRepository;

    /**
     * Constructor que inicializa las referencias estáticas a los repositorios
     * necesarios.
     *
     * @param designacionRepository el repositorio de designaciones a utilizar
     * @param licenciaRepository el repositorio de licencias a utilizar
     */
    public DesignacionSolapamientoUtil(DesignacionRepository designacionRepository,
            LicenciaRepository licenciaRepository) {
        DesignacionSolapamientoUtil.designacionRepository = designacionRepository;
        DesignacionSolapamientoUtil.licenciaRepository = licenciaRepository;
    }

    /**
     * Busca designaciones que se superpongan temporalmente para un mismo cargo.
     *
     * <p>
     * Permite excluir una designación específica del análisis, útil para
     * modificaciones donde se debe verificar solapamiento con otras
     * designaciones pero no consigo misma.</p>
     *
     * @param cargoId ID del cargo a verificar
     * @param fechaInicio fecha de inicio del período a verificar
     * @param fechaFin fecha de fin del período a verificar
     * @param designacionId ID de la designación a excluir (null para
     * designaciones nuevas)
     * @return lista de designaciones que se superponen con el período
     * especificado
     * @throws IllegalStateException si el util no ha sido inicializado
     * correctamente
     */
    public static List<Designacion> buscarDesignacionesSuperpuestas(Integer cargoId,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            Integer designacionId) {
        if (designacionRepository == null) {
            throw new IllegalStateException("DesignacionSolapamientoUtil no ha sido inicializado correctamente");
        }

        return designacionRepository.findDesignacionesSuperpuestas(
                cargoId, fechaInicio, fechaFin, designacionId);
    }

    /**
     * Busca licencias que puedan proporcionar cobertura continua para un
     * período específico.
     *
     * <p>
     * Retorna las licencias ordenadas que podrían cubrir total o parcialmente
     * el período especificado, facilitando el análisis de continuidad.</p>
     *
     * @param personaDni DNI de la persona a verificar
     * @param fechaInicio fecha de inicio del período a verificar
     * @param fechaFin fecha de fin del período a verificar
     * @return lista ordenada de licencias que se superponen con el período
     * @throws IllegalStateException si el util no ha sido inicializado
     * correctamente
     */
    public static List<Licencia> buscarLicenciasParaCoberturaContinua(Long personaDni,
            LocalDate fechaInicio,
            LocalDate fechaFin) {
        if (licenciaRepository == null) {
            throw new IllegalStateException("DesignacionSolapamientoUtil no ha sido inicializado correctamente");
        }

        return licenciaRepository.findLicenciasParaCoberturaContinua(
                personaDni, fechaInicio, fechaFin);
    }

    /**
     * Verifica si las licencias proporcionadas cubren de forma continua el
     * período especificado.
     *
     * <p>
     * Implementa el algoritmo de verificación de cobertura continua,
     * considerando:</p>
     * <ul>
     * <li>La primera licencia debe cubrir el inicio del período</li>
     * <li>No debe haber gaps mayores a 1 día entre licencias consecutivas</li>
     * <li>La cobertura debe extenderse hasta el final del período</li>
     * </ul>
     *
     * <p>
     * <strong>Precondición:</strong> Las licencias deben estar ordenadas por
     * fecha de inicio.</p>
     *
     * @param licencias lista de licencias ordenadas por fecha de inicio
     * @param fechaInicio fecha de inicio del período a verificar
     * @param fechaFin fecha de fin del período a verificar
     * @return true si las licencias cubren completamente el período, false en
     * caso contrario
     */
    public static boolean verificarCoberturaContinua(List<Licencia> licencias,
            LocalDate fechaInicio, LocalDate fechaFin) {

        if (licencias == null || licencias.isEmpty()) {
            return false;
        }

        // Verificar que la primera licencia cubra el inicio del período
        if (licencias.get(0).getPedidoDesde().isAfter(fechaInicio)) {
            return false;
        }

        LocalDate cobertura = licencias.get(0).getPedidoHasta();

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
     * Verifica de forma eficiente si existen designaciones superpuestas para un
     * cargo específico.
     *
     * @param cargoId ID del cargo a verificar
     * @param fechaInicio fecha de inicio del período a verificar
     * @param fechaFin fecha de fin del período a verificar
     * @param designacionId ID de la designación a excluir (null para
     * designaciones nuevas)
     * @return true si existen designaciones superpuestas, false en caso
     * contrario
     */
    public static boolean existenDesignacionesSuperpuestas(Integer cargoId,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            Integer designacionId) {
        List<Designacion> designacionesSuperpuestas = buscarDesignacionesSuperpuestas(
                cargoId, fechaInicio, fechaFin, designacionId);
        return designacionesSuperpuestas != null && !designacionesSuperpuestas.isEmpty();
    }

    /**
     * Método simplificado para verificar solapamientos en designaciones nuevas.
     *
     * @param cargoId ID del cargo a verificar
     * @param fechaInicio fecha de inicio del período a verificar
     * @param fechaFin fecha de fin del período a verificar
     * @return true si existen designaciones superpuestas, false en caso
     * contrario
     */
    public static boolean existenDesignacionesSuperpuestas(Integer cargoId,
            LocalDate fechaInicio,
            LocalDate fechaFin) {
        return existenDesignacionesSuperpuestas(cargoId, fechaInicio, fechaFin, null);
    }
}
