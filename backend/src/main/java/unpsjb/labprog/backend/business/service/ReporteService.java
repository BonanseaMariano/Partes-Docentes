package unpsjb.labprog.backend.business.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.dto.ReporteDTO;
import unpsjb.labprog.backend.model.Cargo;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;
import unpsjb.labprog.backend.model.Persona;
import unpsjb.labprog.backend.model.enums.Estado;

/**
 * Servicio especializado en la generación de reportes para docentes. Se encarga
 * de analizar las licencias y designaciones para generar estadísticas y
 * evaluaciones de desempeño.
 */
@Service
public class ReporteService {

    // ===============================================
    // CONSTANTES DE CONFIGURACIÓN
    // ===============================================
    // Umbrales de porcentajes para calificaciones de docentes
    /**
     * Porcentaje máximo de licencias para calificación "Excelente"
     */
    private static final double UMBRAL_EXCELENTE = 2.0;

    /**
     * Porcentaje máximo de licencias para calificación "Muy Bueno"
     */
    private static final double UMBRAL_MUY_BUENO = 5.0;

    /**
     * Porcentaje máximo de licencias para calificación "Bueno"
     */
    private static final double UMBRAL_BUENO = 8.0;

    /**
     * Porcentaje máximo de licencias para calificación "Regular"
     */
    private static final double UMBRAL_REGULAR = 12.0;

    /**
     * Array con los nombres de los meses del año
     */
    private static final String[] NOMBRES_MESES = {
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    };

    @Autowired
    private PersonaService personaService;

    @Autowired
    private LicenciaService licenciaService;

    /**
     * Genera el reporte para una persona específica en un año determinado.
     * Incluye análisis estadístico de licencias y calificación del desempeño.
     *
     * @param dni DNI de la persona
     * @param año Año para el cual generar el reporte
     * @return ReporteDTO con estadísticas y análisis de licencias
     * @throws IllegalArgumentException si no se encuentra la persona con el DNI
     * especificado
     */
    public ReporteDTO generarReporte(Long dni, Integer año) {
        Persona persona = personaService.findByDni(dni);
        if (persona == null) {
            throw new IllegalArgumentException("No se encontró persona con DNI: " + dni);
        }

        // Crear información del docente
        ReporteDTO.DocenteInfo docenteInfo = crearInfoDocente(persona, dni);

        // Obtener designaciones del año
        List<ReporteDTO.DesignacionConDias> designacionesInfo
                = obtenerDesignacionesDelAño(persona, año);

        // Calcular estadísticas de licencias
        ReporteDTO.EstadisticasLicencias estadisticas
                = calcularEstadisticasLicencias(persona, año);

        // Determinar calificación basada en estadísticas
        String calificacion = determinarCalificacion(estadisticas);

        return new ReporteDTO(año, docenteInfo, designacionesInfo, estadisticas, calificacion);
    }

    /**
     * Crea la información básica del docente para el reporte
     */
    private ReporteDTO.DocenteInfo crearInfoDocente(Persona persona, Long dni) {
        return new ReporteDTO.DocenteInfo(
                dni,
                persona.getNombre(),
                persona.getApellido()
        );
    }

    /**
     * Obtiene las designaciones del docente para el año especificado
     */
    private List<ReporteDTO.DesignacionConDias> obtenerDesignacionesDelAño(Persona persona, Integer año) {
        return persona.getDesignaciones()
                .stream()
                .filter(d -> designacionAplicaAlAño(d, año))
                .map(d -> convertToDesignacionConDias(d, año))
                .collect(Collectors.toList());
    }

    /**
     * Verifica si una designación aplica al año especificado
     */
    public boolean designacionAplicaAlAño(Designacion designacion, Integer año) {
        LocalDate inicioAño = LocalDate.of(año, 1, 1);
        LocalDate finAño = LocalDate.of(año, 12, 31);

        LocalDate fechaInicio = designacion.getFechaInicio().toLocalDate();
        LocalDate fechaFin = designacion.getFechaFin() != null
                ? designacion.getFechaFin().toLocalDate() : finAño;

        return !(fechaFin.isBefore(inicioAño) || fechaInicio.isAfter(finAño));
    }

