import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { DesignacionConDias, LicenciasPorArticulo, Reporte } from '../models/reporte';
import { PersonaService } from '../persona/service/persona.service';
import { FechaFormatPipe } from '../pipes/fecha-format.pipe';
import { TipoDesignacionPipe } from '../pipes/tipo-designacion.pipe';

// ApexCharts
import {
    ApexAxisChartSeries,
    ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries | number[]; // Permite tanto series de barras como de torta
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

@Component({
    selector: 'app-reporte',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, FechaFormatPipe, TipoDesignacionPipe, NgApexchartsModule],
    templateUrl: './reporte.component.html',
    styleUrl: './reporte.component.css'
})
export class ReporteComponent implements OnInit {
    reporte: Reporte | null = null;
    dni: number = 0;
    anioSeleccionado: number = new Date().getFullYear();    // Gráfico de distribución mensual
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
        private modalService: ModalService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.dni = +params['dni'];
            this.anioSeleccionado = +params['anio'] || new Date().getFullYear();
            this.cargarReporte();
        });
    }

    cargarReporte(): void {
        this.reporte = null; // Limpiamos el reporte antes de cargar nuevos datos

        this.personaService.obtenerReporte(this.dni, this.anioSeleccionado).subscribe({
            next: (response: any) => {
                if (response.status === HttpStatusCode.Ok) {
                    this.reporte = response.data;
                    // Inicializar el gráfico cuando los datos estén disponibles
                    setTimeout(() => {
                        this.inicializarGraficoMeses();
                        this.inicializarGraficoArticulos();
                    }, 100);
                } else {
                    this.modalService.error(
                        "Error al cargar reporte",
                        response.message || "No se pudo cargar el reporte",
                        ""
                    );
                }
            },
            error: (error: any) => {
                this.modalService.error(
                    "Error al cargar reporte",
                    "No se pudo cargar el reporte. Verifique que el DNI y año sean correctos.",
                    ""
                );
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
                text: "Licencias en " + this.anioSeleccionado,
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
                text: "Distribución de licencias por artículo en " + this.anioSeleccionado,
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
        // Limpiar datos antes de navegar
        this.reporte = null;
        this.chartOptions = {};
        this.chartOptionsArticulos = {};
        this.showMonthlyChart = false;
        this.showArticleChart = false;

        // Navegar a la nueva URL con el año seleccionado
        this.router.navigate(['/personas', 'dni', this.dni, 'reporte', this.anioSeleccionado]);
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

        switch (this.reporte.Calificacion.toLowerCase()) {
            case 'excelente':
                return 'badge bg-success';
            case 'muy bueno':
                return 'badge bg-primary';
            case 'bueno':
                return 'badge bg-info';
            case 'regular':
                return 'badge bg-warning';
            case 'deficiente':
                return 'badge bg-danger';
            default:
                return 'badge bg-secondary';
        }
    }

    // Método para obtener el año de forma segura (lo mantenemos porque es útil)
    getAnioReporte(): number {
        return this.reporte?.Anio || this.anioSeleccionado;
    }
}
