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
    turnos = Object.keys(Turno).filter(key => isNaN(Number(key)));

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

    save(): void {
        this.divisionService.save(this.division).subscribe({
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
                        "División guardada correctamente",
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
        } else {
            this.divisionService.get(parseInt(id!)).subscribe({
                next: (dataPackage) => {
                    this.division = <Division>dataPackage.data;
                    this.tituloFormulario = 'Editar Division';
                }
            });
        }
    }

    ngOnInit(): void {
        this.get();
    }
}
