import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReporteConcepto } from '../../models/reporte-concepto';
import { Reporte } from '../../models/reporte';

@Injectable({
    providedIn: 'root'
})
export class ReporteConceptoPdfService {

    constructor() { }

    /**
     * Genera y descarga el reporte en formato PDF
     */
    async generarPDF(
        reporteConcepto: ReporteConcepto,
        showMonthlyChart: boolean,
        showArticleLicenciasChart: boolean,
        showArticleDiasChart: boolean,
        getTotalLicenciasDocente: (reporte: Reporte) => number,
        getDesignacionCount: (reporte: Reporte) => number
    ): Promise<string> {
        // Crear nuevo documento PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        let currentY = 20;

        // === ENCABEZADO ===
        this.agregarEncabezado(pdf, reporteConcepto, pageWidth, currentY);
        currentY += 45;

        // === ESTADÍSTICAS GENERALES ===
        currentY = this.agregarEstadisticasGenerales(pdf, reporteConcepto, pageWidth, currentY);

        // === CAPTURA DE GRÁFICOS ===
        currentY = await this.capturarGraficos(
            pdf,
            currentY,
            pageWidth,
            showMonthlyChart,
            showArticleLicenciasChart,
            showArticleDiasChart
        );

        // === TABLA DE DOCENTES ===
        await this.agregarTablaDocentes(
            pdf,
            reporteConcepto,
            getTotalLicenciasDocente,
            getDesignacionCount
        );

        // Generar nombre de archivo y guardar
        const nombreArchivo = `reporte-concepto-${reporteConcepto.Anio}.pdf`;
        pdf.save(nombreArchivo);

        return nombreArchivo;
    }

    /**
     * Agrega el encabezado del PDF
     */
    private agregarEncabezado(pdf: jsPDF, reporteConcepto: ReporteConcepto, pageWidth: number, startY: number): void {
        let currentY = startY;

        // Título principal
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(13, 110, 253);
        pdf.text('Reporte de Concepto General', pageWidth / 2, currentY, { align: 'center' });

        currentY += 15;

        // Año
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(73, 80, 87);
        pdf.text(`Año: ${reporteConcepto.Anio}`, pageWidth / 2, currentY, { align: 'center' });

        currentY += 10;

        // Fecha de generación
        pdf.setFontSize(10);
        pdf.text(
            `Generado el: ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}`,
            pageWidth / 2,
            currentY,
            { align: 'center' }
        );
    }

    /**
     * Agrega las estadísticas generales en formato de dos columnas
     */
    private agregarEstadisticasGenerales(pdf: jsPDF, reporteConcepto: ReporteConcepto, pageWidth: number, startY: number): number {
        let currentY = startY;

        // Título de sección
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(13, 110, 253);
        pdf.text('Estadísticas Generales', 20, currentY);

        currentY += 12;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        const stats = reporteConcepto.EstadisticasGenerales;

        // Dividir estadísticas en dos columnas
        const leftColumnStats = [
            `Total de Designaciones: ${stats.TotalDesignaciones}`,
            `Total de Licencias: ${stats.TotalLicencias}`,
            `Total de Días de Licencia: ${stats.TotalDiasLicencias}`,
            `Licencias Sin Suplente: ${stats.LicenciasSinSuplente}`
        ];

        const rightColumnStats = [
            `Promedio Lic./Designación: ${stats.PromedioLicenciasPorDesignacion.toFixed(2)}`,
            `% Días Licencia Anual: ${stats.PorcentajeDiasLicenciaAnual.toFixed(2)}%`,
            `Calificación General: ${reporteConcepto.CalificacionGeneral}`,
            ''
        ];

        const columnWidth = (pageWidth - 60) / 2;
        const startYColumn = currentY;

        // Columna izquierda
        leftColumnStats.forEach((text) => {
            pdf.text(text, 25, currentY);
            currentY += 6;
        });

        // Columna derecha
        currentY = startYColumn;
        rightColumnStats.forEach((text) => {
            if (text) {
                pdf.text(text, 25 + columnWidth, currentY);
            }
            currentY += 6;
        });

        return currentY + 8;
    }

