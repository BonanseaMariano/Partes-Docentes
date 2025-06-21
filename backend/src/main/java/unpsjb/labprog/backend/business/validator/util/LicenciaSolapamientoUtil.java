package unpsjb.labprog.backend.business.validator.util;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Utilidad especializada para detección y manejo de solapamientos entre
 * licencias.
 *
 * <p>
 * Esta clase proporciona métodos especializados para identificar conflictos
 * temporales entre licencias de una misma persona, evitando que se otorguen
 * licencias con períodos superpuestos que podrían generar inconsistencias en el
 * sistema.</p>
 *
 * <p>
 * Funcionalidades principales:</p>
 * <ul>
 * <li>Detección de licencias con períodos superpuestos</li>
 * <li>Exclusión automática de licencias en modificación</li>
 * <li>Búsqueda optimizada por persona y período</li>
 * <li>Métodos simplificados para validaciones comunes</li>
 * </ul>
 *
 * <p>
 * Los métodos estáticos facilitan su uso desde validadores sin requerir
 * inyección de dependencias, manteniendo la simplicidad del diseño.</p>
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Component
public class LicenciaSolapamientoUtil {

    private static LicenciaRepository licenciaRepository;

    /**
     * Constructor que inicializa la referencia estática al repositorio de
     * licencias.
     *
     * @param licenciaRepository el repositorio de licencias a utilizar
     */
    public LicenciaSolapamientoUtil(LicenciaRepository licenciaRepository) {
        LicenciaSolapamientoUtil.licenciaRepository = licenciaRepository;
    }

    /**
     * Busca licencias que se solapen temporalmente con el período especificado.
     *
     * <p>
     * Permite excluir una licencia específica del análisis, útil para
     * modificaciones donde se debe verificar solapamiento con otras licencias
     * pero no consigo misma.</p>
     *
     * @param personaDni DNI de la persona a verificar
     * @param pedidoDesde fecha de inicio del período a verificar
     * @param pedidoHasta fecha de fin del período a verificar
     * @param licenciaId ID de la licencia a excluir (null para licencias
     * nuevas)
     * @return lista de licencias que se solapan con el período especificado
     * @throws IllegalStateException si el util no ha sido inicializado
     * correctamente
     */
    public static List<Licencia> buscarLicenciasSolapadas(Long personaDni,
            LocalDate pedidoDesde,
            LocalDate pedidoHasta,
            Integer licenciaId) {
        if (licenciaRepository == null) {
            throw new IllegalStateException("SolapamientoCalculadorUtil no ha sido inicializado correctamente");
        }

        return licenciaRepository.findLicenciasSuperPuestas(
                personaDni, pedidoDesde, pedidoHasta, licenciaId);
    }

    /**
     * Verifica de forma eficiente si existen licencias solapadas con el período
     * especificado.
     *
     * @param personaDni DNI de la persona a verificar
     * @param pedidoDesde fecha de inicio del período a verificar
     * @param pedidoHasta fecha de fin del período a verificar
     * @param licenciaId ID de la licencia a excluir (null para licencias
     * nuevas)
     * @return true si existen licencias solapadas, false en caso contrario
     */
    public static boolean existenLicenciasSolapadas(Long personaDni,
            LocalDate pedidoDesde,
            LocalDate pedidoHasta,
            Integer licenciaId) {
        List<Licencia> licenciasSolapadas = buscarLicenciasSolapadas(
                personaDni, pedidoDesde, pedidoHasta, licenciaId);
        return licenciasSolapadas != null && !licenciasSolapadas.isEmpty();
    }

    /**
     * Método simplificado para verificar solapamientos en licencias nuevas.
     *
     * @param personaDni DNI de la persona a verificar
     * @param pedidoDesde fecha de inicio del período a verificar
     * @param pedidoHasta fecha de fin del período a verificar
     * @return true si existen licencias solapadas, false en caso contrario
     */
    public static boolean existenLicenciasSolapadas(Long personaDni,
            LocalDate pedidoDesde,
            LocalDate pedidoHasta) {
        return existenLicenciasSolapadas(personaDni, pedidoDesde, pedidoHasta, null);
    }
}
