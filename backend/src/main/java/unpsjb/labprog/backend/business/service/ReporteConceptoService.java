package unpsjb.labprog.backend.business.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.dto.ReporteConceptoDTO;
import unpsjb.labprog.backend.dto.ReporteDTO;
import unpsjb.labprog.backend.model.Designacion;
import unpsjb.labprog.backend.model.Licencia;
import unpsjb.labprog.backend.model.Persona;

/**
 * Servicio para la generación de reportes de concepto general de la
 * institución. Analiza estadísticas consolidadas de todos los docentes en un
 * año determinado, incluyendo licencias, designaciones y calificaciones
 * generales.
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
@Service
public class ReporteConceptoService {

    /**
     * Número aproximado de días laborables por año.
     */
    private static final int DIAS_LABORABLES_POR_ANO = 260;

    /**
     * Porcentaje máximo de días de licencia para calificación "Excelente".
     */
    private static final double UMBRAL_EXCELENTE_INSTITUCION = 5.0;

    /**
     * Porcentaje máximo de días de licencia para calificación "Muy Bueno".
     */
    private static final double UMBRAL_MUY_BUENO_INSTITUCION = 10.0;

    /**
     * Porcentaje máximo de días de licencia para calificación "Bueno".
     */
    private static final double UMBRAL_BUENO_INSTITUCION = 30.0;

    /**
     * Porcentaje máximo de días de licencia para calificación "Regular".
     */
    private static final double UMBRAL_REGULAR_INSTITUCION = 50.0;

    /**
     * Nombres de los meses del año para reportes.
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
    private DesignacionService designacionService;

    @Autowired
    private ReporteService reporteService;

    /**
     * Genera el reporte de concepto general para todos los docentes en un año
     * específico. Incluye estadísticas consolidadas de la institución y
     * reportes individuales completos.
     *
     * @param año año para el cual generar el reporte
     * @return reporte de concepto con estadísticas generales y reportes
     * individuales
     */
    public ReporteConceptoDTO generarReporteConcepto(Integer año) {
        List<Persona> todasLasPersonas = personaService.findAll();

        ReporteConceptoDTO.EstadisticasGenerales estadisticasGenerales
                = calcularEstadisticasGenerales(todasLasPersonas, año);

        Map<String, Integer> distribucionDiasLicencias
                = calcularDistribucionGeneralPorMes(todasLasPersonas, año);

        List<ReporteDTO> reportesDocentes = generarReportesCompletos(todasLasPersonas, año);

        String calificacionGeneral = determinarCalificacionGeneral(estadisticasGenerales);

        return new ReporteConceptoDTO(año, estadisticasGenerales,
                distribucionDiasLicencias, calificacionGeneral, reportesDocentes);
    }

    /**
     * Calcula las estadísticas generales para todos los docentes en un año
     * específico. Incluye total de designaciones, licencias, licencias sin
     * suplente, días de licencias y distribución por tipo de artículo.
     *
     * @param personas lista de todas las personas del sistema
     * @param año año para el cual calcular las estadísticas
     * @return estadísticas generales consolidadas
     */
    private ReporteConceptoDTO.EstadisticasGenerales calcularEstadisticasGenerales(
            List<Persona> personas, Integer año) {

        int totalDesignaciones = 0;
        int totalLicencias = 0;
        int licenciasSinSuplente = 0;
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
                                licencia.getPedidoDesde(),
                                licencia.getPedidoHasta()) + 1;
                        totalDiasLicencias += diasLicencia;

                        // Verificar si la licencia tiene suplentes
                        List<Designacion> reemplazos = designacionService.findDesignacionesReemplazoPorLicencia(licencia);
                        if (reemplazos.isEmpty()) {
                            licenciasSinSuplente++;
                        }

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
                licenciasSinSuplente,
                totalDiasLicencias,
                licenciasPorArticulo,
                diasLicenciasPorArticulo,
                Math.round(promedioLicenciasPorDesignacion * 100.0) / 100.0,
                Math.round(porcentajeDiasLicenciaAnual * 100.0) / 100.0
        );
    }

    /**
     * Calcula la distribución de días de licencia por mes para toda la
     * institución. Suma todos los días de licencia de todos los docentes
     * agrupados por mes.
     *
     * @param personas lista de todas las personas del sistema
     * @param año año para el cual calcular la distribución
     * @return mapa con nombres de meses como clave y total de días de licencia
     * como valor
     */
    private Map<String, Integer> calcularDistribucionGeneralPorMes(
            List<Persona> personas, Integer año) {

        Map<String, Integer> distribucionGeneral = new LinkedHashMap<>();

        for (String mes : NOMBRES_MESES) {
            distribucionGeneral.put(mes, 0);
        }

        for (Persona persona : personas) {
            boolean tieneDesignacionesEnAño = persona.getDesignaciones()
                    .stream()
                    .anyMatch(d -> designacionAplicaAlAño(d, año));

            if (tieneDesignacionesEnAño) {
                List<Licencia> licenciasDelDocente
                        = licenciaService.findLicenciasPorPersonaYAño(persona, año);

                for (Licencia licencia : licenciasDelDocente) {
                    java.time.LocalDate inicioLicencia = licencia.getPedidoDesde();
                    java.time.LocalDate finLicencia = licencia.getPedidoHasta();

                    java.time.LocalDate inicioAño = java.time.LocalDate.of(año, 1, 1);
                    java.time.LocalDate finAño = java.time.LocalDate.of(año, 12, 31);

                    if (inicioLicencia.isBefore(inicioAño)) {
                        inicioLicencia = inicioAño;
                    }
                    if (finLicencia.isAfter(finAño)) {
                        finLicencia = finAño;
                    }

                    java.time.LocalDate fechaActual = inicioLicencia;
                    while (!fechaActual.isAfter(finLicencia)) {
                        String nombreMes = NOMBRES_MESES[fechaActual.getMonthValue() - 1];
                        distribucionGeneral.put(nombreMes, distribucionGeneral.get(nombreMes) + 1);
                        fechaActual = fechaActual.plusDays(1);
                    }
                }
            }
        }

        return distribucionGeneral;
    }

    /**
     * Genera reportes completos para todos los docentes con designaciones en el
     * año especificado. Los reportes se ordenan alfabéticamente por apellido y
     * nombre.
     *
     * @param personas lista de todas las personas del sistema
     * @param año año para el cual generar los reportes
     * @return lista de reportes individuales ordenada alfabéticamente
     */
    private List<ReporteDTO> generarReportesCompletos(List<Persona> personas, Integer año) {
        List<ReporteDTO> reportesDocentes = new java.util.ArrayList<>();

        for (Persona persona : personas) {
            boolean tieneDesignacionesEnAño = persona.getDesignaciones()
                    .stream()
                    .anyMatch(d -> designacionAplicaAlAño(d, año));

            if (tieneDesignacionesEnAño) {
                try {
                    ReporteDTO reporteDocente = reporteService.generarReporte(persona.getDni(), año);
                    reportesDocentes.add(reporteDocente);
                } catch (Exception e) {
                    System.err.println("Error generando reporte para docente " + persona.getDni() + ": " + e.getMessage());
                }
            }
        }

        reportesDocentes.sort((r1, r2) -> {
            int apellidoComparison = r1.getDocente().getApellido().compareToIgnoreCase(r2.getDocente().getApellido());
            if (apellidoComparison != 0) {
                return apellidoComparison;
            }
            return r1.getDocente().getNombre().compareToIgnoreCase(r2.getDocente().getNombre());
        });

        return reportesDocentes;
    }

    /**
     * Determina la calificación general de la institución basada en
     * estadísticas. Utiliza el porcentaje de días de licencia sobre días
     * laborables anuales.
     *
     * @param estadisticas estadísticas generales de la institución
     * @return calificación textual (Excelente, Muy Bueno, Bueno, Regular,
     * Deficiente)
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
     * Verifica si una designación aplica al año especificado. Una designación
     * aplica si se superpone temporalmente con el año consultado.
     *
     * @param designacion designación a verificar
     * @param año año de referencia
     * @return true si la designación es válida para el año, false en caso
     * contrario
     */
    private boolean designacionAplicaAlAño(Designacion designacion, Integer año) {
        java.time.LocalDate inicioAño = java.time.LocalDate.of(año, 1, 1);
        java.time.LocalDate finAño = java.time.LocalDate.of(año, 12, 31);

        java.time.LocalDate inicioDesignacion = designacion.getFechaInicio();
        java.time.LocalDate finDesignacion = designacion.getFechaFin() != null
                ? designacion.getFechaFin()
                : java.time.LocalDate.now();

        return !inicioDesignacion.isAfter(finAño) && !finDesignacion.isBefore(inicioAño);
    }
}
