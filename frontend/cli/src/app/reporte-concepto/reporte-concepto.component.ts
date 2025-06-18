import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { ReporteConcepto, EstadisticasGenerales } from '../models/reporte-concepto';
import { Reporte } from '../models/reporte';
import { PersonaService } from '../persona/service/persona.service';
import { ModalService } from '../modal/modal.service';
import { PopupService } from '../popup/popup.service';
import { DniFormatPipe } from '../pipes/dni-format.pipe';
import { FechaFormatPipe } from '../pipes/fecha-format.pipe';
import { ReporteConceptoAnimationService } from './reporte-concepto-animation.service';

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
export class ReporteConceptoComponent implements OnInit, AfterViewInit {
    reporteConcepto: ReporteConcepto | null = null;
    anioSeleccionado: number = new Date().getFullYear();
    isLoading: boolean = false;
    isGeneratingPDF: boolean = false;

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
        private popupService: PopupService,
        private elementRef: ElementRef,
        private reporteAnimationService: ReporteConceptoAnimationService
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

    ngAfterViewInit(): void {
        // Configurar animaciones iniciales
        this.reporteAnimationService.animateInitialEntrance(this.elementRef);
    }

    cargarReporteConcepto(): void {
        this.reporteConcepto = null;
        this.isLoading = true;
        
        // Ocultar inmediatamente todos los gráficos para evitar mostrar datos antiguos
        this.showMonthlyChart = false;
        this.showArticleLicenciasChart = false;
        this.showArticleDiasChart = false;

        // Si hay datos existentes, animar transición
        if (this.reporteConcepto) {
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
        this.personaService.obtenerReporteConcepto(this.anioSeleccionado).subscribe({
            next: (response: any) => {
                this.isLoading = false;
                this.reporteConcepto = response.data || response;

                if (this.reporteConcepto) {
                    // Animar carga de datos con secuencia completa
                    setTimeout(() => {
                        this.reporteAnimationService.animateDataLoad(
                            this.elementRef,
                            () => {
                                // Configurar hover effects después de cargar
                                this.reporteAnimationService.setupHoverEffects(this.elementRef);

                                // Animar contadores
                                this.reporteAnimationService.animateCounters(this.elementRef);
                            }
                        );

                        // Inicializar gráficos inmediatamente sin animaciones de GSAP
                        // ApexCharts maneja sus propias animaciones
                        this.inicializarGraficoMensual();
                        this.inicializarGraficoArticulosLicencias();
                        this.inicializarGraficoArticulosDias();
                    }, 50);
                }
            },
            error: (error: any) => {
                this.isLoading = false;
                this.modalService.error('Error', 'No se pudo cargar el reporte de concepto general. ' +
                    (error.error?.message || error.message || 'Error desconocido'));

                // Animar error
                setTimeout(() => {
                    this.reporteAnimationService.animateError(this.elementRef);
                }, 50);
            }
        });
    }

    inicializarGraficoMensual(): void {
        if (!this.reporteConcepto) {
            this.showMonthlyChart = false;
            return;
        }

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

        // Mostrar el gráfico inmediatamente sin animaciones GSAP
        this.showMonthlyChart = true;
    }

    inicializarGraficoArticulosLicencias(): void {
        if (!this.reporteConcepto?.EstadisticasGenerales.LicenciasPorArticulo) {
            this.showArticleLicenciasChart = false;
            return;
        }

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

        // Mostrar el gráfico inmediatamente sin animaciones GSAP
        this.showArticleLicenciasChart = true;
    }

    inicializarGraficoArticulosDias(): void {
        if (!this.reporteConcepto?.EstadisticasGenerales.DiasLicenciasPorArticulo) {
            this.showArticleDiasChart = false;
            return;
        }

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

        // Mostrar el gráfico inmediatamente sin animaciones GSAP
        this.showArticleDiasChart = true;
    }

    onAnioChange(): void {
        // Ocultar inmediatamente los gráficos antes de cambiar el año
        this.showMonthlyChart = false;
        this.showArticleLicenciasChart = false;
        this.showArticleDiasChart = false;
        
        // Animar transición de cambio de año
        this.reporteAnimationService.animateYearChange(this.elementRef, () => {
            this.router.navigate(['/personas/reporte-concepto', this.anioSeleccionado]);
        });
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

        // Animar entrada del popup después de un pequeño delay
        setTimeout(() => {
            const popupContainer = document.querySelector('.popup-container');
            if (popupContainer) {
                const elementRef = { nativeElement: popupContainer };
                this.reporteAnimationService.animatePopupEntrance(elementRef as ElementRef);
            }
        }, 50);
    }

    /**
     * Obtiene el conteo de designaciones para un reporte
     */
    getDesignacionCount(reporte: Reporte): number {
        return reporte.Designaciones ? reporte.Designaciones.length : 0;
    }

    /**
     * Genera y descarga el reporte en formato PDF
     */
    async descargarPDF(): Promise<void> {
        if (!this.reporteConcepto || this.isGeneratingPDF) return;

        this.isGeneratingPDF = true;

        try {
            // Crear nuevo documento PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            let currentY = 20;

            // === ENCABEZADO ===
            pdf.setFontSize(20);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(13, 110, 253); // Color primario de la app
            pdf.text('Reporte de Concepto General', pageWidth / 2, currentY, { align: 'center' });

            currentY += 15;
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(73, 80, 87); // Color secundario
            pdf.text(`Año: ${this.getAnioReporte()}`, pageWidth / 2, currentY, { align: 'center' });

            currentY += 10;
            pdf.setFontSize(10);
            pdf.text(`Generado el: ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}`, pageWidth / 2, currentY, { align: 'center' });

            currentY += 20;

            // === ESTADÍSTICAS GENERALES EN DOS COLUMNAS ===
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(13, 110, 253); // Color azul consistente con el título
            pdf.text('Estadísticas Generales', 20, currentY);

            currentY += 12;
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');

            const stats = this.reporteConcepto.EstadisticasGenerales;
            
            // Dividir estadísticas en dos columnas para optimizar espacio
            const leftColumnStats = [
                `Total de Designaciones: ${stats.TotalDesignaciones}`,
                `Total de Licencias: ${stats.TotalLicencias}`,
                `Total de Días de Licencia: ${stats.TotalDiasLicencias}`,
                `Licencias Sin Suplente: ${stats.LicenciasSinSuplente}`
            ];

            const rightColumnStats = [
                `Promedio Lic./Designación: ${stats.PromedioLicenciasPorDesignacion.toFixed(2)}`,
                `% Días Licencia Anual: ${stats.PorcentajeDiasLicenciaAnual.toFixed(2)}%`,
                `Calificación General: ${this.reporteConcepto.CalificacionGeneral}`,
                '' // Espacio vacío para alineación
            ];

            const columnWidth = (pageWidth - 60) / 2; // Espacio para dos columnas
            const startY = currentY;
            
            // Columna izquierda
            leftColumnStats.forEach((text, index) => {
                pdf.text(text, 25, currentY);
                currentY += 6;
            });

            // Columna derecha
            currentY = startY; // Resetear Y para la segunda columna
            rightColumnStats.forEach((text, index) => {
                if (text) { // Solo mostrar si no está vacío
                    pdf.text(text, 25 + columnWidth, currentY);
                }
                currentY += 6;
            });

            currentY += 8; // Espacio después de las estadísticas

            // === CAPTURA DE GRÁFICOS ===
            await this.capturarGraficos(pdf, currentY);

            // === TABLA DE DOCENTES ===
            currentY = await this.agregarTablaDocentes(pdf, 20); // Nueva página para la tabla

            // Guardar el PDF
            const nombreArchivo = `reporte-concepto-${this.getAnioReporte()}.pdf`;
            pdf.save(nombreArchivo);

        } catch (error) {
            console.error('Error al generar PDF:', error);
            this.modalService.error(
                'Error al generar PDF',
                'Ocurrió un error al generar el archivo PDF. Inténtelo nuevamente.',
                ''
            );
        } finally {
            this.isGeneratingPDF = false;
        }
    }

    /**
     * Captura los gráficos y los añade al PDF
     */
    private async capturarGraficos(pdf: jsPDF, startY: number): Promise<number> {
        let currentY = startY;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Esperar tiempo suficiente para que todos los gráficos estén completamente renderizados
        await new Promise(resolve => setTimeout(resolve, 2000));

        // === GRÁFICO MENSUAL ===
        if (this.showMonthlyChart) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(13, 110, 253);
            pdf.text('Distribución Mensual de Días de Licencia', 20, currentY);
            currentY += 8;

            try {
                // Buscar el elemento SVG del gráfico directamente
                const svgElement = document.querySelector('#chartMensual svg');
                
                if (svgElement) {
                    const canvas = await html2canvas(svgElement.parentElement as HTMLElement, {
                        backgroundColor: '#ffffff',
                        scale: 2,
                        useCORS: true,
                        allowTaint: true
                    });

                    const imgData = canvas.toDataURL('image/png');
                    
                    if (imgData && imgData.length > 5000) {
                        const imgWidth = pageWidth - 40;
                        const imgHeight = Math.min((canvas.height * imgWidth) / canvas.width, 80);

                        pdf.addImage(imgData, 'PNG', 20, currentY, imgWidth, imgHeight);
                        currentY += imgHeight + 10;
                    } else {
                        pdf.setFontSize(10);
                        pdf.setTextColor(100, 100, 100);
                        pdf.text('(Gráfico mensual - captura fallida)', 20, currentY);
                        currentY += 15;
                    }
                } else {
                    pdf.setFontSize(10);
                    pdf.setTextColor(100, 100, 100);
                    pdf.text('(Gráfico mensual no encontrado)', 20, currentY);
                    currentY += 15;
                }
            } catch (error) {
                pdf.setFontSize(10);
                pdf.setTextColor(100, 100, 100);
                pdf.text('(Error en gráfico mensual)', 20, currentY);
                currentY += 15;
            }
        }

        // Verificar si necesitamos nueva página
        if (currentY + 100 > pageHeight - 20) {
            pdf.addPage();
            currentY = 20;
        }

        // === GRÁFICOS DE ARTÍCULOS ===
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(13, 110, 253);
        pdf.text('Distribución por Artículo de Licencia', 20, currentY);
        currentY += 15;

        const chartWidth = (pageWidth - 50) / 2;
        const startX1 = 20;
        const startX2 = 20 + chartWidth + 10;
        let maxChartHeight = 0;

        // Gráfico de Licencias (izquierda)
        if (this.showArticleLicenciasChart) {
            try {
                const svgElement = document.querySelector('#chartArticulosLicencias svg');
                
                if (svgElement) {
                    const canvas = await html2canvas(svgElement.parentElement as HTMLElement, {
                        backgroundColor: '#ffffff',
                        scale: 2,
                        useCORS: true,
                        allowTaint: true
                    });

                    const imgData = canvas.toDataURL('image/png');
                    
                    if (imgData && imgData.length > 5000) {
                        const imgHeight = Math.min((canvas.height * chartWidth) / canvas.width, 75);
                        maxChartHeight = Math.max(maxChartHeight, imgHeight);

                        pdf.setFontSize(9);
                        pdf.setFont('helvetica', 'bold');
                        pdf.setTextColor(33, 37, 41);
                        pdf.text('Cantidad de Licencias', startX1 + (chartWidth / 2), currentY, { align: 'center' });
                        
                        pdf.addImage(imgData, 'PNG', startX1, currentY + 5, chartWidth, imgHeight);
                    }
                }
            } catch (error) {
                // Error silencioso, no mostrar en PDF
            }
        }

        // Gráfico de Días (derecha)
        if (this.showArticleDiasChart) {
            try {
                const svgElement = document.querySelector('#chartArticulosDias svg');
                
                if (svgElement) {
                    const canvas = await html2canvas(svgElement.parentElement as HTMLElement, {
                        backgroundColor: '#ffffff',
                        scale: 2,
                        useCORS: true,
                        allowTaint: true
                    });

                    const imgData = canvas.toDataURL('image/png');
                    
                    if (imgData && imgData.length > 5000) {
                        const imgHeight = Math.min((canvas.height * chartWidth) / canvas.width, 75);
                        maxChartHeight = Math.max(maxChartHeight, imgHeight);

                        pdf.setFontSize(9);
                        pdf.setFont('helvetica', 'bold');
                        pdf.setTextColor(33, 37, 41);
                        pdf.text('Días de Licencia', startX2 + (chartWidth / 2), currentY, { align: 'center' });
                        
                        pdf.addImage(imgData, 'PNG', startX2, currentY + 5, chartWidth, imgHeight);
                    }
                }
            } catch (error) {
                // Error silencioso, no mostrar en PDF
            }
        }

        currentY += Math.max(maxChartHeight + 15, 30);
        return currentY;
    }

