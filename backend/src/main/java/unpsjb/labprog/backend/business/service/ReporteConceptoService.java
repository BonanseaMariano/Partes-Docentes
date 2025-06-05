package unpsjb.labprog.backend.business.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.dto.ReporteConceptoDTO;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;
import unpsjb.labprog.backend.model.Persona;

/**
 * Servicio especializado en la generación de reportes de concepto general para
 * toda la institución. Se encarga de analizar las estadísticas consolidadas de
 * todos los docentes en un año determinado.
 */
@Service
public class ReporteConceptoService {

    // ===============================================
    // CONSTANTES DE CONFIGURACIÓN
    // ===============================================
    /**
     * Número aproximado de días laborables por año (365 días - 104 fines de
     * semana - 1 día extra ≈ 260 días)
     */
    private static final int DIAS_LABORABLES_POR_ANO = 260;

    // Umbrales de porcentaje de días de licencia para calificaciones institucionales
    // Nota: Los valores son más permisivos considerando que pueden contarse días duplicados
    // cuando múltiples designaciones de la misma persona toman licencia el mismo día
    /**
     * Porcentaje máximo de días de licencia para calificación "Excelente"
     */
    private static final double UMBRAL_EXCELENTE_INSTITUCION = 5.0;

    /**
     * Porcentaje máximo de días de licencia para calificación "Muy Bueno"
     */
    private static final double UMBRAL_MUY_BUENO_INSTITUCION = 10.0;

    /**
     * Porcentaje máximo de días de licencia para calificación "Bueno"
     */
    private static final double UMBRAL_BUENO_INSTITUCION = 30.0;

    /**
     * Porcentaje máximo de días de licencia para calificación "Regular"
     */
    private static final double UMBRAL_REGULAR_INSTITUCION = 50.0;

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

    @Autowired
    private ReporteService reporteService;

    /**
     * Genera el reporte de concepto general para todos los docentes en un año
     * determinado. Incluye estadísticas consolidadas de la institución.
     *
     * @param año Año para el cual generar el reporte
     * @return ReporteConceptoDTO con estadísticas generales
     */
    public ReporteConceptoDTO generarReporteConcepto(Integer año) {
        // Obtener todos los docentes
        List<Persona> todasLasPersonas = personaService.findAll();

        // Calcular estadísticas generales
        ReporteConceptoDTO.EstadisticasGenerales estadisticasGenerales
                = calcularEstadisticasGenerales(todasLasPersonas, año);

        // Calcular distribución de licencias por mes para toda la institución
        Map<String, Integer> distribucionDiasLicencias
                = calcularDistribucionGeneralPorMes(todasLasPersonas, año);

        // Determinar calificación general
        String calificacionGeneral = determinarCalificacionGeneral(estadisticasGenerales);

        return new ReporteConceptoDTO(año, estadisticasGenerales,
                distribucionDiasLicencias, calificacionGeneral);
    }

