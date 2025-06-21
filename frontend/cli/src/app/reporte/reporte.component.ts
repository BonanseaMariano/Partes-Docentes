/**
 * @fileoverview Componente principal para la generación y visualización de reportes académicos.
 * Proporciona funcionalidades avanzadas de análisis y visualización de datos del personal docente.
 * 
 * @description Este componente maneja la funcionalidad central para generar reportes personalizados
 * de docentes, incluyendo información de designaciones, licencias, estadísticas y análisis visual
 * mediante gráficos interactivos. Utiliza ApexCharts para la visualización de datos y proporciona
 * filtros por año académico y docente específico.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */

import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { DesignacionConDias, LicenciasPorArticulo, Reporte } from '../models/reporte';
import { PersonaService } from '../persona/service/persona.service';
import { FechaFormatPipe } from '../pipes/fecha-format.pipe';
import { TipoDesignacionPipe } from '../pipes/tipo-designacion.pipe';
import { ReporteAnimationService } from './reporte-animation.service';

// ApexCharts
import {
    ApexAxisChartSeries,
    ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule
} from "ng-apexcharts";

/**
 * Tipo de configuración para gráficos ApexCharts utilizados en el componente.
 * 
 * Define la estructura de opciones disponibles para la configuración de gráficos
 * de barras, torta y otros tipos soportados por ApexCharts. Permite flexibilidad
 * en la visualización de datos estadísticos del sistema académico.
 * 
 * @typedef {Object} ChartOptions
 * @property {ApexAxisChartSeries | number[]} series - Datos de las series del gráfico
 * @property {ApexChart} chart - Configuración general del gráfico
 * @property {ApexXAxis} xaxis - Configuración del eje X
 * @property {ApexYAxis} yaxis - Configuración del eje Y
 * @property {ApexStroke} stroke - Configuración de bordes y líneas
 * @property {ApexDataLabels} dataLabels - Configuración de etiquetas de datos
 * @property {ApexPlotOptions} plotOptions - Opciones específicas del tipo de gráfico
 * @property {ApexFill} fill - Configuración de relleno
 * @property {ApexTooltip} tooltip - Configuración de tooltips
 * @property {ApexLegend} legend - Configuración de la leyenda
 * @property {string[]} colors - Paleta de colores del gráfico
 * @property {ApexTitleSubtitle} title - Configuración del título
 * @property {string[]} [labels] - Etiquetas opcionales para gráficos de torta
 * @property {ApexResponsive[]} [responsive] - Configuración responsiva opcional
 */
export type ChartOptions = {
    series: ApexAxisChartSeries | number[];
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    fill: ApexFill;
    tooltip: ApexTooltip;
    legend: ApexLegend;
    colors: string[];
    title: ApexTitleSubtitle;
    labels?: string[];
    responsive?: ApexResponsive[];
};

/**
 * Componente principal para la generación y visualización de reportes académicos.
 * 
 * Este componente proporciona una interfaz completa para generar reportes detallados
 * del personal docente, incluyendo análisis de designaciones, licencias, estadísticas
 * anuales y visualizaciones gráficas interactivas. Utiliza ApexCharts para crear
 * gráficos dinámicos y filtros avanzados por año académico y docente específico.
 * 
 * Características principales:
 * - Generación de reportes personalizados por docente
 * - Filtrado por año académico
 * - Visualizaciones gráficas interactivas
 * - Análisis de designaciones y licencias
 * - Estadísticas de actividad académica
 * - Exportación y visualización de datos
 * - Integración con servicios de animación
 * - Navegación por URL con parámetros
 * 
 * @class ReporteComponent
 * @implements {OnInit, AfterViewInit}
 */
@Component({
    selector: 'app-reporte',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, FechaFormatPipe, TipoDesignacionPipe, NgApexchartsModule],
    templateUrl: './reporte.component.html',
    styleUrl: './reporte.component.css'
})
export class ReporteComponent implements OnInit, AfterViewInit {
    /**
     * Datos del reporte académico obtenidos del backend.
     * Contiene información completa del docente incluyendo designaciones, licencias y estadísticas.
     * @type {Reporte | null}
     */
    reporte: Reporte | null = null;

    /**
     * DNI del docente para el cual generar el reporte.
     * Se utiliza como filtro principal para la consulta de datos.
     * @type {number}
     */
    dni: number = 0;

    /**
     * Año académico seleccionado para el reporte.
     * Por defecto se establece en el año actual.
     * @type {number}
     */
    anioSeleccionado: number = new Date().getFullYear();

    /**
     * Indicador del estado de carga de datos.
     * Se utiliza para mostrar spinners y deshabilitar controles durante las consultas.
     * @type {boolean}
     */
    isLoading: boolean = false;