    /**
     * Agrega la tabla de docentes al PDF
     */
    private async agregarTablaDocentes(pdf: jsPDF, startY: number): Promise<number> {
        // Agregar nueva página para la tabla
        pdf.addPage();
        let currentY = 20;

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(13, 110, 253); // Color azul consistente
        pdf.text('Detalle por Docente', 20, currentY);

        currentY += 15;

        // Configuración de la tabla
        const pageWidth = pdf.internal.pageSize.getWidth();
        const tableWidth = pageWidth - 40; // Márgenes de 20mm
        const colWidths = [18, 50, 20, 20, 20, 30]; // Anchos de columnas en mm optimizados (agregada columna designaciones)
        const rowHeight = 10; // Aumentado para mejor legibilidad

        // Headers de la tabla (diseño simple y legible con color azul)
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(13, 110, 253); // Texto azul consistente con el diseño
        
        let x = 20;
        const headers = ['DNI', 'APELLIDO Y NOMBRE', 'DESIGN.', 'LICENCIAS', 'DÍAS', 'CALIFICACIÓN'];
        
        headers.forEach((header, index) => {
            // Establecer colores para cada celda individualmente
            pdf.setFillColor(240, 240, 240); // Fondo gris claro
            pdf.setDrawColor(200, 200, 200); // Borde gris
            
            // Fondo gris claro con borde
            pdf.rect(x, currentY, colWidths[index], rowHeight, 'FD');
            
            // Asegurar que el texto sea azul
            pdf.setTextColor(13, 110, 253);
            
            // Centrar texto en celda
            const textX = x + (colWidths[index] / 2);
            pdf.text(header, textX, currentY + 6.5, { align: 'center' });
            x += colWidths[index];
        });

        currentY += rowHeight;

        // Filas de datos
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9); // Fuente más grande para datos
        pdf.setTextColor(33, 37, 41);

