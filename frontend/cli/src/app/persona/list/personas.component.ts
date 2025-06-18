import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, TemplateRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PaginationConfig } from '../../core/constants/pagination.constants';
import { DesignacionService } from '../../designacion/service/designacion.service';
import { ModalService } from '../../modal/modal.service';
import { Designacion } from '../../models/designacion';
import { Persona } from '../../models/persona';
import { ResultsPage } from '../../models/results-page';
import { PaginationComponent } from '../../pagination/pagination.component';
import { CuilFormatPipe } from '../../pipes/cuil-format.pipe';
import { DniFormatPipe } from '../../pipes/dni-format.pipe';
import { FechaFormatPipe } from '../../pipes/fecha-format.pipe';
import { PopupService } from '../../popup/popup.service';
import { PersonaService } from '../service/persona.service';
import { PersonasAnimationService } from './personas-animation.service';

@Component({
  selector: 'app-persona',
  imports: [CommonModule, RouterModule, PaginationComponent, CuilFormatPipe, DniFormatPipe, FechaFormatPipe],
  templateUrl: './personas.component.html',
  styleUrl: './personas.component.css'
})
export class PersonasComponent implements AfterViewInit, OnDestroy {
  resultsPage: ResultsPage = <ResultsPage>{};
  currentPage: number = PaginationConfig.INITIAL_PAGE;
  pageSize: number = PaginationConfig.PAGE_SIZE;
  currentYear: number = new Date().getFullYear();
  isLoading: boolean = false;

  // Propiedades para el ordenamiento
  sortField: string = 'id';
  sortDirection: string = 'desc';

  selectedPersona: Persona | null = null;

  @ViewChild('designacionesTemplate', { static: true }) designacionesTemplate!: TemplateRef<any>;

  constructor(
    private personaService: PersonaService,
    private modalService: ModalService,
    private popupService: PopupService,
    private designacionService: DesignacionService,
    private router: Router,
    private elementRef: ElementRef,
    private personasAnimationService: PersonasAnimationService,
    private cdr: ChangeDetectorRef
  ) { }

  getPersonas(fromSort: boolean = false): void {
    this.isLoading = true;

    // Solo animar estado de carga si no viene de ordenamiento
    if (!fromSort) {
      this.personasAnimationService.animateLoadingBreath(this.elementRef);
    }

    this.personaService.byPage(this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe((dataPackage) => {
      this.isLoading = false;
      this.personasAnimationService.stopLoadingAnimation(this.elementRef);
      this.resultsPage = <ResultsPage>dataPackage.data;

      if (fromSort) {
        // Si viene de ordenamiento, forzar detección de cambios y animar fade in
        this.cdr.detectChanges();

        setTimeout(() => {
          this.personasAnimationService.animateSortTransitionIn(this.elementRef);

          // Configurar efectos de hover después de la transición
          setTimeout(() => {
            this.personasAnimationService.setupHoverEffects(this.elementRef);
            this.personasAnimationService.animateCounters(this.elementRef);
          }, 300);
        }, 100); // Aumentar el delay para asegurar que el DOM se actualice
      } else {
        // Animación normal para carga inicial/paginación
        setTimeout(() => {
          this.personasAnimationService.animateDataLoad(this.elementRef, () => {
            // Configurar efectos de hover después de cargar los datos
            this.personasAnimationService.setupHoverEffects(this.elementRef);

            // Animar contadores
            this.personasAnimationService.animateCounters(this.elementRef);
          });
        }, 100);
      }
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
        that.personaService.remove(id).subscribe({
          next: (dataPackage) => {
            if (dataPackage.status === HttpStatusCode.InternalServerError) {
              that.modalService.error(
                "Error al eliminar",
                dataPackage.message,
                ""
              );
            }
            that.getPersonas();
          }
        });
      });
  }

  openDesignacionesPopup(persona: Persona, event?: Event): void {
    // Animar botón si se pasó el evento
    if (event && event.target) {
      const buttonElement = event.target as HTMLElement;
      this.personasAnimationService.animateDesignationButtonClick(buttonElement);
    }

    this.selectedPersona = persona;
    this.popupService.show(this.designacionesTemplate, {
      title: `Designaciones de ${persona.nombre} ${persona.apellido}`,
      icon: 'fa-user-tie',
      data: persona
    });

    // Animar entrada del popup después de un pequeño delay
    setTimeout(() => {
      const popupContainer = document.querySelector('.popup-container');
      if (popupContainer) {
        const elementRef = { nativeElement: popupContainer };
        this.personasAnimationService.animatePopupEntrance(elementRef as ElementRef);
      }
    }, 50);
  }

  getDesignacionCount(persona: Persona): number {
    return persona.designaciones ? persona.designaciones.length : 0;
  }

  isDesignacionActive(designacion: Designacion): boolean {
    return this.designacionService.isActive(designacion);
  }

  ngOnInit(): void {
    this.getPersonas();
  }

  ngAfterViewInit(): void {
    // Configurar animaciones iniciales
    this.personasAnimationService.animateInitialEntrance(this.elementRef);

    // Configurar efectos de hover
    this.personasAnimationService.setupHoverEffects(this.elementRef);
  }

  ngOnDestroy(): void {
    // Limpiar animaciones al destruir el componente
    this.personasAnimationService.clearAnimations();
  }

  onPageChangeRequested(page: number): void {
    this.currentPage = page;
    this.getPersonas();
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
    this.personasAnimationService.animateSortTransition(this.elementRef, () => {
      this.getPersonas(true); // Pasar true para indicar que viene de ordenamiento
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
