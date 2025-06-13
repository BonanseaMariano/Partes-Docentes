import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-persona',
  imports: [CommonModule, RouterModule, PaginationComponent, CuilFormatPipe, DniFormatPipe, FechaFormatPipe],
  templateUrl: './personas.component.html'
})
export class PersonasComponent {
  resultsPage: ResultsPage = <ResultsPage>{};
  currentPage: number = PaginationConfig.INITIAL_PAGE;
  pageSize: number = PaginationConfig.PAGE_SIZE;
  currentYear: number = new Date().getFullYear();

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
    private router: Router
  ) { }

  getPersonas(): void {
    this.personaService.byPage(this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe((dataPackage) => {
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

  openDesignacionesPopup(persona: Persona): void {
    this.selectedPersona = persona;
    this.popupService.show(this.designacionesTemplate, {
      title: `Designaciones de ${persona.nombre} ${persona.apellido}`,
      icon: 'fa-user-tie', // Agregando el icono de usuario con corbata
      data: persona
    });
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
    this.getPersonas();
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