    /**
     * Convierte una Designacion a DesignacionConDias ajustada al año
     */
    private ReporteDTO.DesignacionConDias convertToDesignacionConDias(Designacion designacion, Integer año) {
        LocalDate inicioAño = LocalDate.of(año, 1, 1);
        LocalDate finAño = LocalDate.of(año, 12, 31);

        LocalDate fechaInicio = designacion.getFechaInicio().toLocalDate();
        LocalDate fechaFin = designacion.getFechaFin() != null
                ? designacion.getFechaFin().toLocalDate() : finAño;

        // Ajustar fechas al año consultado
        LocalDate inicioEnAño = fechaInicio.isBefore(inicioAño) ? inicioAño : fechaInicio;
        LocalDate finEnAño = fechaFin.isAfter(finAño) ? finAño : fechaFin;

        // Calcular días de designación en el año
        int diasDesignacion = (int) ChronoUnit.DAYS.between(inicioEnAño, finEnAño) + 1;

        // Crear DesignacionInfo sin información de persona
        ReporteDTO.DesignacionInfo designacionInfo = createDesignacionInfo(designacion);

        return new ReporteDTO.DesignacionConDias(
                designacionInfo,
                inicioEnAño,
                finEnAño,
                diasDesignacion
        );
    }

    /**
     * Crea un objeto DesignacionInfo a partir de una Designacion, excluyendo
     * información de persona
     */
    private ReporteDTO.DesignacionInfo createDesignacionInfo(Designacion designacion) {
        Cargo cargo = designacion.getCargo();

        // Crear DivisionInfo
        ReporteDTO.DesignacionInfo.CargoInfo.DivisionInfo divisionInfo = null;
        if (cargo.getDivision() != null) {
            divisionInfo = new ReporteDTO.DesignacionInfo.CargoInfo.DivisionInfo(
                    cargo.getDivision().getAnio(),
                    cargo.getDivision().getNumDivision(),
                    cargo.getDivision().getOrientacion(),
                    cargo.getDivision().getTurno().name()
            );
        }

        // Crear CargoInfo
        ReporteDTO.DesignacionInfo.CargoInfo cargoInfo = new ReporteDTO.DesignacionInfo.CargoInfo(
                cargo.getNombre(),
                cargo.getCargaHoraria(),
                cargo.getFechaInicio(),
                cargo.getFechaFin(),
                cargo.getTipoDesignacion(),
                divisionInfo
        );

        // Crear DesignacionInfo
        return new ReporteDTO.DesignacionInfo(
                designacion.getSituacionRevista(),
                designacion.getFechaInicio(),
                designacion.getFechaFin(),
                cargoInfo
        );
    }

    /**
     * Calcula las estadísticas de licencias para el año especificado Solo
     * considera licencias con estado VÁLIDO
     */
    private ReporteDTO.EstadisticasLicencias calcularEstadisticasLicencias(Persona persona, Integer año) {
        // Obtener SOLO licencias VÁLIDAS del año
        List<Licencia> licenciasValidasDelAño = licenciaService.findLicenciasPorPersonaYAño(persona, año);

        ReporteDTO.EstadisticasLicencias estadisticas = new ReporteDTO.EstadisticasLicencias();

        // Calcular total de días de licencia (solo licencias válidas)
        int totalDiasLicencia = licenciasValidasDelAño.stream()
                .mapToInt(this::calcularDiasLicencia)
                .sum();

        estadisticas.setTotalDiasLicencia(totalDiasLicencia);

        // Calcular total de días de designación del docente en el año
        List<ReporteDTO.DesignacionConDias> designacionesDelAño = obtenerDesignacionesDelAño(persona, año);
        int totalDiasDesignacion = designacionesDelAño.stream()
                .mapToInt(ReporteDTO.DesignacionConDias::getDiasDesignacionEnAño)
                .sum();

        // Calcular porcentaje anual usando días de designación reales
        double porcentaje = totalDiasDesignacion > 0 ? (totalDiasLicencia * 100.0) / totalDiasDesignacion : 0.0;
        estadisticas.setPorcentajeLicenciaAnual(Math.round(porcentaje * 100.0) / 100.0);

        // Calcular licencias por mes (solo válidas)
        Map<String, Integer> licenciasPorMes = calcularLicenciasPorMes(licenciasValidasDelAño, año);
        estadisticas.setLicenciasPorMes(licenciasPorMes);

        // Calcular licencias por artículo (solo válidas)
        Map<String, ReporteDTO.LicenciasPorArticulo> licenciasPorArticulo
                = calcularLicenciasPorArticulo(licenciasValidasDelAño);
        estadisticas.setLicenciasPorArticulo(licenciasPorArticulo);

        return estadisticas;
    }

