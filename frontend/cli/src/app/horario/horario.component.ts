/**
 * @fileoverview Componente para la gestión y visualización de horarios académicos.
 * Permite consultar los horarios de espacios curriculares por fecha, turno y año.
 * 
 * @description Este componente maneja la funcionalidad central para visualizar
 * los horarios académicos de la institución. Proporciona filtros por turno, fecha
 * y año académico, mostrando una grilla interactiva con los espacios curriculares
 * distribuidos por días de la semana y horas académicas.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { CargoService } from '../cargo/service/cargo.service';
import { DiaSemana } from '../models/horario';
import { HoraEspacioCurricular, HorarioDTO } from '../models/horario-dto';
import { Turno } from '../models/turno';
import { ArgentinaDateParserFormatter } from '../utils/argentina-date-formatter';
import { HorarioAnimationService } from './horario-animation.service';

/**
 * Componente principal para la gestión de horarios académicos.
 * 
 * Este componente proporciona una interfaz completa para consultar y visualizar
 * los horarios de espacios curriculares. Incluye filtros por turno (mañana, tarde, noche),
 * fecha específica y año académico. Presenta los datos en una grilla organizada
 * por días de la semana y horas académicas, facilitando la planificación educativa.
 * 
 * Características principales:
 * - Filtrado por turno académico (mañana, tarde, noche)
 * - Selección de fecha específica mediante datepicker
 * - Filtro por año académico
 * - Visualización en grilla de días x horas
 * - Integración con servicios de animación
 * - Navegación por URL con parámetros
 * - Carga asíncrona de datos
 * 
 * @class HorarioComponent
 * @implements {OnInit, AfterViewInit}
 */
@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDatepickerModule],
  providers: [
    { provide: NgbDateParserFormatter, useClass: ArgentinaDateParserFormatter }
  ],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css'
})
export class HorarioComponent implements OnInit, AfterViewInit {

  /**
   * Datos del horario académico obtenidos del backend.
   * Contiene la información completa de espacios curriculares organizados por día y hora.
   * @type {HorarioDTO | null}
   */
  horarioData: HorarioDTO | null = null;

  /**
   * Mensaje de error en caso de fallo en la carga de datos.
   * @type {string | null}
   */
  error: string | null = null;

  /**
   * Indicador del estado de carga de datos.
   * Se utiliza para mostrar spinners y deshabilitar controles durante las consultas.
   * @type {boolean}
   */
  isLoading: boolean = false;

  /**
   * Turno académico seleccionado para el filtro.
   * Por defecto se establece en 'MANIANA' (mañana).
   * @type {string}
   */
  turnoSeleccionado: string = 'MANIANA';

  /**
   * Fecha seleccionada para consultar el horario.
   * Se inicializa con la fecha actual del sistema.
   * @type {NgbDateStruct}
   */
  fechaSeleccionada: NgbDateStruct = this.getFechaActual();

  /**
   * Año académico seleccionado para el filtro.
   * null significa "todos los años", cualquier número es un año específico.
   * @type {number | null}
   */
  anioSeleccionado: number | null = null;

  /**
   * Lista de turnos académicos disponibles para el filtro.
   * @readonly
   * @type {Turno[]}
   */
  turnos = Object.values(Turno);

  /**
   * Lista de años académicos disponibles obtenidos dinámicamente.
   * @type {number[]}
   */
  aniosDisponibles: number[] = [];

  /**
   * Días de la semana laborables para la grilla de horarios.
   * @readonly
   * @type {DiaSemana[]}
   */
  dias = [DiaSemana.LUNES, DiaSemana.MARTES, DiaSemana.MIERCOLES, DiaSemana.JUEVES, DiaSemana.VIERNES];

  /**
   * Horas académicas disponibles (1 a 8).
   * @readonly
   * @type {number[]}
   */
  horas = Array.from({ length: 8 }, (_, i) => i + 1);