    /**
     * Captura los gráficos y los añade al PDF
     */
    private async capturarGraficos(
        pdf: jsPDF,
        startY: number,
        pageWidth: number,
        showMonthlyChart: boolean,
        showArticleLicenciasChart: boolean,
        showArticleDiasChart: boolean
    ): Promise<number> {
        let currentY = startY;
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Esperar renderizado completo
        await new Promise(resolve => setTimeout(resolve, 2000));

        // === GRÁFICO MENSUAL ===
        if (showMonthlyChart) {
            currentY = await this.capturarGraficoMensual(pdf, currentY, pageWidth);
        }

        // Verificar nueva página
        if (currentY + 100 > pageHeight - 20) {
            pdf.addPage();
            currentY = 20;
        }

        // === GRÁFICOS DE ARTÍCULOS ===
        currentY = await this.capturarGraficosArticulos(
            pdf,
            currentY,
            pageWidth,
            showArticleLicenciasChart,
            showArticleDiasChart
        );

        return currentY;
    }

    /**
     * Captura el gráfico mensual
     */
    private async capturarGraficoMensual(pdf: jsPDF, startY: number, pageWidth: number): Promise<number> {
        let currentY = startY;

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(13, 110, 253);
        pdf.text('Distribución Mensual de Días de Licencia', 20, currentY);
        currentY += 8;

        try {
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
                    currentY += this.agregarMensajeGrafico(pdf, currentY, '(Gráfico mensual - captura fallida)');
                }
            } else {
                currentY += this.agregarMensajeGrafico(pdf, currentY, '(Gráfico mensual no encontrado)');
            }
        } catch (error) {
            currentY += this.agregarMensajeGrafico(pdf, currentY, '(Error en gráfico mensual)');
        }

        return currentY;
    }

    /**
     * Captura los gráficos de artículos (lado a lado)
     */
    private async capturarGraficosArticulos(
        pdf: jsPDF,
        startY: number,
        pageWidth: number,
        showArticleLicenciasChart: boolean,
        showArticleDiasChart: boolean
    ): Promise<number> {
        let currentY = startY;

        // Título de sección
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
        if (showArticleLicenciasChart) {
            maxChartHeight = Math.max(
                maxChartHeight,
                await this.capturarGraficoArticulo(
                    pdf,
                    '#chartArticulosLicencias',
                    'Cantidad de Licencias',
                    startX1,
                    currentY,
                    chartWidth
                )
            );
        }

        // Gráfico de Días (derecha)
        if (showArticleDiasChart) {
            maxChartHeight = Math.max(
                maxChartHeight,
                await this.capturarGraficoArticulo(
                    pdf,
                    '#chartArticulosDias',
                    'Días de Licencia',
                    startX2,
                    currentY,
                    chartWidth
                )
            );
        }

        return currentY + Math.max(maxChartHeight + 15, 30);
    }

    /**
     * Captura un gráfico de artículo específico
     */
    private async capturarGraficoArticulo(
        pdf: jsPDF,
        selector: string,
        titulo: string,
        x: number,
        y: number,
        width: number
    ): Promise<number> {
        try {
            const svgElement = document.querySelector(`${selector} svg`);

            if (svgElement) {
                const canvas = await html2canvas(svgElement.parentElement as HTMLElement, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    useCORS: true,
                    allowTaint: true
                });

                const imgData = canvas.toDataURL('image/png');

                if (imgData && imgData.length > 5000) {
                    const imgHeight = Math.min((canvas.height * width) / canvas.width, 75);

                    // Título del gráfico
                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(33, 37, 41);
                    pdf.text(titulo, x + (width / 2), y, { align: 'center' });

                    pdf.addImage(imgData, 'PNG', x, y + 5, width, imgHeight);
                    return imgHeight;
                }
            }
        } catch (error) {
            // Error silencioso
        }

        return 0;
    }

    /**
     * Agrega un mensaje cuando un gráfico no puede capturarse
     */
    private agregarMensajeGrafico(pdf: jsPDF, y: number, mensaje: string): number {
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(mensaje, 20, y);
        return 15; // Altura del mensaje
    }

    /**
     * Agrega la tabla de docentes al PDF
     */
    private async agregarTablaDocentes(
        pdf: jsPDF,
        reporteConcepto: ReporteConcepto,
        getTotalLicenciasDocente: (reporte: Reporte) => number,
        getDesignacionCount: (reporte: Reporte) => number
    ): Promise<void> {
        // Nueva página para la tabla
        pdf.addPage();
        let currentY = 20;

        // Título de la tabla
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(13, 110, 253);
        pdf.text('Detalle por Docente', 20, currentY);
        currentY += 15;

        // Configuración de la tabla
        const pageWidth = pdf.internal.pageSize.getWidth();
        const tableWidth = pageWidth - 40;
        const colWidths = [18, 50, 20, 20, 20, 30];
        const rowHeight = 10;
        const headers = ['DNI', 'APELLIDO Y NOMBRE', 'DESIGN.', 'LICENCIAS', 'DÍAS', 'CALIFICACIÓN'];

        // Headers
        currentY = this.agregarHeadersTabla(pdf, headers, colWidths, rowHeight, currentY);

        // Filas de datos
        this.agregarFilasTabla(
            pdf,
            reporteConcepto.ReportesDocentes,
            headers,
            colWidths,
            rowHeight,
            tableWidth,
            currentY,
            getTotalLicenciasDocente,
            getDesignacionCount
        );
    }

    /**
     * Agrega los headers de la tabla
     */
    private agregarHeadersTabla(
        pdf: jsPDF,
        headers: string[],
        colWidths: number[],
        rowHeight: number,
        startY: number
    ): number {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(13, 110, 253);

        let x = 20;

        headers.forEach((header, index) => {
            pdf.setFillColor(240, 240, 240);
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(x, startY, colWidths[index], rowHeight, 'FD');
            pdf.setTextColor(13, 110, 253);

            const textX = x + (colWidths[index] / 2);
            pdf.text(header, textX, startY + 6.5, { align: 'center' });
            x += colWidths[index];
        });

        return startY + rowHeight;
    }

    /**
     * Agrega las filas de datos de la tabla
     */
    private agregarFilasTabla(
        pdf: jsPDF,
        reportes: Reporte[],
        headers: string[],
        colWidths: number[],
        rowHeight: number,
        tableWidth: number,
        startY: number,
        getTotalLicenciasDocente: (reporte: Reporte) => number,
        getDesignacionCount: (reporte: Reporte) => number
    ): void {
        let currentY = startY;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(33, 37, 41);

        reportes.forEach((reporte, index) => {
            // Verificar nueva página
            if (currentY > 265) {
                pdf.addPage();
                currentY = 20;
                currentY = this.agregarHeadersTabla(pdf, headers, colWidths, rowHeight, currentY);
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(9);
                pdf.setTextColor(33, 37, 41);
            }

            // Fondo alterno
            if (index % 2 === 0) {
                pdf.setFillColor(252, 252, 252);
                pdf.rect(20, currentY, tableWidth, rowHeight, 'F');
            }

            // Datos de la fila
            this.agregarCeldasFila(
                pdf,
                reporte,
                colWidths,
                currentY,
                getTotalLicenciasDocente,
                getDesignacionCount
            );

            currentY += rowHeight;
        });
    }

    /**
     * Agrega las celdas de una fila específica
     */
    private agregarCeldasFila(
        pdf: jsPDF,
        reporte: Reporte,
        colWidths: number[],
        y: number,
        getTotalLicenciasDocente: (reporte: Reporte) => number,
        getDesignacionCount: (reporte: Reporte) => number
    ): void {
        let cellX = 20;

        const cellData = [
            reporte.Docente.DNI.toString(),
            `${reporte.Docente.Apellido}, ${reporte.Docente.Nombre}`,
            getDesignacionCount(reporte).toString(),
            getTotalLicenciasDocente(reporte).toString(),
            reporte.EstadisticasLicencias.TotalDiasLicencia.toString(),
            reporte.Calificacion
        ];

        cellData.forEach((data, cellIndex) => {
            let text = data;
            if (cellIndex === 1 && text.length > 25) {
                text = text.substring(0, 22) + '...';
            }

            const align = cellIndex === 1 ? 'left' : 'center';
            const textX = align === 'center' ?
                cellX + (colWidths[cellIndex] / 2) :
                cellX + 2;

            pdf.text(text, textX, y + 6.5, { align: align });
            cellX += colWidths[cellIndex];
        });
    }
}
