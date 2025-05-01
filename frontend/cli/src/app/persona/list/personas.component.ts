import { Component } from '@angular/core';
import { ResultsPage } from '../../models/results-page';
import { PersonaService } from '../service/persona.service';
import { ModalService } from '../../modal/modal.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from '../../pagination/pagination.component';
import { PaginationConfig } from '../../core/constants/pagination.constants';

@Component({
  selector: 'app-persona',
  imports: [CommonModule, RouterModule, PaginationComponent],
  templateUrl: './personas.component.html',
  styles: ``
})
export class PersonasComponent {
  resultsPage: ResultsPage = <ResultsPage>{};
  currentPage: number = PaginationConfig.INITIAL_PAGE;
  pageSize: number = PaginationConfig.PAGE_SIZE;

  constructor(
    private personaService: PersonaService,
    private modalService: ModalService
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

  ngOnInit(): void {
    this.getPersonas();
  }

  onPageChangeRequested(page: number): void {
    this.currentPage = page;
    this.getPersonas();
  }
}