    /**
     * Calcula las estadísticas generales para todos los docentes. Incluye:
     * total de designaciones, número de licencias, días totales de licencias,
     * distribución por tipo, y porcentajes. El promedio de licencias se calcula
     * sobre las designaciones activas.
     */
    private ReporteConceptoDTO.EstadisticasGenerales calcularEstadisticasGenerales(
            List<Persona> personas, Integer año) {

        int totalDesignaciones = 0;
        int totalLicencias = 0;
        int totalDiasLicencias = 0;
        Map<String, Integer> licenciasPorArticulo = new HashMap<>();
        Map<String, Integer> diasLicenciasPorArticulo = new HashMap<>();

        for (Persona persona : personas) {
            // Verificar si el docente tiene designaciones en el año
            List<Designacion> designacionesDelAño = persona.getDesignaciones()
                    .stream()
                    .filter(d -> designacionAplicaAlAño(d, año))
                    .collect(Collectors.toList());

            if (!designacionesDelAño.isEmpty()) {
                totalDesignaciones += designacionesDelAño.size();

                // Obtener licencias válidas del docente para el año
                List<Licencia> licenciasDelDocente
                        = licenciaService.findLicenciasPorPersonaYAño(persona, año);

                if (!licenciasDelDocente.isEmpty()) {
                    totalLicencias += licenciasDelDocente.size();

                    // Calcular días totales de licencias para este docente
                    for (Licencia licencia : licenciasDelDocente) {
                        int diasLicencia = (int) java.time.temporal.ChronoUnit.DAYS.between(
                                licencia.getPedidoDesde().toLocalDate(),
                                licencia.getPedidoHasta().toLocalDate()) + 1;
                        totalDiasLicencias += diasLicencia;

                        // Contar licencias y días por artículo
                        String articulo = licencia.getArticuloLicencia().getArticulo();
                        licenciasPorArticulo.put(articulo,
                                licenciasPorArticulo.getOrDefault(articulo, 0) + 1);
                        diasLicenciasPorArticulo.put(articulo,
                                diasLicenciasPorArticulo.getOrDefault(articulo, 0) + diasLicencia);
                    }
                }
            }
        }

        // Calcular promedios y porcentajes
        double promedioLicenciasPorDesignacion = totalDesignaciones > 0
                ? (double) totalLicencias / totalDesignaciones : 0.0;

        // Calcular porcentaje de días de licencia sobre días laborables del año
        double porcentajeDiasLicenciaAnual = (double) totalDiasLicencias * 100.0 / DIAS_LABORABLES_POR_ANO;

        return new ReporteConceptoDTO.EstadisticasGenerales(
                totalDesignaciones,
                totalLicencias,
                totalDiasLicencias,
                licenciasPorArticulo,
                diasLicenciasPorArticulo,
                Math.round(promedioLicenciasPorDesignacion * 100.0) / 100.0,
                Math.round(porcentajeDiasLicenciaAnual * 100.0) / 100.0
        );
    }

    /**
     * Calcula la distribución de días de licencia por mes para toda la
     * institución (suma todos los días de licencia de todos los docentes)
     */
    private Map<String, Integer> calcularDistribucionGeneralPorMes(
            List<Persona> personas, Integer año) {

        Map<String, Integer> distribucionGeneral = new LinkedHashMap<>();

        // Inicializar todos los meses en 0
        for (String mes : NOMBRES_MESES) {
            distribucionGeneral.put(mes, 0);
        }

        for (Persona persona : personas) {
            // Verificar si el docente tiene designaciones en el año
            boolean tieneDesignacionesEnAño = persona.getDesignaciones()
                    .stream()
                    .anyMatch(d -> designacionAplicaAlAño(d, año));

            if (tieneDesignacionesEnAño) {
                // Obtener licencias válidas del docente para el año
                List<Licencia> licenciasDelDocente
                        = licenciaService.findLicenciasPorPersonaYAño(persona, año);

                // Calcular distribución por mes para este docente
                Map<String, Integer> licenciasPorMes
                        = reporteService.calcularLicenciasPorMes(licenciasDelDocente, año);

                // Agregar a la distribución general
                for (Map.Entry<String, Integer> entry : licenciasPorMes.entrySet()) {
                    String mes = entry.getKey();
                    Integer dias = entry.getValue();
                    distribucionGeneral.put(mes, distribucionGeneral.get(mes) + dias);
                }
            }
        }

        return distribucionGeneral;
    }

    /**
     * Determina la calificación general de la institución basada en
     * estadísticas. Se basa en el porcentaje de días de licencia sobre días
     * laborables usando constantes definidas
     */
    private String determinarCalificacionGeneral(ReporteConceptoDTO.EstadisticasGenerales estadisticas) {
        double porcentajeDiasLicencia = estadisticas.getPorcentajeDiasLicenciaAnual();

        if (porcentajeDiasLicencia <= UMBRAL_EXCELENTE_INSTITUCION) {
            return "Excelente";
        } else if (porcentajeDiasLicencia <= UMBRAL_MUY_BUENO_INSTITUCION) {
            return "Muy Bueno";
        } else if (porcentajeDiasLicencia <= UMBRAL_BUENO_INSTITUCION) {
            return "Bueno";
        } else if (porcentajeDiasLicencia <= UMBRAL_REGULAR_INSTITUCION) {
            return "Regular";
        } else {
            return "Deficiente";
        }
    }

    /**
     * Verifica si una designación aplica al año especificado (delegado desde
     * ReporteService para evitar duplicación)
     */
    private boolean designacionAplicaAlAño(Designacion designacion, Integer año) {
        // Reutilizar la lógica del ReporteService a través de un método helper
        // Por ahora implementamos la lógica directamente
        return reporteService.designacionAplicaAlAño(designacion, año);
    }
}
