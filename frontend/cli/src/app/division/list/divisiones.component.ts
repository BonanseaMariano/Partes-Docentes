import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalService } from '../../modal/modal.service';
import { ResultsPage } from '../../models/results-page';
import { PaginationComponent } from '../../pagination/pagination.component';
import { DivisionService } from '../service/division.service';


@Component({
    selector: 'app-divisiones',
    imports: [CommonModule, RouterModule, PaginationComponent],
    templateUrl: './divisiones.component.html',
    styles: ``
})
export class DivisionesComponent {
    resultsPage: ResultsPage = <ResultsPage>{};
    currentPage: number = 1;

    constructor(
        private divisionService: DivisionService,
        private modalService: ModalService
    ) { }

    getPersonas(): void {
        this.divisionService.byPage(this.currentPage, 4).subscribe((dataPackage) => {
            this.resultsPage = <ResultsPage>dataPackage.data;
        });
    }

    remove(id: number): void {
        let that = this;
        this.modalService
            .confirm(
                "Eliminar persona",
                "¿Estás seguro de que deseas eliminar esta persona?",
                "Si elimina la persona no la podrá utilizar luego"
            )
            .then(function () {
                that.divisionService.remove(id).subscribe((dataPackage) => {
                    that.getPersonas();
                });
            });
    }

    ngOnInit(): void {
        this.getPersonas();
    }

    onPageChangeRequested(page: number): void {
        this.currentPage = page;
        this.getPersonas();
    }
}
