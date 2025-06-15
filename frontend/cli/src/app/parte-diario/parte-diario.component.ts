import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DesignacionService } from '../designacion/service/designacion.service';
import { LicenciaService } from '../licencia/service/licencia.service';
import { DataPackage } from '../models/data-package';
import { Designacion } from '../models/designacion';
import { DocenteLicencia, ParteDiario } from '../models/parte-diario';
import { DniFormatPipe } from '../pipes/dni-format.pipe';
import { FechaFormatPipe } from '../pipes/fecha-format.pipe';
import { PopupService } from '../popup/popup.service';
import { ArgentinaDateParserFormatter } from '../utils/argentina-date-formatter';
import { DateUtils } from '../utils/date-utils';
import { ParteDiarioAnimationService } from './parte-diario-animation.service';

@Component({
    selector: 'app-parte-diario',
    standalone: true,
    imports: [CommonModule, FormsModule, NgbDatepickerModule, DniFormatPipe, FechaFormatPipe],
    providers: [
        { provide: NgbDateParserFormatter, useClass: ArgentinaDateParserFormatter }
    ],
    templateUrl: './parte-diario.component.html',
    styleUrl: './parte-diario.component.css'
})
export class ParteDiarioComponent implements OnInit, AfterViewInit, OnDestroy {
    // Fecha seleccionada para el parte diario
    fechaSeleccionada: NgbDateStruct = this.getFechaActual();

    // Modelo de parte diario
    parteDiario: ParteDiario = {
        fecha: new Date(),
        docentes: []
    };

    // Para el popup de reemplazos
    selectedDocente: DocenteLicencia | null = null;

    // Estado de carga
    isLoading: boolean = false;

    @ViewChild('reemplazosTemplate', { static: true }) reemplazosTemplate!: TemplateRef<any>;

    constructor(
        private licenciaService: LicenciaService,
        private route: ActivatedRoute,
        private router: Router,
        private popupService: PopupService,
        private designacionService: DesignacionService,
        private elementRef: ElementRef,
        private parteDiarioAnimationService: ParteDiarioAnimationService
    ) { }

    ngOnInit(): void {
        // Verificar si hay fecha en la ruta
        this.route.params.subscribe(params => {
            if (params['fecha']) {
                const fechaStr = params['fecha'];
                const [year, month, day] = fechaStr.split('-').map(Number);
                if (year && month && day) {
                    this.fechaSeleccionada = { year, month, day };
                    this.cargarParteDiario();
                }
            }
        });
    }

    ngAfterViewInit(): void {
        // Configurar animaciones iniciales
        this.parteDiarioAnimationService.animateInitialEntrance(this.elementRef);

        // Configurar efectos de hover
        this.parteDiarioAnimationService.setupHoverEffects(this.elementRef);

        // NO iniciamos pulsación automática - usamos solo el efecto CSS de hover
    }

    ngOnDestroy(): void {
        // Limpiar animaciones al destruir el componente
        this.parteDiarioAnimationService.clearAnimations();
    }

    /**
     * Obtiene la fecha actual como NgbDateStruct
     */
    getFechaActual(): NgbDateStruct {
        const fechaActual = new Date();
        return {
            year: fechaActual.getFullYear(),
            month: fechaActual.getMonth() + 1,
            day: fechaActual.getDate()
        };
    }

    /**
     * Formatea la fecha en formato yyyy-MM-dd (para APIs y URLs)
     */
    formatearFecha(fecha: NgbDateStruct): string {
        return `${fecha.year}-${String(fecha.month).padStart(2, '0')}-${String(fecha.day).padStart(2, '0')}`;
    }

