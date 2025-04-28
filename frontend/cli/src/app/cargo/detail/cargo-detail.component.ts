import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDatepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { DivisionService } from '../../division/service/division.service';
import { ModalService } from '../../modal/modal.service';
import { Cargo } from '../../models/cargo';
import { Division } from '../../models/division';
import { TipoDesignacion } from '../../models/tipo-designacion';
import { Turno } from '../../models/turno';
import { CargoService } from '../service/cargo.service';

@Component({
    selector: 'app-cargo-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, NgbDatepickerModule, NgbTypeaheadModule],
    templateUrl: './cargo-detail.component.html',
    styles: `
    .input-group-text {
      width: 100px;
    }
    .calendar {
      cursor: pointer;
    }
  `
})
export class CargoDetailComponent implements OnInit {
    cargo!: Cargo;
    tiposDesignacion = Object.values(TipoDesignacion);
    isNewCargo: boolean = true;
    divisionSeleccionada: any = '';
    turnoEnum = Turno; // Necesario para acceder a la enumeración desde el HTML

    tituloFormulario: string = 'Nuevo Cargo Institucional';

    searching = false;
    searchFailed = false;

    constructor(
        private route: ActivatedRoute,
        private cargoService: CargoService,
        private divisionService: DivisionService,
        private location: Location,
        private modalService: ModalService
    ) { }

    goBack(): void {
        this.location.back();
    }

    // Método para mostrar el valor amigable del enum TipoDesignacion
    getTipoDisplay(tipoDesignacion: TipoDesignacion): string {
        return tipoDesignacion;
    }

    save(): void {
        this.cargoService.save(this.cargo, this.isNewCargo).subscribe({
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
                        "Cargo guardado correctamente",
                        ""
                    ).then(() => this.goBack());
                }
            }
        });
    }

    get(): void {
        const id = this.route.snapshot.paramMap.get("id")!;
        if (id === "new") {
            // Inicializar el cargo con valores vacíos
            this.cargo = <Cargo>{};
            this.tituloFormulario = 'Nuevo Cargo Institucional';
            this.isNewCargo = true;  // Es un nuevo cargo
        } else {
            this.cargoService.get(parseInt(id!)).subscribe({
                next: (dataPackage) => {
                    this.cargo = <Cargo>dataPackage.data;
                    this.tituloFormulario = 'Editar Cargo';
                    this.isNewCargo = false;  // Es un cargo existente

                    // Si tiene una división asignada, establecer el campo de texto
                    if (this.cargo.division) {
                        // Asignar la división completa a divisionSeleccionada
                        this.divisionSeleccionada = this.cargo.division;
                    }
                }
            });
        }
    }

    searchDivision = (text$: Observable<string>): Observable<Division[]> =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            filter(term => term.length >= 2),
            tap(() => this.searching = true),
            switchMap(term =>
                this.divisionService.search(term).pipe(
                    map(dataPackage => <Division[]>dataPackage.data),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    })
                )
            ),
            tap(() => this.searching = false)
        );

    // Formateador de resultados en el dropdown
    resultDivisionFormat = (division: Division): string =>
        `${division.anio}° ${division.numDivision} - ${division.orientacion} - ${division.turno}`;

    // Formateador para el input cuando se selecciona un valor
    inputDivisionFormat = (division: Division | string): string => {
        if (typeof division === 'string') {
            return division;
        }
        return division && division.orientacion ? division.orientacion : '';
    }

    // Método para seleccionar una división
    seleccionarDivision(division: Division): void {
        if (division) {
            this.cargo.division = division;
            this.divisionSeleccionada = division;
        }
    }

    ngOnInit(): void {
        this.get();
    }
}