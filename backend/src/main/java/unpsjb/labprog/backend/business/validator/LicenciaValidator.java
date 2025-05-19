package unpsjb.labprog.backend.business.validator;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.business.service.DesignacionService;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;

@Component
public class LicenciaValidator {

    @Autowired
    private DesignacionService designacionService;

    @Autowired
    private LicenciaRepository licenciaRepository;

    /**
     * Valida todas las reglas de negocio específicas para las licencias
     * 
     * @param licencia Licencia a validar
     * @throws BusinessLogicException si no se cumplen las reglas
     */
    public void validar(Licencia licencia) throws BusinessLogicException {
        validarExistenciaDesignacionesActivas(licencia);
        validarSolapamientoLicencias(licencia);
    }

    /**
     * Valida que exista al menos una designación activa para la persona
     * durante el periodo de la licencia.
     * 
     * @param licencia Licencia a validar
     * @throws BusinessLogicException si no existen designaciones activas para el
     *                                periodo
     */
    private void validarExistenciaDesignacionesActivas(Licencia licencia) throws BusinessLogicException {
        // Primero verificamos si la persona tiene algún cargo en la institución
        boolean tieneAlgunCargo = designacionService.existsDesignacionesPorPersona(
                licencia.getPersona().getDni());

        if (!tieneAlgunCargo) {
            throw new BusinessLogicException("NO se otorga Licencia artículo " +
                    licencia.getArticuloLicencia().getArticulo() + " a " +
                    licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido() +
                    " debido a que el agente no posee ningún cargo en la institución");
        }

        // Si tiene cargos, verificamos si tiene uno activo durante el período de la
        // licencia
        List<Designacion> designacionesActivas = designacionService.findDesignacionesActivasPorPersonaYPeriodo(
                licencia.getPersona().getDni(),
                licencia.getPedidoDesde(),
                licencia.getPedidoHasta());

        // Verificar que exista al menos una designación activa para el periodo
        if (designacionesActivas == null || designacionesActivas.isEmpty()) {
            throw new BusinessLogicException("NO se otorga Licencia artículo " +
                    licencia.getArticuloLicencia().getArticulo() + " a " +
                    licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido() +
                    " debido a que el agente no tiene designación ese día en la institución");
        }
    }

    /**
     * Valida que la persona no tenga otras licencias que se solapen con el período
     * de la licencia que se está validando.
     * 
     * @param licencia Licencia a validar
     * @throws BusinessLogicException si la persona ya tiene una licencia en el
     *                                mismo período
     */
    private void validarSolapamientoLicencias(Licencia licencia) throws BusinessLogicException {
        // Obtenemos el ID de la licencia (será null si es nueva)
        Integer licenciaId = licencia.getId() > 0 ? licencia.getId() : null;

        // Buscamos licencias que se solapen para la misma persona
        List<Licencia> licenciasSolapadas = licenciaRepository.findLicenciasSuperPuestas(
                licencia.getPersona().getDni(),
                licencia.getPedidoDesde(),
                licencia.getPedidoHasta(),
                licenciaId);

        // Verificar si existen licencias solapadas
        if (!licenciasSolapadas.isEmpty()) {
            // Hay al menos una licencia que se solapa
            throw new BusinessLogicException("NO se otorga Licencia artículo " +
                    licencia.getArticuloLicencia().getArticulo() + " a " +
                    licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido() +
                    " debido a que ya posee una licencia en el mismo período");
        }
    }
}
