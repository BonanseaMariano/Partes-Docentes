import { Reporte } from './reporte';

export interface EstadisticasGenerales {
    TotalDesignaciones: number;
    TotalLicencias: number;
    LicenciasSinSuplente: number;
    TotalDiasLicencias: number;
    LicenciasPorArticulo: { [articulo: string]: number };
    DiasLicenciasPorArticulo: { [articulo: string]: number };
    PromedioLicenciasPorDesignacion: number;
    PorcentajeDiasLicenciaAnual: number;
}

export interface ReporteConcepto {
    Anio: number;
    EstadisticasGenerales: EstadisticasGenerales;
    DistribucionDiasLicencias: { [mes: string]: number };
    CalificacionGeneral: string;
    ReportesDocentes: Reporte[];
}
