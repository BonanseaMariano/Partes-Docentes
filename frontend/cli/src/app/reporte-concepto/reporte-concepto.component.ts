import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';

import { ReporteConcepto, EstadisticasGenerales } from '../models/reporte-concepto';
import { Reporte } from '../models/reporte';
import { PersonaService } from '../persona/service/persona.service';
import { ModalService } from '../modal/modal.service';
import { PopupService } from '../popup/popup.service';
import { DniFormatPipe } from '../pipes/dni-format.pipe';
import { FechaFormatPipe } from '../pipes/fecha-format.pipe';

import {
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexYAxis,
    ApexStroke,
    ApexDataLabels,
    ApexPlotOptions,
    ApexFill,
    ApexTooltip,
    ApexLegend,
    ApexTitleSubtitle,
    ApexResponsive
} from 'ng-apexcharts';

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

@Component({
    selector: 'app-reporte-concepto',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, NgApexchartsModule, DniFormatPipe, FechaFormatPipe],
    templateUrl: './reporte-concepto.component.html',
    styleUrl: './reporte-concepto.component.css'
})
export class ReporteConceptoComponent implements OnInit {
    reporteConcepto: ReporteConcepto | null = null;
    anioSeleccionado: number = new Date().getFullYear();

    // Propiedades para el selector de años dinámico
    aniosDisponibles: number[] = [];
    anioMinimo: number = 2020;
    anioMaximo: number = new Date().getFullYear();

    // Propiedades para el popup de designaciones
    selectedReporte: Reporte | null = null;

    @ViewChild('designacionesTemplate', { static: true }) designacionesTemplate!: TemplateRef<any>;

    // Gráfico de distribución mensual
    @ViewChild("chartMensual") chartMensual!: ChartComponent;
    public chartOptionsMensual: Partial<ChartOptions> = {};
    public showMonthlyChart: boolean = false;

    // Gráfico de distribución por artículo (licencias)
    @ViewChild("chartArticulosLicencias") chartArticulosLicencias!: ChartComponent;
    public chartOptionsArticulosLicencias: Partial<ChartOptions> = {};
    public showArticleLicenciasChart: boolean = false;

