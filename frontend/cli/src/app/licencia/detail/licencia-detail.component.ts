import { CommonModule, Location } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

import { ModalService } from '../../modal/modal.service';
import { ArticuloLicencia } from '../../models/articulo-licencia';
import { Licencia } from '../../models/licencia';
import { Persona } from '../../models/persona';
import { PersonaService } from '../../persona/service/persona.service';
import { DniFormatPipe } from '../../pipes/dni-format.pipe';
import { ArticuloLicenciaService } from '../service/articulo-licencia.service';
import { LicenciaService } from '../service/licencia.service';

@Component({
    selector: 'app-licencia-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, NgbDatepickerModule, NgbTypeaheadModule, DniFormatPipe],
    templateUrl: './licencia-detail.component.html',
    styles: `
    .input-group-text {
      width: 100px;
    }
    .calendar {
      cursor: pointer;
    }
  `
})
export class LicenciaDetailComponent implements OnInit, AfterViewChecked {
    @ViewChild('form') form!: NgForm;

    licencia!: Licencia;
    isNewLicencia: boolean = true;

    // Para los typeahead
    personaSeleccionada: any = '';
    articuloSeleccionado: any = '';

    // Propiedades para los datepickers
    fechaDesdeDate: NgbDateStruct | null = null;
    fechaHastaDate: NgbDateStruct | null = null;

    tituloFormulario: string = 'Nueva Licencia';

