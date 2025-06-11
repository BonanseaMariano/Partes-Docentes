import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PaginationConfig } from '../../core/constants/pagination.constants';
import { ValidationService } from '../../core/services/validation.service';
import { ModalService } from '../../modal/modal.service';
import { ResultsPage } from '../../models/results-page';
import { TipoDesignacion } from '../../models/tipo-designacion';
import { PaginationComponent } from '../../pagination/pagination.component';
import { DniFormatPipe } from '../../pipes/dni-format.pipe';
import { FechaFormatPipe } from '../../pipes/fecha-format.pipe';
import { TipoDesignacionPipe } from '../../pipes/tipo-designacion.pipe';
import { DesignacionService } from '../service/designacion.service';


@Component({
    selector: 'app-divisiones',
    imports: [CommonModule, RouterModule, PaginationComponent, TipoDesignacionPipe, DniFormatPipe, FechaFormatPipe],
    templateUrl: './designaciones.component.html',
    styles: ``
})
export class DesignacionesComponent {
    resultsPage: ResultsPage = <ResultsPage>{};
    currentPage: number = PaginationConfig.INITIAL_PAGE;
    pageSize: number = PaginationConfig.PAGE_SIZE;
    tipoDesignacionEnum = TipoDesignacion;

    // Propiedades para el ordenamiento
    sortField: string = 'id';
    sortDirection: string = 'desc';

    constructor(
        private designacionService: DesignacionService,
        private modalService: ModalService,
        private validationService: ValidationService,
        private router: Router
    ) { }

    getDesignaciones(): void {
        this.designacionService.byPage(this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe((dataPackage) => {
            this.resultsPage = <ResultsPage>dataPackage.data;
        });
    }

    /**
     * Método para navegar a la creación de una nueva designación
     * con validación previa de requisitos
     */
    crearNueva(): void {
        this.validationService.validateWithFeedback(
            () => this.validationService.canCreateDesignacion()
        ).subscribe(canCreate => {
            if (canCreate) {
                this.router.navigateByUrl('/designaciones/new');
            }
        });
    }

    remove(id: number): void {
        let that = this;
        this.modalService
            .confirm(
                "Eliminar designación",
                "¿Estás seguro de que deseas eliminar esta designación?",
                "Si elimina la designación no la podrá utilizar luego"
            )
            .then(function () {
                that.designacionService.remove(id).subscribe({
                    next: (dataPackage) => {
                        if (dataPackage.status === HttpStatusCode.InternalServerError) {
                            that.modalService.error(
                                "Error al eliminar",
                                dataPackage.message,
                                ""
                            );
                        }
                        that.getDesignaciones();
                    }
                });
            });
    }

    ngOnInit(): void {
        this.getDesignaciones();
    }

    onPageChangeRequested(page: number): void {
        this.currentPage = page;
        this.getDesignaciones();
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
        this.getDesignaciones();
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