    /**
     * Carga el parte diario para la fecha seleccionada
     */
    cargarParteDiario(): void {
        const fechaFormateada = this.formatearFecha(this.fechaSeleccionada);
        this.isLoading = true;

        // Animar estado de carga
        this.parteDiarioAnimationService.animateLoadingBreath(this.elementRef);

        this.licenciaService.getParteDiario(fechaFormateada)
            .subscribe({
                next: (response: DataPackage) => {
                    this.isLoading = false;
                    this.parteDiarioAnimationService.stopLoadingAnimation(this.elementRef);

                    if (response.data) {
                        // Necesitamos hacer un cast para acceder a la estructura ParteDiario
                        const responseData = response.data as any;

                        if (responseData.ParteDiario) {
                            // Mapeamos los datos correctamente desde la estructura de la API
                            this.parteDiario = {
                                fecha: DateUtils.parseLocalDate(responseData.ParteDiario.Fecha),
                                docentes: responseData.ParteDiario.Docentes.map((docente: any) => ({
                                    dni: docente.DNI,
                                    nombre: docente.Nombre,
                                    apellido: docente.Apellido,
                                    articulo: docente.Artículo,
                                    descripcion: docente.Descripción,
                                    desde: DateUtils.parseLocalDate(docente.Desde),
                                    hasta: DateUtils.parseLocalDate(docente.Hasta),
                                    reemplazos: docente.Reemplazos || []
                                }))
                            };

                            // Animar la carga de datos
                            setTimeout(() => {
                                this.parteDiarioAnimationService.animateDataLoad(this.elementRef, () => {
                                    // Configurar efectos de hover después de cargar los datos
                                    this.parteDiarioAnimationService.setupHoverEffects(this.elementRef);

                                    // Animar contadores
                                    this.parteDiarioAnimationService.animateCounters(this.elementRef);

                                    // NO iniciamos pulsación - el efecto CSS se aplica automáticamente en hover
                                });
                            }, 100);
                        } else {
                            // Animar estado vacío
                            this.parteDiarioAnimationService.animateEmptyState(this.elementRef);
                        }
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.parteDiarioAnimationService.stopLoadingAnimation(this.elementRef);
                    this.parteDiarioAnimationService.animateError(this.elementRef);
                }
            });
    }

    /**
     * Actualiza la URL cuando cambia la fecha
     */
    actualizarURL(): void {
        const fechaFormateada = this.formatearFecha(this.fechaSeleccionada);
        this.router.navigate(['/licencias/parte-diario', fechaFormateada]);
    }

    /**
     * Convierte NgbDateStruct a un objeto Date de JavaScript
     */
    convertirADate(fecha: NgbDateStruct): Date {
        return new Date(fecha.year, fecha.month - 1, fecha.day);
    }

    /**
     * Reinicia la búsqueda con la fecha actual y recarga los datos
     */
    reset(): void {
        this.fechaSeleccionada = this.getFechaActual();
        // Usar la versión con animación para el botón reset
        this.onFechaChangeWithAnimation();
    }

    /**
     * Método que se ejecuta cuando cambia la fecha en el datepicker
     * Versión simple sin animaciones para que el datepicker funcione correctamente
     */
    onFechaChange(): void {
        this.cargarParteDiario();
        this.actualizarURL();
    }

    /**
     * Método específico para cambios de fecha con animación (para botones externos)
     */
    onFechaChangeWithAnimation(): void {
        // Animar transición de cambio de fecha
        this.parteDiarioAnimationService.animateDateTransition(this.elementRef, () => {
            this.cargarParteDiario();
            this.actualizarURL();
        });
    }

    /**
     * Abre el popup para mostrar los suplentes de un docente
     */
    openReemplazosPopup(docente: DocenteLicencia, event?: Event): void {
        // Animar el botón clickeado
        const buttonElement = (event?.target as HTMLElement)?.closest('.btn-popup') as HTMLElement;
        if (buttonElement) {
            this.parteDiarioAnimationService.animatePopupButtonClick(buttonElement);
        }

        this.selectedDocente = docente;
        this.popupService.show(this.reemplazosTemplate, {
            title: `Suplentes de ${docente.nombre} ${docente.apellido}`,
            icon: 'fa-user-tie',
            data: docente
        });

        // Animar entrada del popup después de un pequeño delay
        setTimeout(() => {
            const popupContainer = document.querySelector('.popup-container');
            if (popupContainer) {
                const elementRef = { nativeElement: popupContainer };
                this.parteDiarioAnimationService.animatePopupEntrance(elementRef as ElementRef);
            }
        }, 50);
    }

    /**
     * Obtiene la cantidad de suplentes para un docente
     */
    getReemplazoCount(docente: DocenteLicencia): number {
        return docente.reemplazos ? docente.reemplazos.length : 0;
    }

    /**
     * Verifica si una designación está activa
     */
    isDesignacionActive(designacion: Designacion): boolean {
        return this.designacionService.isActive(designacion);
    }
}
