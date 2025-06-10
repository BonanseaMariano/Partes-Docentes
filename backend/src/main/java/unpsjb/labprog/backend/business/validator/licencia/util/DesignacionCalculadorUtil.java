package unpsjb.labprog.backend.business.validator.licencia.util;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.model.Designacion;

/**
 * Clase utilitaria para validaciones de designaciones. Esta clase encapsula la
 * lógica de acceso al repositorio y proporciona métodos estáticos para que los
 * validadores no necesiten inyección de dependencias.
 */
@Component
public class DesignacionCalculadorUtil {

    private static DesignacionRepository designacionRepository;

    public DesignacionCalculadorUtil(DesignacionRepository designacionRepository) {
        DesignacionCalculadorUtil.designacionRepository = designacionRepository;
    }

    /**
     * Verifica si una persona tiene algún cargo en la institución
     *
     * @param personaDni DNI de la persona a verificar
     * @return true si tiene al menos un cargo, false en caso contrario
     */
    public static boolean tieneAlgunCargo(Long personaDni) {
        if (designacionRepository == null) {
            throw new IllegalStateException("DesignacionCalculadorUtil no ha sido inicializado correctamente");
        }

        return designacionRepository.existsDesignacionesPorPersona(personaDni);
    }

    /**
     * Busca designaciones activas para una persona en un período específico
     *
     * @param personaDni DNI de la persona
     * @param fechaDesde Fecha de inicio del período
     * @param fechaHasta Fecha de fin del período
     * @return Lista de designaciones activas en el período
     */
    public static List<Designacion> buscarDesignacionesActivas(Long personaDni,
            LocalDateTime fechaDesde,
            LocalDateTime fechaHasta) {
        if (designacionRepository == null) {
            throw new IllegalStateException("DesignacionCalculadorUtil no ha sido inicializado correctamente");
        }

        return designacionRepository.findDesignacionesActivasPorPersonaYPeriodo(
                personaDni, fechaDesde, fechaHasta);
    }

    /**
     * Verifica si una persona tiene designaciones activas que cubran
     * completamente un período
     *
     * @param personaDni DNI de la persona
     * @param fechaDesde Fecha de inicio del período
     * @param fechaHasta Fecha de fin del período
     * @return true si tiene designaciones que cubren el período, false en caso
     * contrario
     */
    public static boolean tieneDesignacionesActivasEnPeriodo(Long personaDni,
            LocalDateTime fechaDesde,
            LocalDateTime fechaHasta) {
        List<Designacion> designaciones = buscarDesignacionesActivas(personaDni, fechaDesde, fechaHasta);
        return designaciones != null && !designaciones.isEmpty();
    }
}
