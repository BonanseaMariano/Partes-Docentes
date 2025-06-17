import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, TemplateRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PaginationConfig } from '../../core/constants/pagination.constants';
import { ValidationService } from '../../core/services/validation.service';
import { ModalService } from '../../modal/modal.service';
import { Cargo } from '../../models/cargo';
import { Dia } from '../../models/horario';
import { ResultsPage } from '../../models/results-page';
import { TipoDesignacion } from '../../models/tipo-designacion';
import { PaginationComponent } from '../../pagination/pagination.component';
import { FechaFormatPipe } from '../../pipes/fecha-format.pipe';
import { TipoDesignacionPipe } from '../../pipes/tipo-designacion.pipe';
import { PopupService } from '../../popup/popup.service';
import { CargoService } from '../service/cargo.service';
import { CargosAnimationService } from './cargos-animation.service';


@Component({
    selector: 'app-cargos',
    imports: [CommonModule, RouterModule, PaginationComponent, TipoDesignacionPipe, FechaFormatPipe],
    templateUrl: './cargos.component.html',
    styleUrl: './cargos.component.css'
})
export class CargosComponent implements AfterViewInit, OnDestroy {
    resultsPage: ResultsPage = <ResultsPage>{};
    currentPage: number = PaginationConfig.INITIAL_PAGE;
    pageSize: number = PaginationConfig.PAGE_SIZE;
    tipoDesignacionEnum = TipoDesignacion;
    diaEnum = Dia;
    selectedCargo: Cargo | null = null;
    Object = Object; // Para poder usar Object.keys en la plantilla
    isLoading: boolean = false;

    // Propiedades para el ordenamiento
    sortField: string = 'id';
    sortDirection: string = 'desc';

    @ViewChild('horariosTemplate', { static: true }) horariosTemplate!: TemplateRef<any>;

    constructor(
        public cargoService: CargoService, // Cambiado a público para poder acceder desde la plantilla
        private modalService: ModalService,
        private validationService: ValidationService,
        private popupService: PopupService,
        private router: Router,
        private elementRef: ElementRef,
        private cargosAnimationService: CargosAnimationService,
        private cdr: ChangeDetectorRef
    ) { }

    /**
     * Método para crear un nuevo cargo con validación previa
     */
    crearNuevo(event?: Event): void {
        // Animar botón si se pasó el evento
        if (event && event.target) {
            const buttonElement = event.target as HTMLElement;
            this.cargosAnimationService.animateButtonClick(buttonElement);
        }

        this.validationService.checkDivisiones().subscribe(result => {
            const hayDivisiones = result.isValid;

            // Si hay divisiones, navegamos directamente
            if (hayDivisiones) {
                this.router.navigate(['/cargos/new']);
                return;
            }

            // Si no hay divisiones, mostramos confirmación
            this.modalService.confirm(
                result.errorTitle || 'No existen divisiones',
                result.errorMessage || 'No hay divisiones en el sistema',
                result.errorDescription || 'Solo se podrán crear cargos de tipo "Cargo". Los cargos de tipo "Espacio Curricular" requieren una división asociada.'
            ).then(() => {
                // Si el usuario acepta, navegamos con restricción
                this.router.navigate(['/cargos/new'], { queryParams: { restringirTipo: 'true' } });
            }, () => {
                // Si cancela, no hacemos nada
            });
        });
    }