    // Gráfico de distribución por artículo (días)
    @ViewChild("chartArticulosDias") chartArticulosDias!: ChartComponent;
    public chartOptionsArticulosDias: Partial<ChartOptions> = {};
    public showArticleDiasChart: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private personaService: PersonaService,
        private modalService: ModalService,
        private popupService: PopupService
    ) {
        // Generar lista de años disponibles
        this.generarAniosDisponibles();
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['anio']) {
                this.anioSeleccionado = parseInt(params['anio']);
                this.cargarReporteConcepto();
            }
        });
    }

    cargarReporteConcepto(): void {
        this.reporteConcepto = null;
        this.personaService.obtenerReporteConcepto(this.anioSeleccionado).subscribe({
            next: (response: any) => {
                console.log('Respuesta del servidor:', response);
                this.reporteConcepto = response.data || response;

                if (this.reporteConcepto) {
                    // Inicializar gráficos después de cargar los datos
                    setTimeout(() => {
                        this.inicializarGraficoMensual();
                        this.inicializarGraficoArticulosLicencias();
                        this.inicializarGraficoArticulosDias();
                    }, 100);
                }
            },
            error: (error: any) => {
                console.error('Error al cargar reporte de concepto:', error);
                this.modalService.error('Error', 'No se pudo cargar el reporte de concepto general. ' +
                    (error.error?.message || error.message || 'Error desconocido'));
            }
        });
    }

    inicializarGraficoMensual(): void {
        if (!this.reporteConcepto) return;

        const mesesData = this.getMesesLicencia();

        const serieData = mesesData.map(item => item.dias);
        const categorias = mesesData.map(item => item.mes);

        this.chartOptionsMensual = {
            series: [{
                name: 'Días de Licencia',
                data: serieData
            }],
            chart: {
                type: 'bar',
                height: 350,
                toolbar: { show: true }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '60%',
                    borderRadius: 4
                }
            },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => val.toString()
            },
            xaxis: {
                categories: categorias,
                title: { text: 'Meses' }
            },
            yaxis: {
                title: { text: 'Días de Licencia' }
            },
            colors: ['#007bff'],
            title: {
                text: `Distribución de días de licencia por mes ${this.getAnioReporte()}`,
                align: 'center'
            },
            tooltip: {
                y: {
                    formatter: (val: number) => `${val} días`
                }
            }
        };

        this.showMonthlyChart = true;
    }

    inicializarGraficoArticulosLicencias(): void {
        if (!this.reporteConcepto?.EstadisticasGenerales.LicenciasPorArticulo) return;

        const articulos = Object.entries(this.reporteConcepto.EstadisticasGenerales.LicenciasPorArticulo);
        if (articulos.length === 0) {
            this.showArticleLicenciasChart = false;
            return;
        }

        const labels = articulos.map(([articulo]) => articulo);
        const series = articulos.map(([, cantidad]) => cantidad);

        this.chartOptionsArticulosLicencias = {
            series: series,
            chart: {
                type: 'donut',
                height: 350,
                toolbar: { show: true }
            },
            labels: labels,
            colors: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'],
            title: {
                text: 'Licencias por Artículo ' + this.getAnioReporte(),
                align: 'center'
            },
            tooltip: {
                y: {
                    formatter: (val: number) => `${val} licencias`
                }
            },
            legend: {
                position: 'bottom'
            }
        };

        this.showArticleLicenciasChart = true;
    }

    inicializarGraficoArticulosDias(): void {
        if (!this.reporteConcepto?.EstadisticasGenerales.DiasLicenciasPorArticulo) return;

        const articulos = Object.entries(this.reporteConcepto.EstadisticasGenerales.DiasLicenciasPorArticulo);
        if (articulos.length === 0) {
            this.showArticleDiasChart = false;
            return;
        }

        const labels = articulos.map(([articulo]) => articulo);
        const series = articulos.map(([, dias]) => dias);

        this.chartOptionsArticulosDias = {
            series: series,
            chart: {
                type: 'donut',
                height: 350,
                toolbar: { show: true }
            },
            labels: labels,
            colors: ['#17a2b8', '#20c997', '#fd7e14', '#e83e8c', '#6610f2', '#6c757d'],
            title: {
                text: 'Días de Licencia por Artículo ' + this.getAnioReporte(),
                align: 'center'
            },
            tooltip: {
                y: {
                    formatter: (val: number) => `${val} días`
                }
            },
            legend: {
                position: 'bottom'
            }
        };

        this.showArticleDiasChart = true;
    }

    onAnioChange(): void {
        this.router.navigate(['/personas/reporte-concepto', this.anioSeleccionado]);
    }

    volver(): void {
        this.router.navigate(['/personas']);
    }

    getMesesLicencia(): { mes: string, dias: number }[] {
        // Definir todos los meses del año
        const todosMeses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        // Inicializar todos los meses con 0 días
        const resultado = todosMeses.map(mes => ({ mes, dias: 0 }));

        // Si hay datos de distribución, actualizar los valores correspondientes
        if (this.reporteConcepto?.DistribucionDiasLicencias) {
            Object.entries(this.reporteConcepto.DistribucionDiasLicencias).forEach(([mes, dias]) => {
                const mesEncontrado = resultado.find(item => item.mes === mes);
                if (mesEncontrado) {
                    mesEncontrado.dias = dias;
                }
            });
        }

        return resultado;
    }

    getCalificacionClass(calificacion?: string): string {
        if (!calificacion) {
            // Usar la calificación general del reporte si no se proporciona una específica
            if (!this.reporteConcepto) return '';
            calificacion = this.reporteConcepto.CalificacionGeneral;
        }

        switch (calificacion) {
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

    /**
     * Obtiene el total de licencias para un docente específico
     */
    getTotalLicenciasDocente(reporte: Reporte): number {
        if (!reporte.EstadisticasLicencias.LicenciasPorArticulo) return 0;

        return Object.values(reporte.EstadisticasLicencias.LicenciasPorArticulo)
            .reduce((total, articulo) => total + articulo.Cantidad, 0);
    }

    /**
     * Función para trackBy en la tabla de reportes de docentes
     */
    trackByDocenteDni(index: number, reporte: Reporte): number {
        return reporte.Docente.DNI;
    }

    /**
     * Genera la lista de años disponibles para el selector
     */
    private generarAniosDisponibles(): void {
        this.aniosDisponibles = [];

        // Generar años desde el mínimo hasta el máximo en orden descendente
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

    /**
     * Función para trackBy en la tabla de docentes
     */
    trackByDni(index: number, docente: any): string {
        return docente.DNI;
    }

    getAnioReporte(): number {
        return this.reporteConcepto?.Anio ?? this.anioSeleccionado;
    }

    /**
     * Abre el popup mostrando las designaciones del docente
     */
    openDesignacionesPopup(reporte: Reporte): void {
        this.selectedReporte = reporte;
        this.popupService.show(this.designacionesTemplate, {
            title: `Designaciones de ${reporte.Docente.Nombre} ${reporte.Docente.Apellido}`,
            icon: 'fa-user-tie',
            data: reporte
        });
    }

    /**
     * Obtiene el conteo de designaciones para un reporte
     */
    getDesignacionCount(reporte: Reporte): number {
        return reporte.Designaciones ? reporte.Designaciones.length : 0;
    }
}