    // Propiedad para determinar si el formulario es válido
    formularioValido: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private licenciaService: LicenciaService,
        private personaService: PersonaService,
        private articuloLicenciaService: ArticuloLicenciaService,
        private location: Location,
        private modalService: ModalService,
        public calendar: NgbCalendar,
        private cdr: ChangeDetectorRef
    ) {
        // Inicializar la licencia con valores por defecto
        this.licencia = <Licencia>{};
        // Inicializar objetos vacíos para evitar problemas de null en el HTML
        this.licencia.persona = <Persona>{};
        this.licencia.articuloLicencia = <ArticuloLicencia>{};
        this.licencia.certificadoMedico = false;
        this.licencia.designaciones = [];
    }

    goBack(): void {
        this.location.back();
    }

    // Método para verificar si el formulario es válido
    verificarFormularioValido(): void {
        // Primero verificar que la licencia y sus propiedades existan
        if (!this.licencia) {
            this.formularioValido = false;
            return;
        }

        // Verificar que la persona y el artículo tengan un ID (lo que indica que son objetos reales)
        // y que la fecha de inicio sea válida
        this.formularioValido = !!this.licencia.persona?.id &&
            !!this.licencia.articuloLicencia?.id &&
            !!this.fechaDesdeDate;

        // Verificar si la fecha de inicio es válida a través del formulario
        if (this.form && this.form.controls['fechaDesde']) {
            if (this.form.controls['fechaDesde'].invalid) {
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
        if (this.fechaDesdeDate) {
            const fechaDesde = new Date(
                this.fechaDesdeDate.year,
                this.fechaDesdeDate.month - 1,
                this.fechaDesdeDate.day
            );
            this.licencia.pedidoDesde = fechaDesde;
        }

        if (this.fechaHastaDate) {
            const fechaHasta = new Date(
                this.fechaHastaDate.year,
                this.fechaHastaDate.month - 1,
                this.fechaHastaDate.day
            );
            this.licencia.pedidoHasta = fechaHasta;
        } else {
            // Si no se especifica fecha de finalización, se usa la misma que la de inicio
            this.licencia.pedidoHasta = this.licencia.pedidoDesde;
        }

        this.licenciaService.save(this.licencia, this.isNewLicencia).subscribe({
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
                        "Licencia guardada correctamente",
                        ""
                    ).then(() => this.goBack());
                }
            },
            error: (error) => {
                console.error('Error al guardar la licencia', error);
                this.modalService.error(
                    "Error al guardar",
                    "Error al guardar la licencia",
                    ""
                );
            }
        });
    }

    get(): void {
        const id = this.route.snapshot.paramMap.get("id")!;
        if (id === "new") {
            this.isNewLicencia = true;
            this.tituloFormulario = 'Nueva Licencia';
        } else {
            this.isNewLicencia = false;
            this.tituloFormulario = 'Editar Licencia';
            this.licenciaService.get(+id).subscribe({
                next: (dataPackage) => {
                    this.licencia = <Licencia>dataPackage.data;

                    // Configurar los datepickers con las fechas recibidas
                    if (this.licencia.pedidoDesde) {
                        const fechaDesde = new Date(this.licencia.pedidoDesde);
                        this.fechaDesdeDate = {
                            year: fechaDesde.getFullYear(),
                            month: fechaDesde.getMonth() + 1,
                            day: fechaDesde.getDate()
                        };
                    }

                    if (this.licencia.pedidoHasta) {
                        const fechaHasta = new Date(this.licencia.pedidoHasta);
                        this.fechaHastaDate = {
                            year: fechaHasta.getFullYear(),
                            month: fechaHasta.getMonth() + 1,
                            day: fechaHasta.getDate()
                        };
                    }

                    // Establecer los valores seleccionados para los typeahead
                    if (this.licencia.persona) {
                        this.personaSeleccionada = `${this.licencia.persona.nombre} ${this.licencia.persona.apellido}`;
                    }

                    if (this.licencia.articuloLicencia) {
                        this.articuloSeleccionado = this.licencia.articuloLicencia.articulo;
                    }
                },
                error: (error) => {
                    console.error('Error al cargar la licencia', error);
                    this.modalService.error(
                        "Error al cargar",
                        "Error al cargar la licencia",
                        ""
                    );
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
            this.licencia.persona = persona;
            this.verificarFormularioValido();
        }
    }

    // Método para manejar cambios en el input de persona
    onPersonaInputChange(value: any): void {
        // Si el campo está vacío, limpiar la persona asignada
        if (value === '') {
            this.licencia.persona = <Persona>{};
        }
        this.verificarFormularioValido();
    }

    // Métodos para la búsqueda de artículos de licencia
    searchArticuloLicencia = (text$: Observable<string>): Observable<ArticuloLicencia[]> =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            filter(term => term.length >= 2),
            switchMap(term =>
                this.articuloLicenciaService.search(term).pipe(
                    map(dataPackage => <ArticuloLicencia[]>dataPackage.data),
                    catchError(() => of([]))
                )
            )
        );

    // Formateador de resultados en el dropdown para artículos
    resultArticuloFormat = (articulo: ArticuloLicencia): string =>
        `${articulo.articulo} - ${articulo.descripcion}`;

    // Formateador para el input cuando se selecciona un artículo
    inputArticuloFormat = (articulo: ArticuloLicencia | string): string => {
        if (typeof articulo === 'string') {
            return articulo;
        }
        return articulo && articulo.articulo ? articulo.articulo : '';
    }

    // Método para seleccionar un artículo de licencia
    seleccionarArticulo(articulo: ArticuloLicencia): void {
        if (articulo) {
            this.licencia.articuloLicencia = articulo;
            this.verificarFormularioValido();
        }
    }

    // Método para manejar cambios en el input de artículo
    onArticuloInputChange(value: any): void {
        // Si el campo está vacío, limpiar el artículo asignado
        if (value === '') {
            this.licencia.articuloLicencia = <ArticuloLicencia>{};
        }
        this.verificarFormularioValido();
    }

    // Método para detectar cambios en los datepickers
    onDateChange(): void {
        this.verificarFormularioValido();
    }

    // Método para gestionar el cambio del checkbox de certificado médico
    onCertificadoMedicoChange(): void {
        this.verificarFormularioValido();
    }

    ngOnInit(): void {
        this.get();
    }
}