import { Component } from '@angular/core';
import { ResultsPage } from '../../models/results-page';
import { PersonaService } from '../service/persona.service';
import { ModalService } from '../../modal/modal.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from '../../pagination/pagination.component';

@Component({
  selector: 'app-persona',
  imports: [CommonModule, RouterModule, PaginationComponent],
  templateUrl: './personas.component.html',
  styles: ``
})
export class PersonasComponent {
  resultsPage: ResultsPage = <ResultsPage>{};
  currentPage: number = 1;

  constructor(
    private personaService: PersonaService,
    private modalService: ModalService
  ) { }

  getPersonas(): void {
    this.personaService.byPage(this.currentPage, 4).subscribe((dataPackage) => {
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
        that.personaService.remove(id).subscribe((dataPackage) => {
          that.getPersonas();
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
