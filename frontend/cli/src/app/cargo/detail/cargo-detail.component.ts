import { CommonModule, Location } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct, NgbTimeStruct, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { DivisionService } from '../../division/service/division.service';
import { ModalService } from '../../modal/modal.service';
import { Cargo } from '../../models/cargo';
import { Division } from '../../models/division';
import { DiaSemana, DiaSemanaLabels, Horario } from '../../models/horario';
import { TipoDesignacion } from '../../models/tipo-designacion';
import { Turno } from '../../models/turno';
import { HoraFormatPipe } from '../../pipes/hora-format.pipe';
import { TipoDesignacionPipe } from '../../pipes/tipo-designacion.pipe';
import { CargoService } from '../service/cargo.service';


@Component({
    selector: 'app-cargo-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, NgbDatepickerModule, NgbTimepickerModule, NgbTypeaheadModule, TipoDesignacionPipe, HoraFormatPipe],
    templateUrl: './cargo-detail.component.html',
    styleUrl: './cargo-detail.component.css'
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

    // Propiedades para la gestión de horarios
    diasSemana = Object.values(DiaSemana);
    diasSemanaLabels = DiaSemanaLabels;
    nuevoHorario: Horario = {
        dia: DiaSemana.LUNES,
        hora: '01:00:00'
    };
    timeStruct: NgbTimeStruct = { hour: 1, minute: 0, second: 0 };
    mostrarFormNuevoHorario: boolean = false;
    errorHorarioDuplicado: boolean = false;
    errorHorarioInvalido: boolean = false;

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

    // Método para manejar cambios en el timepicker
    onTimeChange(): void {
        // No aplicamos restricciones, permitimos cualquier valor
        this.errorHorarioInvalido = false;
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
            // Inicializar el cargo con valores por defecto para todas las propiedades requeridas
            this.cargo = {
                id: 0,
                nombre: '',
                cargaHoraria: 0,
                fechaInicio: new Date(),
                tipoDesignacion: this.tipoRestringido ? TipoDesignacion.CARGO : TipoDesignacion.ESPACIO_CURRICULAR,
                horarios: []
            } as Cargo;

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

                    // Asegurar que el cargo tenga un array de horarios
                    if (!this.cargo.horarios) {
                        this.cargo.horarios = [];
                    }

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

    // Métodos para la gestión de horarios
    mostrarFormularioHorario(): void {
        this.mostrarFormNuevoHorario = true;
        this.nuevoHorario = {
            dia: DiaSemana.LUNES,
            hora: '01:00:00'
        };
        this.timeStruct = { hour: 1, minute: 0, second: 0 };
        this.errorHorarioDuplicado = false;
        this.errorHorarioInvalido = false;
    }

    cancelarNuevoHorario(): void {
        this.mostrarFormNuevoHorario = false;
        this.errorHorarioDuplicado = false;
        this.errorHorarioInvalido = false;
    }

    agregarHorario(): void {
        // Formatear la hora y los minutos desde el timeStruct a formato LocalTime (HH:MM:SS)
        const horaStr = this.timeStruct.hour.toString().padStart(2, '0');
        const minutos = this.timeStruct.minute.toString().padStart(2, '0');
        this.nuevoHorario.hora = `${horaStr}:${minutos}:00`;

        // Verificar si ya existe un horario con el mismo día y hora exacta
        const horarioDuplicado = this.cargo.horarios.some(
            h => h.dia === this.nuevoHorario.dia &&
                h.hora === this.nuevoHorario.hora
        );

        if (horarioDuplicado) {
            this.errorHorarioDuplicado = true;
            this.errorHorarioInvalido = false;
            return;
        }

        this.errorHorarioInvalido = false;

        // Agregar el nuevo horario a la lista
        this.cargo.horarios.push({ ...this.nuevoHorario });

        // Ordenar los horarios
        this.cargo.horarios = this.cargoService.orderHorarios(this.cargo.horarios);

        // Cerrar el formulario y resetear
        this.mostrarFormNuevoHorario = false;
        this.nuevoHorario = { dia: DiaSemana.LUNES, hora: '01:00:00' };
        this.timeStruct = { hour: 1, minute: 0, second: 0 };
        this.errorHorarioDuplicado = false;
        this.errorHorarioInvalido = false;

        // Actualizar validación del formulario
        this.verificarFormularioValido();
    }

    eliminarHorario(index: number): void {
        this.modalService.confirm(
            "Eliminar horario",
            "¿Estás seguro de que deseas eliminar este horario?",
            "Esta acción no se puede deshacer"
        ).then(() => {
            this.cargo.horarios.splice(index, 1);
            this.verificarFormularioValido();
        }).catch(() => {
            // Usuario canceló la eliminación, no hacemos nada
        });
    }

    // Método para obtener el nombre traducido de un día
    getDiaSemanaLabel(dia: DiaSemana): string {
        return this.diasSemanaLabels[dia] || dia;
    }

    // Método para formatear la hora en formato legible
    formatHoraTiempo(horaTiempo: string): string {
        if (!horaTiempo) return '';

        // Asumimos que horaTiempo viene en formato 'HH:MM:SS'
        const partes = horaTiempo.split(':');
        if (partes.length < 2) return horaTiempo;

        return `${partes[0]}:${partes[1]}`;
    }

    // Método para verificar si un día y hora exacta ya están asignados
    existeHorario(dia: DiaSemana, hora: string): boolean {
        return this.cargo.horarios.some(h =>
            h.dia === dia &&
            h.hora === hora
        );
    }

    ngOnInit(): void {
        this.get();
    }
}