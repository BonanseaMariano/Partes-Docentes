import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../modal/modal.service';
import { Division } from '../../models/division';
import { DivisionService } from '../service/division.service';
import { Turno } from '../../models/turno';

@Component({
    selector: 'app-division-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, NgbModule],
    templateUrl: './division-detail.component.html',
    styles: `
    .input-group-text {
      width: 100px;
    }
  `
})
export class DivisionDetailComponent implements OnInit {
    division!: Division;
    turnos = Object.values(Turno);
    turnoEnum = Turno;
    isNewDivision: boolean = true;

    tituloFormulario: string = 'Nueva División';

    constructor(
        private route: ActivatedRoute,
        private divisionService: DivisionService,
        private location: Location,
        private modalService: ModalService
    ) { }

    goBack(): void {
        this.location.back();
    }

    // Método para mostrar el valor amigable del enum Turno
    getTurnoDisplay(turno: Turno): string {
        return turno;
    }

    save(): void {
        this.divisionService.save(this.division, this.isNewDivision).subscribe({
            next: (dataPackage) => {
                if (dataPackage.status !== 200) {
                    this.modalService.error(
                        "Error al guardar",
                        dataPackage.message,
                        ""
                    );
                } else {
                    this.modalService.success(
                        "Éxito",
                        dataPackage.message,
                        ""
                    ).then(() => this.goBack());
                }
            }
        });
    }

    get(): void {
        const id = this.route.snapshot.paramMap.get("id")!;
        if (id === "new") {
            // Inicializar la división con valores vacios
            this.division = <Division>{};
            this.tituloFormulario = 'Nueva Division';
            this.isNewDivision = true;  // Es una nueva división
        } else {
            this.divisionService.get(parseInt(id!)).subscribe({
                next: (dataPackage) => {
                    this.division = <Division>dataPackage.data;
                    this.tituloFormulario = 'Editar Division';
                    this.isNewDivision = false;  // Es una división existente
                }
            });
        }
    }

    ngOnInit(): void {
        this.get();
    }
}
