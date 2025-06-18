import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
import { DesignacionesAnimationService } from './designaciones-animation.service';


@Component({
    selector: 'app-designaciones',
    imports: [CommonModule, RouterModule, PaginationComponent, TipoDesignacionPipe, DniFormatPipe, FechaFormatPipe],
    templateUrl: './designaciones.component.html',
    styleUrl: './designaciones.component.css'
})
export class DesignacionesComponent implements AfterViewInit, OnDestroy {
    resultsPage: ResultsPage = <ResultsPage>{};
    currentPage: number = PaginationConfig.INITIAL_PAGE;
    pageSize: number = PaginationConfig.PAGE_SIZE;
    tipoDesignacionEnum = TipoDesignacion;
    isLoading: boolean = false;

    // Propiedades para el ordenamiento
    sortField: string = 'id';
    sortDirection: string = 'desc';

    constructor(
        private designacionService: DesignacionService,
        private modalService: ModalService,
        private validationService: ValidationService,
        private router: Router,
        private elementRef: ElementRef,
        private designacionesAnimationService: DesignacionesAnimationService,
        private cdr: ChangeDetectorRef
    ) { }

    getDesignaciones(fromSort: boolean = false): void {
        this.isLoading = true;

        // Solo animar estado de carga si no viene de ordenamiento
        if (!fromSort) {
            this.designacionesAnimationService.animateLoadingBreath(this.elementRef);
        }

        this.designacionService.byPage(this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe((dataPackage) => {
            this.isLoading = false;
            this.designacionesAnimationService.stopLoadingAnimation(this.elementRef);
            this.resultsPage = <ResultsPage>dataPackage.data;

            if (fromSort) {
                // Si viene de ordenamiento, forzar detección de cambios y animar fade in
                this.cdr.detectChanges();
                
                setTimeout(() => {
                    this.designacionesAnimationService.animateSortTransitionIn(this.elementRef);
                    
                    // Configurar efectos después de la transición
                    setTimeout(() => {
                        this.designacionesAnimationService.setupHoverEffects(this.elementRef);
                        this.designacionesAnimationService.animateBadges(this.elementRef);
                        this.designacionesAnimationService.animateNumbers(this.elementRef);
                        this.designacionesAnimationService.animateDesignacionEffects(this.elementRef);
                    }, 300);
                }, 100);
            } else {
                // Animación normal para carga inicial/paginación
                setTimeout(() => {
                    this.designacionesAnimationService.animateDataLoad(this.elementRef, () => {
                        // Configurar efectos después de cargar los datos
                        this.designacionesAnimationService.setupHoverEffects(this.elementRef);
                        this.designacionesAnimationService.animateBadges(this.elementRef);
                        this.designacionesAnimationService.animateNumbers(this.elementRef);
                        this.designacionesAnimationService.animateDesignacionEffects(this.elementRef);
                        
                        // Si no hay datos, animar estado vacío
                        if (!this.resultsPage.content || this.resultsPage.content.length === 0) {
                            this.designacionesAnimationService.animateEmptyState(this.elementRef);
                        }
                    });
                }, 100);
            }
        });
    }

    /**
     * Método para navegar a la creación de una nueva designación
     * con validación previa de requisitos
     */
    crearNueva(event?: Event): void {
        // Animar botón si se pasó el evento
        if (event && event.target) {
            const buttonElement = event.target as HTMLElement;
            this.designacionesAnimationService.animateButtonClick(buttonElement);
        }

        this.validationService.validateWithFeedback(
            () => this.validationService.canCreateDesignacion()
        ).subscribe(canCreate => {
            if (canCreate) {
                // Animación de validación exitosa
                if (event && event.target) {
                    const buttonElement = event.target as HTMLElement;
                    this.designacionesAnimationService.animateValidationSuccess(buttonElement);
                }
                
                // Pequeño delay para mostrar la animación antes de navegar
                setTimeout(() => {
                    this.router.navigateByUrl('/designaciones/new');
                }, 600);
            } else {
                // Animación de validación fallida
                if (event && event.target) {
                    const buttonElement = event.target as HTMLElement;
                    this.designacionesAnimationService.animateValidationError(buttonElement);
                }
            }
        });
    }

    remove(id: number, event?: Event): void {
        // Animar botón si se pasó el evento
        if (event && event.target) {
            const buttonElement = event.target as HTMLElement;
            this.designacionesAnimationService.animateButtonClick(buttonElement);
        }

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

    ngAfterViewInit(): void {
        // Configurar animaciones iniciales
        this.designacionesAnimationService.animateInitialEntrance(this.elementRef);
        
        // Configurar efectos de hover
        this.designacionesAnimationService.setupHoverEffects(this.elementRef);
    }

    ngOnDestroy(): void {
        // Limpiar animaciones al destruir el componente
        this.designacionesAnimationService.clearAnimations();
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
        
        // Animar transición de ordenamiento
        this.designacionesAnimationService.animateSortTransition(this.elementRef, () => {
            this.getDesignaciones(true); // Pasar true para indicar que viene de ordenamiento
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