        this.reporteConcepto!.ReportesDocentes.forEach((reporte, index) => {
            // Verificar si necesitamos nueva página
            if (currentY > 265) { // Ajustado para dar más espacio
                pdf.addPage();
                currentY = 20;
                
                // Repetir headers en nueva página (mismo estilo con color azul)
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(13, 110, 253); // Texto azul consistente
                
                let headerX = 20;
                headers.forEach((header, headerIndex) => {
                    // Establecer colores para cada celda individualmente
                    pdf.setFillColor(240, 240, 240); // Fondo gris claro
                    pdf.setDrawColor(200, 200, 200); // Borde gris
                    
                    pdf.rect(headerX, currentY, colWidths[headerIndex], rowHeight, 'FD');
                    
                    // Asegurar que el texto sea azul
                    pdf.setTextColor(13, 110, 253);
                    
                    const textX = headerX + (colWidths[headerIndex] / 2);
                    pdf.text(header, textX, currentY + 6.5, { align: 'center' });
                    headerX += colWidths[headerIndex];
                });
                
                currentY += rowHeight;
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(9);
                pdf.setTextColor(33, 37, 41);
            }

            // Color alternado para filas (más sutil)
            if (index % 2 === 0) {
                pdf.setFillColor(252, 252, 252); // Fondo gris muy claro
                pdf.rect(20, currentY, tableWidth, rowHeight, 'F');
            }

            // Datos de la fila
            let cellX = 20;
            const cellData = [
                reporte.Docente.DNI.toString(),
                `${reporte.Docente.Apellido}, ${reporte.Docente.Nombre}`,
                this.getDesignacionCount(reporte).toString(),
                this.getTotalLicenciasDocente(reporte).toString(),
                reporte.EstadisticasLicencias.TotalDiasLicencia.toString(),
                reporte.Calificacion
            ];

            cellData.forEach((data, cellIndex) => {
                // Truncar texto si es muy largo
                let text = data;
                if (cellIndex === 1 && text.length > 25) { // Apellido y nombre
                    text = text.substring(0, 22) + '...';
                }

                // Centrar números y calificación, izquierda para nombres
                const align = cellIndex === 1 ? 'left' : 'center';
                const textX = align === 'center' ? 
                    cellX + (colWidths[cellIndex] / 2) : 
                    cellX + 2;
                
                pdf.text(text, textX, currentY + 6.5, { align: align }); // Ajustado para consistencia con headers
                cellX += colWidths[cellIndex];
            });

            currentY += rowHeight;
        });

        return currentY;
    }
}
