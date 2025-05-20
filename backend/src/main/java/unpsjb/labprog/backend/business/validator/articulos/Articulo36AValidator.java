package unpsjb.labprog.backend.business.validator.articulos;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.repository.LicenciaRepository;
import unpsjb.labprog.backend.exception.BusinessLogicException;
import unpsjb.labprog.backend.model.Licencia;

/**
 * Validador específico para el artículo 36A: Asuntos particulares
 * Reglas:
 * - Máximo 2 días por mes
 * - Máximo 6 días por año
 */
@Component
public class Articulo36AValidator implements ArticuloLicenciaValidator {

    @Autowired
    private LicenciaRepository licenciaRepository;

    private static final int MAX_DIAS_POR_MES = 2;
    private static final int MAX_DIAS_POR_ANIO = 6;

    @Override
    public String getArticuloCode() {
        return "36A";
    }

    @Override
    public void validar(Licencia licencia) throws BusinessLogicException {
        LocalDateTime inicio = licencia.getPedidoDesde();
        LocalDateTime fin = licencia.getPedidoHasta();
        int anio = inicio.getYear();

        // Calcular días solicitados en esta licencia
        long diasSolicitados = ChronoUnit.DAYS.between(inicio.toLocalDate(), fin.toLocalDate()) + 1;

        // Verificar días por mes
        validarDiasPorMes(licencia, diasSolicitados);

        // Verificar días por año
        validarDiasPorAnio(licencia, anio, diasSolicitados);
    }

    private void validarDiasPorMes(Licencia licencia, long diasSolicitados) throws BusinessLogicException {
        LocalDateTime inicio = licencia.getPedidoDesde();
        int anio = inicio.getYear();
        int mes = inicio.getMonthValue();

        // Buscar licencias del mismo artículo para el mismo mes y año
        List<Licencia> licenciasDelMes = licenciaRepository.findLicenciasPorPersonaArticuloYMes(
                licencia.getPersona().getDni(),
                getArticuloCode(),
                anio,
                mes,
                licencia.getId() > 0 ? licencia.getId() : null);

        // Calcular días ya utilizados en el mes
        long diasDelMes = licenciasDelMes.stream()
                .mapToLong(lic -> ChronoUnit.DAYS.between(lic.getPedidoDesde().toLocalDate(),
                        lic.getPedidoHasta().toLocalDate()) + 1)
                .sum();

        // Verificar que no supere el límite mensual
        if (diasDelMes + diasSolicitados > MAX_DIAS_POR_MES) {
            throw new BusinessLogicException(
                    "NO se otorga Licencia artículo " + getArticuloCode() + " a " +
                            licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido() +
                            " debido a que supera el tope de " + MAX_DIAS_POR_MES + " días de licencia por mes");
        }
    }

    private void validarDiasPorAnio(Licencia licencia, int anio, long diasSolicitados) throws BusinessLogicException {
        // Buscar licencias existentes del mismo artículo para el mismo año
        List<Licencia> licenciasDelAnio = licenciaRepository.findLicenciasPorPersonaArticuloYAnio(
                licencia.getPersona().getDni(),
                getArticuloCode(),
                anio,
                licencia.getId() > 0 ? licencia.getId() : null);

        // Calcular días ya utilizados en el año
        long diasYaUtilizados = licenciasDelAnio.stream()
                .mapToLong(lic -> ChronoUnit.DAYS.between(lic.getPedidoDesde().toLocalDate(),
                        lic.getPedidoHasta().toLocalDate()) + 1)
                .sum();

        // Verificar que no supere el límite anual
        if (diasYaUtilizados + diasSolicitados > MAX_DIAS_POR_ANIO) {
            throw new BusinessLogicException(
                    "NO se otorga Licencia artículo " + getArticuloCode() + " a " +
                            licencia.getPersona().getNombre() + " " + licencia.getPersona().getApellido() +
                            " debido a que supera el tope de " + MAX_DIAS_POR_ANIO + " días de licencia por año");
        }
    }
}
