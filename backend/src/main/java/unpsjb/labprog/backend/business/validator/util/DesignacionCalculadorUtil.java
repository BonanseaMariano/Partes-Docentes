package unpsjb.labprog.backend.business.validator.util;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.model.Designacion;

/**
 * Utilidad especializada para cálculos y verificaciones de designaciones.
 *
 * <p>
 * Esta clase proporciona métodos estáticos para verificar la existencia de
 * cargos y designaciones activas para personas específicas, facilitando las
 * validaciones de licencias que requieren confirmar que el solicitante tiene
 * designaciones válidas.</p>
 *
 * <p>
 * Funcionalidades principales:</p>
 * <ul>
 * <li>Verificación de existencia de cargos para una persona</li>
 * <li>Búsqueda de designaciones activas en períodos específicos</li>
 * <li>Validación de cobertura completa de períodos por designaciones</li>
 * <li>Encapsulación del acceso a repositorio para validadores</li>
 * </ul>
 *
 * <p>
 * Los métodos estáticos permiten que los validadores utilicen estas
 * funcionalidades sin necesidad de inyección de dependencias, manteniendo la
 * simplicidad del patrón.</p>
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Component
public class DesignacionCalculadorUtil {

    private static DesignacionRepository designacionRepository;

    /**
     * Constructor que inicializa la referencia estática al repositorio de
     * designaciones.
     *
     * @param designacionRepository el repositorio de designaciones a utilizar
     */
    public DesignacionCalculadorUtil(DesignacionRepository designacionRepository) {
        DesignacionCalculadorUtil.designacionRepository = designacionRepository;
    }

    /**
     * Verifica si una persona tiene al menos un cargo asignado en la
     * institución.
     *
     * @param personaDni DNI de la persona a verificar
     * @return true si la persona tiene al menos un cargo, false en caso
     * contrario
     * @throws IllegalStateException si el util no ha sido inicializado
     * correctamente
     */
    public static boolean tieneAlgunCargo(Long personaDni) {
        if (designacionRepository == null) {
            throw new IllegalStateException("DesignacionCalculadorUtil no ha sido inicializado correctamente");
        }

        return designacionRepository.existsDesignacionesPorPersona(personaDni);
    }

    /**
     * Busca todas las designaciones activas para una persona en un período
     * específico.
     *
     * @param personaDni DNI de la persona
     * @param fechaDesde fecha de inicio del período a consultar
     * @param fechaHasta fecha de fin del período a consultar
     * @return lista de designaciones activas en el período especificado
     * @throws IllegalStateException si el util no ha sido inicializado
     * correctamente
     */
    public static List<Designacion> buscarDesignacionesActivas(Long personaDni,
            LocalDate fechaDesde,
            LocalDate fechaHasta) {
        if (designacionRepository == null) {
            throw new IllegalStateException("DesignacionCalculadorUtil no ha sido inicializado correctamente");
        }

        return designacionRepository.findDesignacionesActivasPorPersonaYPeriodo(
                personaDni, fechaDesde, fechaHasta);
    }

    /**
     * Verifica si una persona tiene designaciones activas que cubran
     * completamente un período.
     *
     * <p>
     * Este método es fundamental para validar licencias, ya que garantiza que
     * la persona tenga designaciones válidas durante todo el período
     * solicitado.</p>
     *
     * @param personaDni DNI de la persona
     * @param fechaDesde fecha de inicio del período a verificar
     * @param fechaHasta fecha de fin del período a verificar
     * @return true si existen designaciones que cubren el período, false en
     * caso contrario
     */
    public static boolean tieneDesignacionesActivasEnPeriodo(Long personaDni,
            LocalDate fechaDesde,
            LocalDate fechaHasta) {
        List<Designacion> designaciones = buscarDesignacionesActivas(personaDni, fechaDesde, fechaHasta);
        return designaciones != null && !designaciones.isEmpty();
    }
}
