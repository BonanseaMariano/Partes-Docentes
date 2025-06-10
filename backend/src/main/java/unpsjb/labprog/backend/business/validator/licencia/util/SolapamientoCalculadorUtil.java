package unpsjb.labprog.backend.business.validator.licencia.util;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Clase utilitaria para validaciones de solapamiento de licencias. Esta clase
 * encapsula la lógica de acceso al repositorio y proporciona métodos estáticos
 * para que los validadores no necesiten inyección de dependencias.
 */
@Component
public class SolapamientoCalculadorUtil {

    private static LicenciaRepository licenciaRepository;

    public SolapamientoCalculadorUtil(LicenciaRepository licenciaRepository) {
        SolapamientoCalculadorUtil.licenciaRepository = licenciaRepository;
    }

    /**
     * Busca licencias que se solapen con el período especificado para la misma
     * persona
     *
     * @param personaDni DNI de la persona a verificar
     * @param pedidoDesde Fecha de inicio del período a verificar
     * @param pedidoHasta Fecha de fin del período a verificar
     * @param licenciaId ID de la licencia a excluir (útil para actualizaciones,
     * puede ser null para nuevas)
     * @return Lista de licencias que se solapan con el período especificado
     */
    public static List<Licencia> buscarLicenciasSolapadas(Long personaDni,
            LocalDateTime pedidoDesde,
            LocalDateTime pedidoHasta,
            Integer licenciaId) {
        if (licenciaRepository == null) {
            throw new IllegalStateException("SolapamientoCalculadorUtil no ha sido inicializado correctamente");
        }

        return licenciaRepository.findLicenciasSuperPuestas(
                personaDni, pedidoDesde, pedidoHasta, licenciaId);
    }

    /**
     * Verifica si existen licencias que se solapen con el período especificado
     *
     * @param personaDni DNI de la persona a verificar
     * @param pedidoDesde Fecha de inicio del período a verificar
     * @param pedidoHasta Fecha de fin del período a verificar
     * @param licenciaId ID de la licencia a excluir (opcional, puede ser null)
     * @return true si existen licencias solapadas, false en caso contrario
     */
    public static boolean existenLicenciasSolapadas(Long personaDni,
            LocalDateTime pedidoDesde,
            LocalDateTime pedidoHasta,
            Integer licenciaId) {
        List<Licencia> licenciasSolapadas = buscarLicenciasSolapadas(
                personaDni, pedidoDesde, pedidoHasta, licenciaId);
        return licenciasSolapadas != null && !licenciasSolapadas.isEmpty();
    }

    /**
     * Versión simplificada sin licenciaId (para licencias nuevas)
     */
    public static boolean existenLicenciasSolapadas(Long personaDni,
            LocalDateTime pedidoDesde,
            LocalDateTime pedidoHasta) {
        return existenLicenciasSolapadas(personaDni, pedidoDesde, pedidoHasta, null);
    }
}
