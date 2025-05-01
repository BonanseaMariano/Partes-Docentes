import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalService } from '../../modal/modal.service';
import { ResultsPage } from '../../models/results-page';
import { PaginationComponent } from '../../pagination/pagination.component';
import { DivisionService } from '../service/division.service';
import { PaginationConfig } from '../../core/constants/pagination.constants';
import { Turno } from '../../models/turno';


@Component({
    selector: 'app-divisiones',
    imports: [CommonModule, RouterModule, PaginationComponent],
    templateUrl: './divisiones.component.html',
    styles: ``
})
export class DivisionesComponent {
    resultsPage: ResultsPage = <ResultsPage>{};
    currentPage: number = PaginationConfig.INITIAL_PAGE;
    pageSize: number = PaginationConfig.PAGE_SIZE;
    turnoEnum = Turno;

    constructor(
        private divisionService: DivisionService,
        private modalService: ModalService
    ) { }

    getDivisiones(): void {
        this.divisionService.byPage(this.currentPage, this.pageSize).subscribe((dataPackage) => {
            this.resultsPage = <ResultsPage>dataPackage.data;
        });
    }

    remove(id: number): void {
        let that = this;
        this.modalService
            .confirm(
                "Eliminar division",
                "¿Estás seguro de que deseas eliminar esta division?",
                "Si elimina la division no la podrá utilizar luego"
            )
            .then(function () {
                that.divisionService.remove(id).subscribe({
                    next: (dataPackage) => {
                        if (dataPackage.status === 409) {
                            that.modalService.error(
                                "Error al eliminar",
                                dataPackage.message,
                                ""
                            );
                        }
                        that.getDivisiones();
                    }
                });
            });
    }

    ngOnInit(): void {
        this.getDivisiones();
    }

    onPageChangeRequested(page: number): void {
        this.currentPage = page;
        this.getDivisiones();
    }
}
