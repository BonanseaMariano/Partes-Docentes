import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginationConfig } from '../../core/constants/pagination.constants';
import { ModalService } from '../../modal/modal.service';
import { ResultsPage } from '../../models/results-page';
import { Turno } from '../../models/turno';
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
    currentPage: number = PaginationConfig.INITIAL_PAGE;
    pageSize: number = PaginationConfig.PAGE_SIZE;
    turnoEnum = Turno;

    // Propiedades para el ordenamiento
    sortField: string = 'id';
    sortDirection: string = 'desc';

    constructor(
        private divisionService: DivisionService,
        private modalService: ModalService
    ) { }

    getDivisiones(): void {
        this.divisionService.byPage(this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe((dataPackage) => {
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
                        if (dataPackage.status === HttpStatusCode.InternalServerError) {
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

    /**
     * Maneja el click en una cabecera de columna para cambiar el ordenamiento
     */
    onSort(field: string): void {
        if (this.sortField === field) {
            // Si es el mismo campo, cambiar dirección
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // Si es un campo diferente, ordenar ascendente por defecto
            this.sortField = field;
            this.sortDirection = 'asc';
        }

        // Volver a la primera página cuando se cambia el ordenamiento
        this.currentPage = 1;
        this.getDivisiones();
    }

    /**
     * Verifica si el campo actual está siendo usado para ordenamiento
     */
    isSortActive(field: string): boolean {
        return this.sortField === field;
    }

    /**
     * Obtiene la clase del icono de ordenamiento para un campo específico
     */
    getSortIcon(field: string): string {
        if (!this.isSortActive(field)) {
            return 'fa fa-sort'; // Icono neutral cuando no está activo
        }

        return this.sortDirection === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';
    }
}
