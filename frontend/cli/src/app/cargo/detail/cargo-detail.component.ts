import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TipoDesignacionPipe } from '../../pipes/tipo-designacion.pipe';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
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
    imports: [CommonModule, FormsModule, NgbDatepickerModule, NgbTypeaheadModule, TipoDesignacionPipe],
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
export class CargoDetailComponent implements OnInit, AfterViewChecked {
    @ViewChild('form') form!: NgForm;

    cargo!: Cargo;
    tiposDesignacion = Object.values(TipoDesignacion);
    tipoDesignacionEnum = TipoDesignacion; // Para acceder a la enumeración desde el HTML
    isNewCargo: boolean = true;
    divisionSeleccionada: any = '';
    turnoEnum = Turno; // Necesario para acceder a la enumeración desde el HTML

    // Para validaciones
    divisionValida: boolean = true; // Por defecto true porque no es obligatoria para todos los tipos
    mostrarErrorDivision: boolean = false;
    formularioValido: boolean = false;

    // Nueva propiedad para controlar la restricción del tipo de cargo
    tipoRestringido: boolean = false;

    // Propiedades para los datepickers
    fechaInicioDate: NgbDateStruct | null = null;
    fechaFinDate: NgbDateStruct | null = null;

    tituloFormulario: string = 'Nuevo Cargo Institucional';

    constructor(
        private route: ActivatedRoute,
        private cargoService: CargoService,
        private divisionService: DivisionService,
        private location: Location,
        private modalService: ModalService,
        public calendar: NgbCalendar,
        private cdr: ChangeDetectorRef
    ) { }

    goBack(): void {
        this.location.back();
    }

    // Método para verificar si el formulario es válido
    verificarFormularioValido(): void {
        // Verificar campos básicos obligatorios
        if (!this.form) {
            this.formularioValido = false;
            return;
        }

        // Verificar la fecha de inicio de forma segura
        let fechaInicioValida = false;
        if (this.form && this.form.controls['fechaInicio']) {
            const control = this.form.controls['fechaInicio'];
            fechaInicioValida = control.valid === true;
        }

        // Verificar si necesita una división válida (solo para ESPACIO_CURRICULAR)
        const formIsValid = this.form.valid === true;

        if (this.cargo && this.cargo.tipoDesignacion === TipoDesignacion.ESPACIO_CURRICULAR) {
            // Si es espacio curricular, la división es obligatoria
            const divisionId = this.cargo.division?.id;
            this.divisionValida = divisionId !== undefined && divisionId !== null;

            this.formularioValido = formIsValid && fechaInicioValida && this.divisionValida;
        } else {
            // Si no es espacio curricular, la división no es necesaria
            this.formularioValido = formIsValid && fechaInicioValida;
        }
    }

    // Este método se ejecuta después de cada ciclo de detección de cambios
    ngAfterViewChecked() {
        this.verificarFormularioValido();
        this.cdr.detectChanges();
    }

    // Ya no necesitamos este método, usaremos el pipe TipoDesignacionPipe en su lugar

    // Método para manejar cambios en el tipo de designación
    onTipoDesignacionChange(): void {
        if (this.cargo.tipoDesignacion !== TipoDesignacion.ESPACIO_CURRICULAR) {
            // Si el tipo no es "Espacio Curricular", limpiar la división
            this.cargo.division = undefined;
            this.divisionSeleccionada = '';
            this.divisionValida = true; // No se necesita división, por lo que es "válido"
            this.mostrarErrorDivision = false;
        } else {
            // Si cambia a Espacio Curricular, marcar como inválido si no hay división
            this.divisionValida = !!this.cargo.division?.id;
        }
        this.verificarFormularioValido();
    }

    // Método para manejar cambios en el input de división
    onDivisionInputChange(value: any): void {
        // Si el campo está vacío, limpiar la división asignada
        if (value === '') {
            this.cargo.division = undefined;
            this.divisionValida = false;
        } else if (typeof value === 'string' && !this.cargo.division?.id) {
            // Si es texto pero no corresponde a una división seleccionada
            this.divisionValida = false;
        }
        this.verificarFormularioValido();
    }

    // Método para detectar cambios en los datepickers
    onDateChange(): void {
        this.verificarFormularioValido();
    }

    save(): void {
        // Verificar si se necesita división (para ESPACIO_CURRICULAR)
        if (this.cargo.tipoDesignacion === TipoDesignacion.ESPACIO_CURRICULAR && !this.cargo.division?.id) {
            this.mostrarErrorDivision = true;
            return;
        }

        // Convertir las fechas de NgbDateStruct a objetos Date para el backend
        if (this.fechaInicioDate) {
            const fechaInicio = new Date(
                this.fechaInicioDate.year,
                this.fechaInicioDate.month - 1,
                this.fechaInicioDate.day
            );
            this.cargo.fechaInicio = fechaInicio;
        }

        if (this.fechaFinDate) {
            const fechaFin = new Date(
                this.fechaFinDate.year,
                this.fechaFinDate.month - 1,
                this.fechaFinDate.day
            );
            this.cargo.fechaFin = fechaFin;
        } else {
            // Si no hay fecha fin, establecer a undefined (en lugar de null)
            this.cargo.fechaFin = undefined;
        }

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

        // Verificar si hay un parámetro de restricción de tipo en la URL
        this.tipoRestringido = this.route.snapshot.queryParams['restringirTipo'] === 'true';

        if (this.tipoRestringido) {
            // Filtrar los tipos disponibles para mostrar solo "Cargo"
            this.tiposDesignacion = [TipoDesignacion.CARGO];
        }

        if (id === "new") {
            // Inicializar el cargo con valores vacíos
            this.cargo = <Cargo>{};

            // Si el tipo está restringido, establecer el tipo como Cargo automáticamente
            if (this.tipoRestringido) {
                this.cargo.tipoDesignacion = TipoDesignacion.CARGO;
            }

            this.tituloFormulario = 'Nuevo Cargo Institucional';
            this.isNewCargo = true;  // Es un nuevo cargo
            // Establecer la fecha de inicio al día de hoy
            this.fechaInicioDate = this.calendar.getToday();

            // Verificar el estado inicial del formulario
            setTimeout(() => this.verificarFormularioValido(), 0);
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

                    // Convertir fechas del cargo a objetos NgbDateStruct
                    if (this.cargo.fechaInicio) {
                        const fechaInicio = new Date(this.cargo.fechaInicio);
                        this.fechaInicioDate = {
                            year: fechaInicio.getFullYear(),
                            month: fechaInicio.getMonth() + 1,
                            day: fechaInicio.getDate()
                        };
                    }

                    if (this.cargo.fechaFin) {
                        const fechaFin = new Date(this.cargo.fechaFin);
                        this.fechaFinDate = {
                            year: fechaFin.getFullYear(),
                            month: fechaFin.getMonth() + 1,
                            day: fechaFin.getDate()
                        };
                    }

                    // Verificar el estado inicial del formulario
                    setTimeout(() => this.verificarFormularioValido(), 0);
                }
            });
        }
    }

    searchDivision = (text$: Observable<string>): Observable<Division[]> =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            filter(term => term.length >= 2),
            switchMap(term =>
                this.divisionService.search(term).pipe(
                    map(dataPackage => <Division[]>dataPackage.data),
                    catchError(() => of([]))
                )
            )
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
            this.divisionValida = true;
            this.mostrarErrorDivision = false;
            this.verificarFormularioValido();
        }
    }

    ngOnInit(): void {
        this.get();
    }
}