import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginationConfig } from '../../core/constants/pagination.constants';
import { DesignacionService } from '../../designacion/service/designacion.service';
import { ModalService } from '../../modal/modal.service';
import { Designacion } from '../../models/designacion';
import { Estado } from '../../models/estado';
import { Licencia } from '../../models/licencia';
import { ResultsPage } from '../../models/results-page';
import { PaginationComponent } from '../../pagination/pagination.component';
import { DniFormatPipe } from '../../pipes/dni-format.pipe';
import { FechaFormatPipe } from '../../pipes/fecha-format.pipe';
import { PopupService } from '../../popup/popup.service';
import { LicenciaService } from '../service/licencia.service';


@Component({
    selector: 'app-licencias',
    standalone: true,
    imports: [CommonModule, RouterModule, PaginationComponent, DniFormatPipe, FechaFormatPipe],
    templateUrl: './licencias.component.html',
    styleUrls: ['./licencias.component.css']
})
export class LicenciasComponent {
    resultsPage: ResultsPage = <ResultsPage>{};
    currentPage: number = PaginationConfig.INITIAL_PAGE;
    pageSize: number = PaginationConfig.PAGE_SIZE;

    // Exponemos el enum para usarlo en el template
    Estado = Estado;

    selectedLicencia: Licencia | null = null;

    @ViewChild('designacionesTemplate', { static: true }) designacionesTemplate!: TemplateRef<any>;
    @ViewChild('logsTemplate', { static: true }) logsTemplate!: TemplateRef<any>;

    constructor(
        private licenciaService: LicenciaService,
        private modalService: ModalService,
        private popupService: PopupService,
        private designacionService: DesignacionService
    ) { }

    getLicencias(): void {
        this.licenciaService.byPage(this.currentPage, this.pageSize).subscribe((dataPackage) => {
            this.resultsPage = <ResultsPage>dataPackage.data;
        });
    }

    remove(id: number): void {
        let that = this;
        this.modalService
            .confirm(
                "Eliminar licencia",
                "¿Estás seguro de que deseas eliminar esta licencia?",
                "Si elimina la licencia no la podrá utilizar luego"
            )
            .then(function () {
                that.licenciaService.remove(id).subscribe({
                    next: (dataPackage) => {
                        if (dataPackage.status === HttpStatusCode.InternalServerError) {
                            that.modalService.error(
                                "Error al eliminar",
                                dataPackage.message,
                                ""
                            );
                        }
                        that.getLicencias();
                    }
                });
            });
    }

    openDesignacionesPopup(licencia: Licencia): void {
        this.selectedLicencia = licencia;
        this.popupService.show(this.designacionesTemplate, {
            title: `Designaciones de la licencia`,
            icon: 'fa-user-tie',
            data: licencia
        });
    }

    openLogsPopup(licencia: Licencia): void {
        this.selectedLicencia = licencia;
        // Si la licencia tiene logs, los ordenamos por fecha y hora, más recientes primero
        if (licencia.logs && licencia.logs.length > 0) {
            licencia.logs.sort((a, b) => {
                const fechaA = new Date(a.fechaHora).getTime();
                const fechaB = new Date(b.fechaHora).getTime();
                return fechaB - fechaA; // Orden descendente (más reciente primero)
            });
        }
        this.popupService.show(this.logsTemplate, {
            title: `Historial de logs de la licencia`,
            icon: 'fa-history',
            data: licencia
        });
    }

    getDesignacionCount(licencia: Licencia): number {
        return licencia.designaciones ? licencia.designaciones.length : 0;
    }

    getLogCount(licencia: Licencia): number {
        return licencia.logs ? licencia.logs.length : 0;
    }

    isDesignacionActive(designacion: Designacion): boolean {
        return this.designacionService.isActive(designacion);
    }

    ngOnInit(): void {
        this.getLicencias();
    }

    onPageChangeRequested(page: number): void {
        this.currentPage = page;
        this.getLicencias();
    }
}