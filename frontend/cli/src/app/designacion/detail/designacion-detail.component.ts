import { CommonModule, Location } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { NgbCalendar, NgbDatepickerModule, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

import { CargoService } from '../../cargo/service/cargo.service';
import { ModalService } from '../../modal/modal.service';
import { Cargo } from '../../models/cargo';
import { Designacion } from '../../models/designacion';
import { Division } from '../../models/division';
import { Persona } from '../../models/persona';
import { TipoDesignacion } from '../../models/tipo-designacion';
import { PersonaService } from '../../persona/service/persona.service';
import { DniFormatPipe } from '../../pipes/dni-format.pipe';
import { TipoDesignacionPipe } from '../../pipes/tipo-designacion.pipe';
import { DesignacionService } from '../service/designacion.service';

@Component({
    selector: 'app-designacion-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgbModule,
        NgbDatepickerModule,
        TipoDesignacionPipe,
        DniFormatPipe
    ],
    templateUrl: './designacion-detail.component.html',
    styles: `
    .input-group-text {
      width: 100px;
    }
    .calendar {
      cursor: pointer;
    }
  `
})
export class DesignacionDetailComponent implements OnInit, AfterViewChecked {
    @ViewChild('form') form!: NgForm;

    designacion!: Designacion;
    isNewDesignacion: boolean = true;
    tipoDesignacionEnum = TipoDesignacion; // Para acceder al enum desde la plantilla

    // Para los typeahead
    personaSeleccionada: any = '';
    cargoSeleccionado: any = '';

    // Propiedades para los datepickers
    fechaInicioDate: NgbDateStruct | null = null;
    fechaFinDate: NgbDateStruct | null = null;

    tituloFormulario: string = 'Nueva Designación';

