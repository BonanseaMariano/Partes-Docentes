package unpsjb.labprog.backend.business.validator.licencia;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.DesignacionRepository;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validación para verificar si la persona tiene designaciones activas durante
 * el periodo de licencia
 */
@Component
public class DesignacionesActivasRule implements LicenciaValidationRule {

    @Autowired
    private DesignacionRepository designacionRepository;

    @Override
    public void validate(Licencia licencia) throws BusinessLogicException {
        // Primero verificamos si la persona tiene algún cargo en la institución
        boolean tieneAlgunCargo = designacionRepository.existsDesignacionesPorPersona(
                licencia.getPersona().getDni());

        if (!tieneAlgunCargo) {
            throw new BusinessLogicException("NO se otorga Licencia artículo " +
                    licencia.getArticuloLicencia().getArticulo() + " a " +
                    licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido() +
                    " debido a que el agente no posee ningún cargo en la institución");
        }

        // Ahora verificamos si existe alguna designación que contenga completamente el
        // período de licencia
        List<Designacion> designacionesActivas = designacionRepository.findDesignacionesActivasPorPersonaYPeriodo(
                licencia.getPersona().getDni(),
                licencia.getPedidoDesde(),
                licencia.getPedidoHasta());

        // Verificar que exista al menos una designación que cubra completamente el
        // período de la licencia
        if (designacionesActivas == null || designacionesActivas.isEmpty()) {
            throw new BusinessLogicException("NO se otorga Licencia artículo " +
                    licencia.getArticuloLicencia().getArticulo() + " a " +
                    licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido() +
                    " debido a que el agente no tiene designación ese día en la institución");
        }
    }
}