    /**
     * Calcula la distribución de días de licencia por mes Solo considera
     * licencias válidas
     */
    public Map<String, Integer> calcularLicenciasPorMes(List<Licencia> licenciasValidas, Integer año) {
        Map<String, Integer> licenciasPorMes = new LinkedHashMap<>();

        // Inicializar todos los meses en 0 usando la constante
        for (String mes : NOMBRES_MESES) {
            licenciasPorMes.put(mes, 0);
        }

        // Calcular días por mes (solo licencias válidas)
        for (Licencia licencia : licenciasValidas) {
            // Verificar nuevamente que sea válida por seguridad
            if (licencia.getEstado() != Estado.VALIDO) {
                continue;
            }

            LocalDate desde = licencia.getPedidoDesde().toLocalDate();
            LocalDate hasta = licencia.getPedidoHasta().toLocalDate();

            LocalDate fecha = desde;
            while (!fecha.isAfter(hasta)) {
                if (fecha.getYear() == año) {
                    String mes = NOMBRES_MESES[fecha.getMonthValue() - 1];
                    licenciasPorMes.put(mes, licenciasPorMes.get(mes) + 1);
                }
                fecha = fecha.plusDays(1);
            }
        }

        return licenciasPorMes;
    }

    /**
     * Calcula las estadísticas de licencias agrupadas por artículo Solo
     * considera licencias válidas
     */
    private Map<String, ReporteDTO.LicenciasPorArticulo> calcularLicenciasPorArticulo(List<Licencia> licenciasValidas) {
        Map<String, ReporteDTO.LicenciasPorArticulo> resultado = new HashMap<>();

        for (Licencia licencia : licenciasValidas) {
            // Verificar nuevamente que sea válida por seguridad
            if (licencia.getEstado() != Estado.VALIDO) {
                continue;
            }

            String articulo = licencia.getArticuloLicencia().getArticulo();

            if (!resultado.containsKey(articulo)) {
                resultado.put(articulo, new ReporteDTO.LicenciasPorArticulo(
                        licencia.getArticuloLicencia().getDescripcion(), 0, 0));
            }

            ReporteDTO.LicenciasPorArticulo stats = resultado.get(articulo);
            stats.setDias(stats.getDias() + calcularDiasLicencia(licencia));
            stats.setCantidad(stats.getCantidad() + 1);
        }

        return resultado;
    }

    /**
     * Determina la calificación del docente basada en el porcentaje de
     * licencias usando constantes definidas
     */
    private String determinarCalificacion(ReporteDTO.EstadisticasLicencias estadisticas) {
        double porcentaje = estadisticas.getPorcentajeLicenciaAnual();

        if (porcentaje <= UMBRAL_EXCELENTE) {
            return "Excelente";
        } else if (porcentaje <= UMBRAL_MUY_BUENO) {
            return "Muy Bueno";
        } else if (porcentaje <= UMBRAL_BUENO) {
            return "Bueno";
        } else if (porcentaje <= UMBRAL_REGULAR) {
            return "Regular";
        } else {
            return "Deficiente";
        }
    }

    /**
     * Calcula los días de una licencia específica
     */
    private int calcularDiasLicencia(Licencia licencia) {
        return (int) ChronoUnit.DAYS.between(
                licencia.getPedidoDesde().toLocalDate(),
                licencia.getPedidoHasta().toLocalDate()) + 1;
    }
}
