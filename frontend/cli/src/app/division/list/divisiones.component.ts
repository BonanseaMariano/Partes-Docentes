import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginationConfig } from '../../core/constants/pagination.constants';
import { ModalService } from '../../modal/modal.service';
import { ResultsPage } from '../../models/results-page';
import { Turno } from '../../models/turno';
import { PaginationComponent } from '../../pagination/pagination.component';
import { DivisionService } from '../service/division.service';
import { DivisionesAnimationService } from './divisiones-animation.service';


@Component({
    selector: 'app-divisiones',
    imports: [CommonModule, RouterModule, PaginationComponent],
    templateUrl: './divisiones.component.html',
    styleUrl: './divisiones.component.css'
})
export class DivisionesComponent implements AfterViewInit, OnDestroy {
    resultsPage: ResultsPage = <ResultsPage>{};
    currentPage: number = PaginationConfig.INITIAL_PAGE;
    pageSize: number = PaginationConfig.PAGE_SIZE;
    turnoEnum = Turno;
    isLoading: boolean = false;

    // Propiedades para el ordenamiento
    sortField: string = 'id';
    sortDirection: string = 'desc';

    constructor(
        private divisionService: DivisionService,
        private modalService: ModalService,
        private elementRef: ElementRef,
        private divisionesAnimationService: DivisionesAnimationService,
        private cdr: ChangeDetectorRef
    ) { }

    getDivisiones(fromSort: boolean = false): void {
        this.isLoading = true;

        // Solo animar estado de carga si no viene de ordenamiento
        if (!fromSort) {
            this.divisionesAnimationService.animateLoadingBreath(this.elementRef);
        }

        this.divisionService.byPage(this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe((dataPackage) => {
            this.isLoading = false;
            this.divisionesAnimationService.stopLoadingAnimation(this.elementRef);
            this.resultsPage = <ResultsPage>dataPackage.data;

            if (fromSort) {
                // Si viene de ordenamiento, forzar detección de cambios y animar fade in
                this.cdr.detectChanges();

                setTimeout(() => {
                    this.divisionesAnimationService.animateSortTransitionIn(this.elementRef);

                    // Configurar efectos después de la transición
                    setTimeout(() => {
                        this.divisionesAnimationService.setupHoverEffects(this.elementRef);
                        this.divisionesAnimationService.animateBadges(this.elementRef);
                        this.divisionesAnimationService.animateNumbers(this.elementRef);
                    }, 300);
                }, 100);
            } else {
                // Animación normal para carga inicial/paginación
                setTimeout(() => {
                    this.divisionesAnimationService.animateDataLoad(this.elementRef, () => {
                        // Configurar efectos después de cargar los datos
                        this.divisionesAnimationService.setupHoverEffects(this.elementRef);
                        this.divisionesAnimationService.animateBadges(this.elementRef);
                        this.divisionesAnimationService.animateNumbers(this.elementRef);

                        // Si no hay datos, animar estado vacío
                        if (!this.resultsPage.content || this.resultsPage.content.length === 0) {
                            this.divisionesAnimationService.animateEmptyState(this.elementRef);
                        }
                    });
                }, 100);
            }
        });
    }

    remove(id: number, event?: Event): void {
        // Animar botón si se pasó el evento
        if (event && event.target) {
            const buttonElement = event.target as HTMLElement;
            this.divisionesAnimationService.animateButtonClick(buttonElement);
        }

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

    ngAfterViewInit(): void {
        // Configurar animaciones iniciales
        this.divisionesAnimationService.animateInitialEntrance(this.elementRef);

        // Configurar efectos de hover
        this.divisionesAnimationService.setupHoverEffects(this.elementRef);
    }

    ngOnDestroy(): void {
        // Limpiar animaciones al destruir el componente
        this.divisionesAnimationService.clearAnimations();
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

        // Animar transición de ordenamiento
        this.divisionesAnimationService.animateSortTransition(this.elementRef, () => {
            this.getDivisiones(true); // Pasar true para indicar que viene de ordenamiento
        });
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
