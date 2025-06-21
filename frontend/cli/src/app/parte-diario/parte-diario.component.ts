/**
 * @fileoverview Componente para la gestión y visualización de partes diarios de novedades docentes.
 * Permite consultar y generar informes diarios de las licencias activas del personal docente.
 * 
 * @description Este componente maneja la funcionalidad central del sistema para visualizar
 * las novedades diarias del personal docente, incluyendo licencias activas, reemplazos
 * y suplencias. Proporciona una interfaz intuitiva con selección de fechas y visualización
 * detallada de la información de cada docente con licencia en la fecha seleccionada.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */

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

/**
 * Componente principal para la gestión de partes diarios de novedades docentes.
 * 
 * Este componente centraliza la funcionalidad para consultar, visualizar y generar
 * partes diarios que muestran las licencias activas del personal docente en una fecha
 * específica. Incluye funcionalidades avanzadas como selección de fechas, visualización
 * de reemplazos y suplencias, y animaciones interactivas para mejorar la experiencia del usuario.
 * 
 * Características principales:
 * - Selección de fecha mediante datepicker
 * - Visualización de docentes con licencias activas
 * - Detalle de reemplazos y suplencias por docente
 * - Navegación por URL con parámetros de fecha
 * - Animaciones y efectos visuales
 * - Integración con servicios de popup para información detallada
 * 
 * @class ParteDiarioComponent
 * @implements {OnInit, AfterViewInit, OnDestroy}
 */
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
    /**
     * Fecha seleccionada para consultar el parte diario.
     * Se inicializa con la fecha actual del sistema.
     * @type {NgbDateStruct}
     */
    fechaSeleccionada: NgbDateStruct = this.getFechaActual();

    /**
     * Modelo de datos del parte diario que contiene la información
     * de todos los docentes con licencias activas en la fecha seleccionada.
     * @type {ParteDiario}
     */
    parteDiario: ParteDiario = {
        fecha: new Date(),
        docentes: []
    };

    /**
     * Docente seleccionado para mostrar información detallada de reemplazos en popup.
     * @type {DocenteLicencia | null}
     */
    selectedDocente: DocenteLicencia | null = null;

    /**
     * Indicador del estado de carga de datos.
     * Se utiliza para mostrar spinners y deshabilitar controles durante las consultas.
     * @type {boolean}
     */
    isLoading: boolean = false;

    /**
     * Referencia al template del popup de reemplazos.
     * Se utiliza para mostrar información detallada de los suplentes de cada docente.
     * @type {TemplateRef<any>}
     */
    @ViewChild('reemplazosTemplate', { static: true }) reemplazosTemplate!: TemplateRef<any>;

    /**
     * Constructor del componente de parte diario.
     * 
     * Inicializa las dependencias necesarias para el funcionamiento del componente,
     * incluyendo servicios de licencias, navegación, popup y animaciones.
     * 
     * @constructor
     * @param {LicenciaService} licenciaService - Servicio para consultas de licencias
     * @param {ActivatedRoute} route - Servicio para acceder a parámetros de ruta
     * @param {Router} router - Servicio de navegación
     * @param {PopupService} popupService - Servicio para mostrar popups informativos
     * @param {DesignacionService} designacionService - Servicio para gestión de designaciones
     * @param {ElementRef} elementRef - Referencia al elemento DOM del componente
     * @param {ParteDiarioAnimationService} parteDiarioAnimationService - Servicio de animaciones específicas
     */
    constructor(
        private licenciaService: LicenciaService,
        private route: ActivatedRoute,
        private router: Router,
        private popupService: PopupService,
        private designacionService: DesignacionService,
        private elementRef: ElementRef,
        private parteDiarioAnimationService: ParteDiarioAnimationService
    ) { }

    /**
     * Método del ciclo de vida de Angular que se ejecuta después de la inicialización del componente.
     * 
     * Configura la suscripción a parámetros de ruta para permitir navegación directa
     * a un parte diario específico mediante URL con parámetros de fecha.
     * 
     * @method ngOnInit
     * @returns {void}
     */
    ngOnInit(): void {
        // Verificar si hay fecha en la ruta y cargar el parte diario correspondiente
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

    /**
     * Método del ciclo de vida de Angular que se ejecuta después de la inicialización de la vista.
     * 
     * Configura las animaciones iniciales del componente y establece los efectos
     * visuales interactivos para mejorar la experiencia del usuario.
     * 
     * @method ngAfterViewInit
     * @returns {void}
     */
    ngAfterViewInit(): void {
        // Configurar animaciones iniciales de entrada
        this.parteDiarioAnimationService.animateInitialEntrance(this.elementRef);

        // Configurar efectos de hover interactivos
        this.parteDiarioAnimationService.setupHoverEffects(this.elementRef);
    }

    /**
     * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
     * 
     * Realiza la limpieza de animaciones y recursos para evitar memory leaks
     * y comportamientos inesperados.
     * 
     * @method ngOnDestroy
     * @returns {void}
     */
    ngOnDestroy(): void {
        // Limpiar animaciones al destruir el componente
        this.parteDiarioAnimationService.clearAnimations();
    }

    /**
     * Obtiene la fecha actual del sistema como estructura NgbDateStruct.
     * 
     * Convierte la fecha actual de JavaScript a la estructura requerida
     * por los componentes de NgBootstrap para el datepicker.
     * 
     * @method getFechaActual
     * @returns {NgbDateStruct} Fecha actual en formato NgbDateStruct
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
     * Formatea una fecha NgbDateStruct al formato yyyy-MM-dd.
     * 
     * Convierte la fecha del datepicker al formato estándar ISO
     * requerido por las APIs y para los parámetros de URL.
     * 
     * @method formatearFecha
     * @param {NgbDateStruct} fecha - Fecha a formatear
     * @returns {string} Fecha en formato yyyy-MM-dd
     */
    formatearFecha(fecha: NgbDateStruct): string {
        return `${fecha.year}-${String(fecha.month).padStart(2, '0')}-${String(fecha.day).padStart(2, '0')}`;
    }

    /**
     * Carga el parte diario para la fecha seleccionada.
     * 
     * Realiza una consulta al backend para obtener todas las licencias activas
     * en la fecha especificada, incluyendo información de reemplazos y suplencias.
     * Maneja el estado de carga y las animaciones correspondientes.
     * 
     * @method cargarParteDiario
     * @returns {void}
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
     * Actualiza la URL con la fecha seleccionada.
     * 
     * Modifica la ruta actual para incluir la fecha seleccionada como parámetro,
     * permitiendo navegación directa y marcadores a partes diarios específicos.
     * 
     * @method actualizarURL
     * @returns {void}
     */
    actualizarURL(): void {
        const fechaFormateada = this.formatearFecha(this.fechaSeleccionada);
        this.router.navigate(['/licencias/parte-diario', fechaFormateada]);
    }

    /**
     * Convierte una estructura NgbDateStruct a un objeto Date de JavaScript.
     * 
     * Realiza la conversión entre el formato de fecha del datepicker de NgBootstrap
     * y el objeto Date nativo de JavaScript.
     * 
     * @method convertirADate
     * @param {NgbDateStruct} fecha - Fecha en formato NgbDateStruct
     * @returns {Date} Fecha convertida a objeto Date de JavaScript
     */
    convertirADate(fecha: NgbDateStruct): Date {
        return new Date(fecha.year, fecha.month - 1, fecha.day);
    }

    /**
     * Reinicia la búsqueda con la fecha actual y recarga los datos.
     * 
     * Restablece el componente al estado inicial con la fecha actual del sistema
     * y ejecuta una nueva consulta con efectos de animación.
     * 
     * @method reset
     * @returns {void}
     */
    reset(): void {
        this.fechaSeleccionada = this.getFechaActual();
        // Usar la versión con animación para el botón reset
        this.onFechaChangeWithAnimation();
    }

    /**
     * Método que se ejecuta cuando cambia la fecha en el datepicker.
     * 
     * Versión simple sin animaciones para que el datepicker funcione correctamente
     * sin interferir con las animaciones automáticas del componente.
     * 
     * @method onFechaChange
     * @returns {void}
     */
    onFechaChange(): void {
        this.cargarParteDiario();
        this.actualizarURL();
    }

    /**
     * Método específico para cambios de fecha con animación.
     * 
     * Utilizado principalmente para botones externos que requieren efectos visuales
     * de transición al cambiar la fecha del parte diario.
     * 
     * @method onFechaChangeWithAnimation
     * @returns {void}
     */
    onFechaChangeWithAnimation(): void {
        // Animar transición de cambio de fecha
        this.parteDiarioAnimationService.animateDateTransition(this.elementRef, () => {
            this.cargarParteDiario();
            this.actualizarURL();
        });
    }

    /**
     * Abre el popup para mostrar los suplentes de un docente específico.
     * 
     * Muestra información detallada de los reemplazos y suplencias asignados
     * a un docente en particular, con efectos de animación para mejorar la experiencia del usuario.
     * 
     * @method openReemplazosPopup
     * @param {DocenteLicencia} docente - Docente del cual mostrar los reemplazos
     * @param {Event} [event] - Evento opcional del click para animaciones
     * @returns {void}
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
     * Obtiene la cantidad de suplentes asignados a un docente.
     * 
     * Calcula el número total de reemplazos disponibles para un docente específico,
     * útil para mostrar contadores y estadísticas en la interfaz.
     * 
     * @method getReemplazoCount
     * @param {DocenteLicencia} docente - Docente del cual contar los reemplazos
     * @returns {number} Número de reemplazos asignados al docente
     */
    getReemplazoCount(docente: DocenteLicencia): number {
        return docente.reemplazos ? docente.reemplazos.length : 0;
    }

    /**
     * Verifica si una designación específica está activa.
     * 
     * Utiliza el servicio de designaciones para determinar el estado actual
     * de una designación, considerando fechas de vigencia y otros criterios.
     * 
     * @method isDesignacionActive
     * @param {Designacion} designacion - Designación a verificar
     * @returns {boolean} true si la designación está activa, false en caso contrario
     */
    isDesignacionActive(designacion: Designacion): boolean {
        return this.designacionService.isActive(designacion);
    }
}
