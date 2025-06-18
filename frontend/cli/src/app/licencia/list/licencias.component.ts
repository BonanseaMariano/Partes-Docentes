import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, TemplateRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
import { LicenciasAnimationService } from './licencias-animation.service';


@Component({
    selector: 'app-licencias',
    standalone: true,
    imports: [CommonModule, RouterModule, PaginationComponent, DniFormatPipe, FechaFormatPipe],
    templateUrl: './licencias.component.html',
    styleUrls: ['./licencias.component.css']
})
export class LicenciasComponent implements AfterViewInit, OnDestroy {
    resultsPage: ResultsPage = <ResultsPage>{};
    currentPage: number = PaginationConfig.INITIAL_PAGE;
    pageSize: number = PaginationConfig.PAGE_SIZE;
    isLoading: boolean = false;

    // Exponemos el enum para usarlo en el template
    Estado = Estado;

    // Propiedades para el ordenamiento
    sortField: string = 'id';
    sortDirection: string = 'desc';

    selectedLicencia: Licencia | null = null;

    @ViewChild('designacionesTemplate', { static: true }) designacionesTemplate!: TemplateRef<any>;
    @ViewChild('logsTemplate', { static: true }) logsTemplate!: TemplateRef<any>;

    constructor(
        private licenciaService: LicenciaService,
        private modalService: ModalService,
        private popupService: PopupService,
        private designacionService: DesignacionService,
        private elementRef: ElementRef,
        private licenciasAnimationService: LicenciasAnimationService,
        private cdr: ChangeDetectorRef
    ) { }

    getLicencias(fromSort: boolean = false): void {
        this.isLoading = true;

        // Solo animar estado de carga si no viene de ordenamiento
        if (!fromSort) {
            this.licenciasAnimationService.animateLoadingBreath(this.elementRef);
        }

        this.licenciaService.byPage(this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe((dataPackage) => {
            this.isLoading = false;
            this.licenciasAnimationService.stopLoadingAnimation(this.elementRef);
            this.resultsPage = <ResultsPage>dataPackage.data;

            if (fromSort) {
                // Si viene de ordenamiento, forzar detección de cambios y animar fade in
                this.cdr.detectChanges();
                
                setTimeout(() => {
                    this.licenciasAnimationService.animateSortTransitionIn(this.elementRef);
                    
                    // Configurar efectos después de la transición
                    setTimeout(() => {
                        this.licenciasAnimationService.setupHoverEffects(this.elementRef);
                        this.licenciasAnimationService.animateBadges(this.elementRef);
                        this.licenciasAnimationService.animateNumbers(this.elementRef);
                    }, 300);
                }, 100);
            } else {
                // Animación normal para carga inicial/paginación
                setTimeout(() => {
                    this.licenciasAnimationService.animateDataLoad(this.elementRef, () => {
                        // Configurar efectos después de cargar los datos
                        this.licenciasAnimationService.setupHoverEffects(this.elementRef);
                        this.licenciasAnimationService.animateBadges(this.elementRef);
                        this.licenciasAnimationService.animateNumbers(this.elementRef);
                        
                        // Si no hay datos, animar estado vacío
                        if (!this.resultsPage.content || this.resultsPage.content.length === 0) {
                            this.licenciasAnimationService.animateEmptyState(this.elementRef);
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
            this.licenciasAnimationService.animateButtonClick(buttonElement);
        }

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

    openDesignacionesPopup(licencia: Licencia, event?: Event): void {
        // Animar botón si se pasó el evento
        if (event && event.target) {
            const buttonElement = event.target as HTMLElement;
            this.licenciasAnimationService.animateDesignacionesButtonClick(buttonElement);
        }

        this.selectedLicencia = licencia;
        this.popupService.show(this.designacionesTemplate, {
            title: `Designaciones de la licencia`,
            icon: 'fa-user-tie',
            data: licencia
        });

        // Animar entrada del popup después de un pequeño delay
        setTimeout(() => {
            const popupContainer = document.querySelector('.popup-container');
            if (popupContainer) {
                const elementRef = { nativeElement: popupContainer };
                this.licenciasAnimationService.animatePopupEntrance(elementRef as ElementRef);
                
                // Animar contenido de designaciones específicamente
                setTimeout(() => {
                    this.licenciasAnimationService.animatePopupContent(elementRef as ElementRef, 'designaciones');
                }, 200);
            }
        }, 50);
    }

    openLogsPopup(licencia: Licencia, event?: Event): void {
        // Animar botón si se pasó el evento
        if (event && event.target) {
            const buttonElement = event.target as HTMLElement;
            this.licenciasAnimationService.animateLogsButtonClick(buttonElement);
        }

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

        // Animar entrada del popup después de un pequeño delay
        setTimeout(() => {
            const popupContainer = document.querySelector('.popup-container');
            if (popupContainer) {
                const elementRef = { nativeElement: popupContainer };
                this.licenciasAnimationService.animatePopupEntrance(elementRef as ElementRef);
                
                // Animar contenido de logs específicamente
                setTimeout(() => {
                    this.licenciasAnimationService.animatePopupContent(elementRef as ElementRef, 'logs');
                }, 200);
            }
        }, 50);
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

    ngAfterViewInit(): void {
        // Configurar animaciones iniciales
        this.licenciasAnimationService.animateInitialEntrance(this.elementRef);
        
        // Configurar efectos de hover
        this.licenciasAnimationService.setupHoverEffects(this.elementRef);
    }

    ngOnDestroy(): void {
        // Limpiar animaciones al destruir el componente
        this.licenciasAnimationService.clearAnimations();
    }

    onPageChangeRequested(page: number): void {
        this.currentPage = page;
        this.getLicencias();
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
        this.licenciasAnimationService.animateSortTransition(this.elementRef, () => {
            this.getLicencias(true); // Pasar true para indicar que viene de ordenamiento
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