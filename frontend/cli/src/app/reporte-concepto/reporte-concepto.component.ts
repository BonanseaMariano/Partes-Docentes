import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DesignacionConDias, LicenciasPorArticulo, ReporteConcepto } from '../models/reporte-concepto';
import { FechaFormatPipe } from '../pipes/fecha-format.pipe';
import { ModalService } from '../modal/modal.service';
import { PersonaService } from '../persona/service/persona.service';

@Component({
    selector: 'app-reporte-concepto',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, FechaFormatPipe],
    templateUrl: './reporte-concepto.component.html',
    styleUrl: './reporte-concepto.component.css'
})
export class ReporteConceptoComponent implements OnInit {
    reporte: ReporteConcepto | null = null;
    loading: boolean = false;
    dni: number = 0;
    anioSeleccionado: number = new Date().getFullYear();

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
        this.loading = true;
        this.personaService.obtenerReporteConcepto(this.dni, this.anioSeleccionado).subscribe({
            next: (response: any) => {
                if (response.status === HttpStatusCode.Ok) {
                    this.reporte = response.data;
                } else {
                    this.modalService.error(
                        "Error al cargar reporte",
                        response.message || "No se pudo cargar el reporte de concepto",
                        ""
                    );
                }
                this.loading = false;
            },
            error: (error: any) => {
                this.modalService.error(
                    "Error al cargar reporte",
                    "No se pudo cargar el reporte de concepto. Verifique que el DNI y año sean correctos.",
                    ""
                );
                this.loading = false;
            }
        });
    }

    onAnioChange(): void {
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
}