    /**
     * Lista de años académicos disponibles obtenidos dinámicamente.
     * Se poblará con los años que tienen datos en el sistema.
     * @type {number[]}
     */
    aniosDisponibles: number[] = [];
    anioMinimo: number = 2020;
    anioMaximo: number = new Date().getFullYear();

    // Gráfico de distribución mensual
    @ViewChild("chart") chart!: ChartComponent;
    public chartOptions: Partial<ChartOptions> = {};
    public showMonthlyChart: boolean = false;

    // Gráfico de distribución por artículo
    @ViewChild("chartArticulos") chartArticulos!: ChartComponent;
    public chartOptionsArticulos: Partial<ChartOptions> = {};
    public showArticleChart: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private personaService: PersonaService,
        private modalService: ModalService,
        private elementRef: ElementRef,
        private reporteAnimationService: ReporteAnimationService
    ) {
        // Generar lista de años disponibles
        this.generarAniosDisponibles();
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.dni = +params['dni'];
            this.anioSeleccionado = +params['anio'] || new Date().getFullYear();
            this.cargarReporte();
        });
    }

    ngAfterViewInit(): void {
        // Configurar animaciones iniciales
        this.reporteAnimationService.animateInitialEntrance(this.elementRef);
    }

    cargarReporte(): void {
        this.reporte = null; // Limpiamos el reporte antes de cargar nuevos datos
        this.isLoading = true;

        // Si hay datos existentes, animar transición
        if (this.reporte) {
            this.reporteAnimationService.animateDataTransition(this.elementRef, () => {
                this.loadReporteData();
            });
        } else {
            this.loadReporteData();
        }
    }

    /**
     * Método privado para cargar los datos del reporte
     */
    private loadReporteData(): void {
        this.personaService.obtenerReporte(this.dni, this.anioSeleccionado).subscribe({
            next: (response: any) => {
                this.isLoading = false;
                if (response.status === HttpStatusCode.Ok) {
                    this.reporte = response.data;

                    // Animar carga de datos con secuencia completa
                    setTimeout(() => {
                        this.reporteAnimationService.animateDataLoad(
                            this.elementRef,
                            () => {
                                // Configurar hover effects después de cargar
                                this.reporteAnimationService.setupHoverEffects(this.elementRef);

                                // Animar contadores
                                this.reporteAnimationService.animateCounters(this.elementRef);

                                // Inicializar gráficos inmediatamente (ApexCharts maneja sus propias animaciones)
                                this.inicializarGraficoMeses();
                                this.inicializarGraficoArticulos();
                            }
                        );
                    }, 50);
                } else {
                    this.modalService.error(
                        "Error al cargar reporte",
                        response.message || "No se pudo cargar el reporte",
                        ""
                    );
                    // Animar error
                    setTimeout(() => {
                        this.reporteAnimationService.animateError(this.elementRef);
                    }, 50);
                }
            },
            error: (error: any) => {
                this.isLoading = false;
                this.modalService.error(
                    "Error al cargar reporte",
                    "No se pudo cargar el reporte. Verifique que el DNI y año sean correctos.",
                    ""
                );
                // Animar error
                setTimeout(() => {
                    this.reporteAnimationService.animateError(this.elementRef);
                }, 50);
            }
        });
    }

    inicializarGraficoMeses(): void {
        if (!this.reporte) return;

        // Obtener datos de licencias por mes
        const mesesLicencia = this.getMesesLicencia();
        if (mesesLicencia.length === 0) {
            this.showMonthlyChart = false;
            return;
        }

        // Preparar series para el gráfico
        const serieData = mesesLicencia.map(item => item.dias);
        const categorias = mesesLicencia.map(item => item.mes);

        // Configurar opciones del gráfico
        this.chartOptions = {
            series: [{
                name: "Días de licencia",
                data: serieData
            }],
            chart: {
                type: "bar",
                height: 350,
                toolbar: {
                    show: true
                },
                animations: {
                    enabled: true,
                    speed: 500,
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
                background: "#f8f9fa",
                fontFamily: 'inherit',
                dropShadow: {
                    enabled: true,
                    opacity: 0.1,
                    blur: 3
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "55%",
                    borderRadius: 6,
                    distributed: false,
                    dataLabels: {
                        position: 'top'
                    }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val ? Number(val) > 0 ? val.toString() : '' : '';
                },
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    colors: ['#333']
                },
                offsetY: -20
            },
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"]
            },
            xaxis: {
                categories: categorias,
                title: {
                    text: "Meses"
                }
            },
            yaxis: {
                title: {
                    text: "Días"
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + " días";
                    }
                },
                theme: 'light',
                marker: {
                    show: true,
                },
                x: {
                    show: true,
                    formatter: function (val, opts) {
                        return "Mes: " + val;
                    }
                }
            },
            title: {
                text: `Licencias en ${this.anioSeleccionado} - ${this.reporte?.Docente.Nombre}, ${this.reporte?.Docente.Apellido}`,
                align: 'center',
                style: {
                    fontSize: '16px',
                    fontWeight: 500
                }
            },
            colors: ["#ffc107"]
        };

        this.showMonthlyChart = true;
    }

    inicializarGraficoArticulos(): void {
        if (!this.reporte) return;

        // Obtener datos de licencias por artículo
        const articulosLicencia = this.getArticulosLicencia();
        if (articulosLicencia.length === 0) {
            this.showArticleChart = false;
            return;
        }

        // Preparar series para el gráfico de torta (debe ser un array de números)
        const serieData = articulosLicencia.map(item => item.data.Dias);
        const categorias = articulosLicencia.map(item => item.articulo);

        // Configurar opciones del gráfico
        this.chartOptionsArticulos = {
            series: serieData, // Para gráficos de torta, series debe ser un array de números
            chart: {
                type: "pie",
                height: 350,
                toolbar: {
                    show: true
                },
                animations: {
                    enabled: true,
                    speed: 500,
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
                background: "#f8f9fa",
                fontFamily: 'inherit',
            },
            labels: categorias,
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            legend: {
                position: 'right',
                offsetY: 40,
                floating: true,
                labels: {
                    colors: ['#333'],
                    useSeriesColors: false
                }
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + " días";
                    }
                },
                theme: 'light',
                marker: {
                    show: true,
                }
            },
            title: {
                text: `Distribución de licencias por artículo en ${this.anioSeleccionado} - ${this.reporte?.Docente.Nombre}, ${this.reporte?.Docente.Apellido}`,
                align: 'center',
                style: {
                    fontSize: '16px',
                    fontWeight: 500
                }
            },
            colors: ["#007bff", "#28a745", "#dc3545", "#ffc107", "#17a2b8", "#6c757d", "#fd7e14"]
        };

        this.showArticleChart = true;
    }

    onAnioChange(): void {
        // Animar transición de cambio de año
        this.reporteAnimationService.animateYearChange(this.elementRef, () => {
            // Limpiar datos antes de navegar
            this.reporte = null;
            this.chartOptions = {};
            this.chartOptionsArticulos = {};
            this.showMonthlyChart = false;
            this.showArticleChart = false;

            // Navegar a la nueva URL con el año seleccionado
            this.router.navigate(['/personas', 'dni', this.dni, 'reporte', this.anioSeleccionado]);
        });
    }

    volver(): void {
        this.router.navigate(['/personas']);
    }

    getDesignacionesActivas(): DesignacionConDias[] {
        return this.reporte?.Designaciones || [];
    }

    getArticulosLicencia(): { articulo: string, data: LicenciasPorArticulo }[] {
        if (!this.reporte?.EstadisticasLicencias?.LicenciasPorArticulo) {
            return [];
        }

        return Object.entries(this.reporte.EstadisticasLicencias.LicenciasPorArticulo)
            .map(([articulo, data]) => ({ articulo, data }));
    }

    getMesesLicencia(): { mes: string, dias: number }[] {
        if (!this.reporte?.EstadisticasLicencias?.LicenciasPorMes) {
            return [];
        }

        return Object.entries(this.reporte.EstadisticasLicencias.LicenciasPorMes)
            .map(([mes, dias]) => ({ mes, dias: dias as number }));
    }

    getCalificacionClass(): string {
        if (!this.reporte?.Calificacion) return '';

        switch (this.reporte.Calificacion) {
            case 'Excelente':
                return 'text-success';
            case 'Muy Bueno':
                return 'text-info';
            case 'Bueno':
                return 'text-primary';
            case 'Regular':
                return 'text-warning';
            case 'Deficiente':
                return 'text-danger';
            default:
                return 'text-secondary';
        }
    }

    // Método para obtener el año de forma segura (lo mantenemos porque es útil)
    getAnioReporte(): number {
        return this.reporte?.Anio || this.anioSeleccionado;
    }

    /**
     * Genera la lista de años disponibles para el selector
     */
    private generarAniosDisponibles(): void {
        this.aniosDisponibles = [];

        // Generar años desde el máximo hasta el mínimo en orden descendente
        for (let anio = this.anioMaximo; anio >= this.anioMinimo; anio--) {
            this.aniosDisponibles.push(anio);
        }
    }

    /**
     * Actualiza el rango de años disponibles
     * @param minimo Año mínimo disponible
     * @param maximo Año máximo disponible
     */
    actualizarRangoAnios(minimo: number, maximo: number): void {
        this.anioMinimo = minimo;
        this.anioMaximo = maximo;
        this.generarAniosDisponibles();
    }
}
