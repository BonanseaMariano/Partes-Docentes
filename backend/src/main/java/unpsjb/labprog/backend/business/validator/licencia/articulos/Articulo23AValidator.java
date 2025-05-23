package unpsjb.labprog.backend.business.validator.licencia.articulos;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador específico para el artículo 23A: Atención de un miembro del grupo
 * familiar
 * Regla principal: Máximo 30 días por año
 */
@Component
public class Articulo23AValidator implements ArticuloLicenciaValidator {

    @Autowired
    private LicenciaRepository licenciaRepository;

    private static final int MAX_DIAS_POR_ANIO = 30;

    @Override
    public String getArticuloCode() {
        return "23A";
    }

    @Override
    public void validar(Licencia licencia) throws BusinessLogicException {
        LocalDateTime inicio = licencia.getPedidoDesde();
        LocalDateTime fin = licencia.getPedidoHasta();
        int anio = inicio.getYear();

        // Calcular días solicitados en esta licencia
        long diasSolicitados = ChronoUnit.DAYS.between(inicio.toLocalDate(), fin.toLocalDate()) + 1;

        // Buscar licencias existentes del mismo artículo para el mismo año
        List<Licencia> licenciasDelAnio = licenciaRepository.findLicenciasPorPersonaArticuloYAnio(
                licencia.getPersona().getDni(),
                getArticuloCode(),
                anio,
                licencia.getId() > 0 ? licencia.getId() : null);

        // Calcular días ya utilizados
        long diasYaUtilizados = licenciasDelAnio.stream()
                .mapToLong(lic -> ChronoUnit.DAYS.between(lic.getPedidoDesde().toLocalDate(),
                        lic.getPedidoHasta().toLocalDate()) + 1)
                .sum();

        // Verificar que no supere el límite anual
        if (diasYaUtilizados + diasSolicitados > MAX_DIAS_POR_ANIO) {
            throw new BusinessLogicException(
                    "NO se otorga Licencia artículo " + getArticuloCode() + " a " +
                            licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido() +
                            " debido a que supera el tope de " + MAX_DIAS_POR_ANIO + " días de licencia");
        }
    }
}
