import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginationConfig } from '../../core/constants/pagination.constants';
import { ModalService } from '../../modal/modal.service';
import { ResultsPage } from '../../models/results-page';
import { PaginationComponent } from '../../pagination/pagination.component';
import { LicenciaService } from '../service/licencia.service';


@Component({
    selector: 'app-licencias',
    imports: [CommonModule, RouterModule, PaginationComponent],
    templateUrl: './licencias.component.html',
    styles: ``
})
export class LicenciasComponent {
    resultsPage: ResultsPage = <ResultsPage>{};
    currentPage: number = PaginationConfig.INITIAL_PAGE;
    pageSize: number = PaginationConfig.PAGE_SIZE;

    constructor(
        private licenciaService: LicenciaService,
        private modalService: ModalService
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
                        if (dataPackage.status === 409) {
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

    ngOnInit(): void {
        this.getLicencias();
    }

    onPageChangeRequested(page: number): void {
        this.currentPage = page;
        this.getLicencias();
    }
}