    getCargos(fromSort: boolean = false): void {
        this.isLoading = true;

        // Solo animar estado de carga si no viene de ordenamiento
        if (!fromSort) {
            this.cargosAnimationService.animateLoadingBreath(this.elementRef);
        }

        this.cargoService.byPage(this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe((dataPackage) => {
            this.isLoading = false;
            this.cargosAnimationService.stopLoadingAnimation(this.elementRef);
            this.resultsPage = <ResultsPage>dataPackage.data;

            if (fromSort) {
                // Si viene de ordenamiento, forzar detección de cambios y animar fade in
                this.cdr.detectChanges();

                setTimeout(() => {
                    this.cargosAnimationService.animateSortTransitionIn(this.elementRef);

                    // Configurar efectos después de la transición
                    setTimeout(() => {
                        this.cargosAnimationService.setupHoverEffects(this.elementRef);
                        this.cargosAnimationService.animateBadges(this.elementRef);
                        this.cargosAnimationService.animateNumbers(this.elementRef);
                    }, 300);
                }, 100);
            } else {
                // Animación normal para carga inicial/paginación
                setTimeout(() => {
                    this.cargosAnimationService.animateDataLoad(this.elementRef, () => {
                        // Configurar efectos después de cargar los datos
                        this.cargosAnimationService.setupHoverEffects(this.elementRef);
                        this.cargosAnimationService.animateBadges(this.elementRef);
                        this.cargosAnimationService.animateNumbers(this.elementRef);

                        // Si no hay datos, animar estado vacío
                        if (!this.resultsPage.content || this.resultsPage.content.length === 0) {
                            this.cargosAnimationService.animateEmptyState(this.elementRef);
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
            this.cargosAnimationService.animateButtonClick(buttonElement);
        }

        let that = this;
        this.modalService
            .confirm(
                "Eliminar cargo",
                "¿Estás seguro de que deseas eliminar este cargo?",
                "Si elimina el cargo no lo podrá utilizar luego"
            )
            .then(function () {
                that.cargoService.remove(id).subscribe({
                    next: (dataPackage) => {
                        if (dataPackage.status === HttpStatusCode.InternalServerError) {
                            that.modalService.error(
                                "Error al eliminar",
                                dataPackage.message,
                                ""
                            );
                        }
                        that.getCargos();
                    }
                });
            });
    }

    openHorariosPopup(cargo: Cargo, event?: Event): void {
        // Animar botón si se pasó el evento
        if (event && event.target) {
            const buttonElement = event.target as HTMLElement;
            this.cargosAnimationService.animateHorariosButtonClick(buttonElement);
        }

        this.selectedCargo = cargo;
        this.popupService.show(this.horariosTemplate, {
            title: `Horarios de ${cargo.nombre}`,
            icon: 'fa-clock-o', // Icono de reloj
            data: cargo
        });

        // Animar entrada del popup después de un pequeño delay
        setTimeout(() => {
            const popupContainer = document.querySelector('.popup-container');
            if (popupContainer) {
                const elementRef = { nativeElement: popupContainer };
                this.cargosAnimationService.animatePopupEntrance(elementRef as ElementRef);

                // Animar contenido de horarios específicamente
                setTimeout(() => {
                    this.cargosAnimationService.animateHorariosPopup(elementRef as ElementRef);
                }, 200);
            }
        }, 50);
    }

    getHorarioCount(cargo: Cargo): number {
        return this.cargoService.hasHorarios(cargo) ? cargo.horarios.length : 0;
    }

    // Método auxiliar para ordenar los horarios por día y hora
    getOrderedHorarios(cargo: Cargo): any[] {
        return this.cargoService.orderHorarios(cargo.horarios);
    }

    getHorariosByDay(cargo: Cargo): { [key: string]: any[] } {
        return this.cargoService.getHorariosByDay(cargo);
    }

    ngOnInit(): void {
        this.getCargos();
    }

    ngAfterViewInit(): void {
        // Configurar animaciones iniciales
        this.cargosAnimationService.animateInitialEntrance(this.elementRef);

        // Configurar efectos de hover
        this.cargosAnimationService.setupHoverEffects(this.elementRef);
    }

    ngOnDestroy(): void {
        // Limpiar animaciones al destruir el componente
        this.cargosAnimationService.clearAnimations();
    }

    onPageChangeRequested(page: number): void {
        this.currentPage = page;
        this.getCargos();
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
        this.cargosAnimationService.animateSortTransition(this.elementRef, () => {
            this.getCargos(true); // Pasar true para indicar que viene de ordenamiento
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
