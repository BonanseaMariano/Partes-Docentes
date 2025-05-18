import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginationConfig } from '../../core/constants/pagination.constants';
import { DesignacionService } from '../../designacion/service/designacion.service';
import { ModalService } from '../../modal/modal.service';
import { Designacion } from '../../models/designacion';
import { Persona } from '../../models/persona';
import { ResultsPage } from '../../models/results-page';
import { PaginationComponent } from '../../pagination/pagination.component';
import { CuilFormatPipe } from '../../pipes/cuil-format.pipe';
import { DniFormatPipe } from '../../pipes/dni-format.pipe';
import { PopupService } from '../../popup/popup.service';
import { PersonaService } from '../service/persona.service';

@Component({
  selector: 'app-persona',
  imports: [CommonModule, RouterModule, PaginationComponent, CuilFormatPipe, DniFormatPipe],
  templateUrl: './personas.component.html',
})
export class PersonasComponent {
  resultsPage: ResultsPage = <ResultsPage>{};
  currentPage: number = PaginationConfig.INITIAL_PAGE;
  pageSize: number = PaginationConfig.PAGE_SIZE;

  selectedPersona: Persona | null = null;

  @ViewChild('designacionesTemplate', { static: true }) designacionesTemplate!: TemplateRef<any>;

  constructor(
    private personaService: PersonaService,
    private modalService: ModalService,
    private popupService: PopupService,
    private designacionService: DesignacionService
  ) { }

  getPersonas(): void {
    this.personaService.byPage(this.currentPage, this.pageSize).subscribe((dataPackage) => {
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
            if (dataPackage.status === 409) {
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

  formatFechaDesignacion(fecha: Date | string | null | undefined): string {
    if (!fecha) return '';

    const dateObj = fecha instanceof Date ? fecha : new Date(fecha);
    return dateObj.toLocaleDateString('es-AR');
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
}