    // Propiedad para determinar si el formulario es válido
    formularioValido: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private designacionService: DesignacionService,
        private personaService: PersonaService,
        private cargoService: CargoService,
        private location: Location,
        private modalService: ModalService,
        public calendar: NgbCalendar,
        private cdr: ChangeDetectorRef
    ) {
        // Inicializar la designación con valores por defecto
        this.designacion = <Designacion>{};
        // Inicializar objetos vacíos para evitar problemas de null en el HTML
        this.designacion.persona = <Persona>{};
        this.designacion.cargo = <Cargo>{};
    }

    goBack(): void {
        this.location.back();
    }

    // Método para verificar si el formulario es válido
    verificarFormularioValido(): void {
        // Primero verificar que la designación y sus propiedades existan
        if (!this.designacion) {
            this.formularioValido = false;
            return;
        }

        // Verificar que la persona y el cargo tengan un ID (lo que indica que son objetos reales)
        // y que la fecha de inicio sea válida
        this.formularioValido = !!this.designacion.persona?.id &&
            !!this.designacion.cargo?.id &&
            !!this.fechaInicioDate;

        // Verificar si la fecha de inicio es válida a través del formulario
        if (this.form && this.form.controls['fechaInicio']) {
            if (this.form.controls['fechaInicio'].invalid) {
                this.formularioValido = false;
            }
        }
    }

    // Este método se ejecuta después de cada ciclo de detección de cambios
    ngAfterViewChecked() {
        this.verificarFormularioValido();
        this.cdr.detectChanges();
    }

    save(): void {
        // Convertir las fechas de NgbDateStruct a objetos Date para el backend
        if (this.fechaInicioDate) {
            const fechaInicio = new Date(
                this.fechaInicioDate.year,
                this.fechaInicioDate.month - 1,
                this.fechaInicioDate.day
            );
            this.designacion.fechaInicio = fechaInicio;
        }

        if (this.fechaFinDate) {
            const fechaFin = new Date(
                this.fechaFinDate.year,
                this.fechaFinDate.month - 1,
                this.fechaFinDate.day
            );
            this.designacion.fechaFin = fechaFin;
        } else {
            // Si no hay fecha fin, establecer a undefined (en lugar de null)
            this.designacion.fechaFin = undefined;
        }

        this.designacionService.save(this.designacion, this.isNewDesignacion).subscribe({
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
                        "Designación guardada correctamente",
                        ""
                    ).then(() => this.goBack());
                }
            }
        });
    }

    get(): void {
        const id = this.route.snapshot.paramMap.get("id")!;
        if (id === "new") {
            // Ya no necesitamos inicializar nuevamente la designación y sus propiedades
            // porque lo hacemos en el constructor

            this.tituloFormulario = 'Nueva Designación';
            this.isNewDesignacion = true;  // Es una nueva designación
            // Establecer la fecha de inicio al día de hoy
            this.fechaInicioDate = this.calendar.getToday();

            // Verificar el estado inicial del formulario
            setTimeout(() => this.verificarFormularioValido(), 0);
        } else {
            this.designacionService.get(parseInt(id!)).subscribe({
                next: (dataPackage) => {
                    this.designacion = <Designacion>dataPackage.data;
                    this.tituloFormulario = 'Editar Designación';
                    this.isNewDesignacion = false;  // Es una designación existente

                    // Establecer los campos para los typeahead
                    if (this.designacion.persona) {
                        this.personaSeleccionada = this.designacion.persona;
                    }

                    if (this.designacion.cargo) {
                        this.cargoSeleccionado = this.designacion.cargo;
                    }

                    // Convertir fechas de la designación a objetos NgbDateStruct
                    if (this.designacion.fechaInicio) {
                        const fechaInicio = new Date(this.designacion.fechaInicio);
                        this.fechaInicioDate = {
                            year: fechaInicio.getFullYear(),
                            month: fechaInicio.getMonth() + 1,
                            day: fechaInicio.getDate()
                        };
                    }

                    if (this.designacion.fechaFin) {
                        const fechaFin = new Date(this.designacion.fechaFin);
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

    // Métodos para la búsqueda de personas
    searchPersona = (text$: Observable<string>): Observable<Persona[]> =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            filter(term => term.length >= 2),
            switchMap(term =>
                this.personaService.search(term).pipe(
                    map(dataPackage => <Persona[]>dataPackage.data),
                    catchError(() => of([]))
                )
            )
        );

    // Formateador de resultados en el dropdown para personas
    resultPersonaFormat = (persona: Persona): string =>
        `${persona.dni} - ${persona.nombre}, ${persona.apellido}`;

    // Formateador para el input cuando se selecciona una persona
    inputPersonaFormat = (persona: Persona | string): string => {
        if (typeof persona === 'string') {
            return persona;
        }
        return persona && persona.nombre ? `${persona.nombre} ${persona.apellido}` : '';
    }

    // Método para seleccionar una persona
    seleccionarPersona(persona: Persona): void {
        if (persona) {
            this.designacion.persona = persona;
            this.personaSeleccionada = persona;
            this.verificarFormularioValido();
        }
    }

    // Método para manejar cambios en el input de persona
    onPersonaInputChange(value: any): void {
        // Si el campo está vacío, limpiar la persona asignada
        if (value === '') {
            this.designacion.persona = <Persona>{};
        }
        this.verificarFormularioValido();
    }

    // Métodos para la búsqueda de cargos
    searchCargo = (text$: Observable<string>): Observable<Cargo[]> =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            filter(term => term.length >= 2),
            switchMap(term =>
                this.cargoService.search(term).pipe(
                    map(dataPackage => <Cargo[]>dataPackage.data),
                    catchError(() => of([]))
                )
            )
        );

    // Formateador de resultados en el dropdown para cargos
    resultCargoFormat = (cargo: Cargo): string => {
        let result = `${cargo.nombre} - ${cargo.tipoDesignacion}`;
        if (cargo.division) {
            result += ` (${cargo.division.anio}° ${cargo.division.numDivision} ${cargo.division.turno})`;
        }
        return result;
    };

    // Formateador para el input cuando se selecciona un cargo
    inputCargoFormat = (cargo: Cargo | string): string => {
        if (typeof cargo === 'string') {
            return cargo;
        }
        return cargo && cargo.nombre ? cargo.nombre : '';
    }

    // Método para seleccionar un cargo
    seleccionarCargo(cargo: Cargo): void {
        if (cargo) {
            this.designacion.cargo = cargo;
            this.cargoSeleccionado = cargo;
            this.verificarFormularioValido();
        }
    }

    // Método para manejar cambios en el input de cargo
    onCargoInputChange(value: any): void {
        // Si el campo está vacío, limpiar el cargo asignado
        if (value === '') {
            this.designacion.cargo = <Cargo>{};
        }
        this.verificarFormularioValido();
    }

    // Método para detectar cambios en los datepickers
    onDateChange(): void {
        this.verificarFormularioValido();
    }

    // Método para formatear la información de división
    formatDivision(division: Division | undefined): string {
        if (!division) return '';
        return `${division.anio}° ${division.numDivision} - ${division.orientacion} - ${division.turno}`;
    }

    ngOnInit(): void {
        this.get();
    }
}