  /**
   * Constructor del componente de horarios.
   * 
   * Inicializa las dependencias necesarias para el funcionamiento del componente,
   * incluyendo servicios de datos, navegación y animaciones.
   * 
   * @constructor
   * @param {CargoService} cargoService - Servicio para consultas de cargos y horarios
   * @param {ActivatedRoute} route - Servicio para acceder a parámetros de ruta
   * @param {Router} router - Servicio de navegación
   * @param {ElementRef} elementRef - Referencia al elemento DOM del componente
   * @param {HorarioAnimationService} horarioAnimationService - Servicio de animaciones específicas
   */
  constructor(
    private cargoService: CargoService,
    private route: ActivatedRoute,
    private router: Router,
    private elementRef: ElementRef,
    private horarioAnimationService: HorarioAnimationService
  ) {
    // Inicializar con la fecha actual
    this.fechaSeleccionada = this.getFechaActual();
  }

  ngOnInit(): void {
    // Obtener parámetros de la ruta
    this.route.params.subscribe(params => {
      if (params['turno']) {
        this.turnoSeleccionado = params['turno'];

        // Verificar si tenemos año y fecha en la URL
        if (params['anio'] && params['fecha'] && !isNaN(params['anio'])) {
          // Estructura: /horarios/:turno/:anio/:fecha
          this.anioSeleccionado = parseInt(params['anio']);
          this.fechaSeleccionada = this.stringAFecha(params['fecha']);
        } else if (params['fecha']) {
          // Estructura antigua: /horarios/:turno/:fecha (sin año específico)
          // En este caso, cargar años disponibles primero y seleccionar el primero
          this.anioSeleccionado = null;
          this.fechaSeleccionada = this.stringAFecha(params['fecha']);
        }

        this.cargarAniosDisponibles().then(() => {
          this.cargarHorarios();
        });
      } else {
        // Si no hay parámetros, usar valores por defecto y cargar años disponibles primero
        this.cargarAniosDisponibles().then(() => {
          this.cargarHorarios();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    // Configurar animaciones iniciales usando el servicio
    this.horarioAnimationService.animateInitialEntrance(this.elementRef);
  }

  /**
   * Carga los años disponibles según los filtros de turno y fecha seleccionados
   */
  async cargarAniosDisponibles(): Promise<void> {
    if (!this.turnoSeleccionado || !this.fechaSeleccionada) {
      return;
    }

    try {
      // Convertir el string (clave del enum) al valor del enum
      const turnoEnum = Turno[this.turnoSeleccionado as keyof typeof Turno];
      const fechaFormateada = this.formatearFecha(this.fechaSeleccionada);

      const response = await firstValueFrom(this.cargoService.obtenerAniosDisponibles(turnoEnum, fechaFormateada));

      if (response && response.status === 200) {
        this.aniosDisponibles = response.data as number[];

        // Si no hay año seleccionado y hay años disponibles, mantener null para "todos los años"
        if (this.anioSeleccionado === null) {
          // Mantener null (todos los años) como opción por defecto
        } else if (this.anioSeleccionado && !this.aniosDisponibles.includes(this.anioSeleccionado)) {
          // Si el año seleccionado no está en la lista disponible, volver a "todos los años"
          this.anioSeleccionado = null;
        }
      } else {
        this.aniosDisponibles = [];
        this.anioSeleccionado = null;
      }
    } catch (err: any) {
      console.error('Error al cargar años disponibles:', err);
      this.aniosDisponibles = [];
      this.anioSeleccionado = null;
    }
  }

  /**
   * Carga los horarios según los filtros seleccionados
   */
  cargarHorarios(): void {
    if (!this.turnoSeleccionado || !this.fechaSeleccionada) {
      return;
    }

    this.error = null;
    this.isLoading = true;

    // Si hay datos existentes, animar transición
    if (this.horarioData) {
      this.horarioAnimationService.animateDataTransition(this.elementRef, () => {
        this.loadHorarioData();
      });
    } else {
      this.loadHorarioData();
    }
  }

  /**
   * Método privado para cargar los datos del horario
   */
  private loadHorarioData(): void {
    // Convertir el string (clave del enum) al valor del enum
    const turnoEnum = Turno[this.turnoSeleccionado as keyof typeof Turno];
    const fechaFormateada = this.formatearFecha(this.fechaSeleccionada);

    // Usar el método apropiado según si hay filtro de año o no
    const serviceCall = (this.anioSeleccionado !== null)
      ? this.cargoService.obtenerHorariosConAnio(turnoEnum, this.anioSeleccionado, fechaFormateada)
      : this.cargoService.obtenerHorarios(turnoEnum, fechaFormateada);

    serviceCall.subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.horarioData = response.data as HorarioDTO;

          // Animar entrada de la grilla con callback para configurar hover effects
          setTimeout(() => {
            if (!this.horarioData) return;
            this.horarioAnimationService.animateScheduleGrid(
              this.elementRef,
              () => this.horarioAnimationService.setupHoverEffects(this.elementRef)
            );
          }, 50);
        } else {
          this.error = 'Error al cargar los horarios: ' + (response.message || 'Error desconocido');
          setTimeout(() => {
            this.horarioAnimationService.animateError(this.elementRef);
          }, 50);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Error de conexión: ' + err.message;
        setTimeout(() => {
          this.horarioAnimationService.animateError(this.elementRef);
        }, 50);
      }
    });
  }

  /**
   * Se ejecuta cuando cambian los filtros
   */
  onFiltrosChange(): void {
    // Cargar años disponibles primero si cambió el turno o la fecha
    this.cargarAniosDisponibles().then(() => {
      // Después cargar horarios con los nuevos filtros
      this.cargarHorarios();
      // Navegar a la nueva ruta con los parámetros actualizados
      this.navegarConParametros();
    });
  }

  /**
   * Se ejecuta cuando cambia el filtro de año
   */
  onAnioChange(): void {
    // Solo cargar horarios, no necesitamos recargar años disponibles
    this.cargarHorarios();
    // Navegar a la nueva ruta con los parámetros actualizados
    this.navegarConParametros();
  }

  /**
   * Navega a la ruta correcta según los parámetros seleccionados
   */
  private navegarConParametros(): void {
    const fechaFormateada = this.formatearFecha(this.fechaSeleccionada);

    // Si hay año seleccionado (y no es null), usar la ruta con año
    if (this.anioSeleccionado !== null) {
      this.router.navigate(['/cargos/horarios', this.turnoSeleccionado, this.anioSeleccionado, fechaFormateada]);
    } else {
      // Si no hay año seleccionado (null = todos los años), usar la ruta sin año
      this.router.navigate(['/cargos/horarios', this.turnoSeleccionado, fechaFormateada]);
    }
  }

  /**
   * Obtiene los espacios curriculares para un día y hora específicos
   */
  getEspaciosParaDiaYHora(dia: DiaSemana, hora: number): HoraEspacioCurricular[] {
    if (!this.horarioData?.grilla[dia]) {
      return [];
    }
    return this.horarioData.grilla[dia].filter(espacio => espacio.hora === hora);
  }

  /**
   * Obtiene el nombre traducido del día
   */
  getNombreDia(dia: DiaSemana): string {
    const nombres: { [key in DiaSemana]: string } = {
      [DiaSemana.LUNES]: 'Lunes',
      [DiaSemana.MARTES]: 'Martes',
      [DiaSemana.MIERCOLES]: 'Miércoles',
      [DiaSemana.JUEVES]: 'Jueves',
      [DiaSemana.VIERNES]: 'Viernes',
      [DiaSemana.SABADO]: 'Sábado',
      [DiaSemana.DOMINGO]: 'Domingo'
    };
    return nombres[dia] || dia;
  }

  /**
   * Obtiene el nombre traducido del turno
   */
  getNombreTurno(turno: Turno): string {
    return turno.toString();
  }

  /**
   * Obtiene el nombre del turno desde el string seleccionado
   */
  getNombreTurnoFromString(turnoString: string): string {
    const turnoMap: { [key: string]: string } = {
      'MANIANA': 'Mañana',
      'TARDE': 'Tarde',
      'VESPERTINO': 'Vespertino',
      'NOCHE': 'Noche'
    };
    return turnoMap[turnoString] || turnoString;
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
   * Formatea la fecha NgbDateStruct en formato yyyy-MM-dd (para APIs y URLs)
   */
  formatearFecha(fecha: NgbDateStruct): string {
    return `${fecha.year}-${String(fecha.month).padStart(2, '0')}-${String(fecha.day).padStart(2, '0')}`;
  }

  /**
   * Convierte una fecha string (yyyy-MM-dd) a NgbDateStruct
   */
  stringAFecha(fechaStr: string): NgbDateStruct {
    const [year, month, day] = fechaStr.split('-').map(Number);
    return { year, month, day };
  }
}
