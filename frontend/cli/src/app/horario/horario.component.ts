import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { CargoService } from '../cargo/service/cargo.service';
import { HorarioDTO, HoraEspacioCurricular } from '../models/horario-dto';
import { Turno } from '../models/turno';
import { DiaSemana } from '../models/horario';

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDatepickerModule],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css'
})
export class HorarioComponent implements OnInit {

  horarioData: HorarioDTO | null = null;
  error: string | null = null;

  // Filtros
  turnoSeleccionado: string = 'MANIANA'; // Usar la clave del enum, no el valor
  fechaSeleccionada: NgbDateStruct = this.getFechaActual();
  anioSeleccionado: number | null = null; // null significa "todos los años", cualquier número es un año específico

  // Opciones para los selectores
  turnos = Object.values(Turno);
  aniosDisponibles: number[] = []; // Lista de años disponibles
  dias = [DiaSemana.LUNES, DiaSemana.MARTES, DiaSemana.MIERCOLES, DiaSemana.JUEVES, DiaSemana.VIERNES];
  horas = Array.from({ length: 8 }, (_, i) => i + 1);

  constructor(
    private cargoService: CargoService,
    private route: ActivatedRoute,
    private router: Router
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

    // Convertir el string (clave del enum) al valor del enum
    const turnoEnum = Turno[this.turnoSeleccionado as keyof typeof Turno];
    const fechaFormateada = this.formatearFecha(this.fechaSeleccionada);

    // Usar el método apropiado según si hay filtro de año o no
    const serviceCall = (this.anioSeleccionado !== null)
      ? this.cargoService.obtenerHorariosConAnio(turnoEnum, this.anioSeleccionado, fechaFormateada)
      : this.cargoService.obtenerHorarios(turnoEnum, fechaFormateada);

    serviceCall.subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.horarioData = response.data as HorarioDTO;
        } else {
          this.error = 'Error al cargar los horarios: ' + (response.message || 'Error desconocido');
        }
      },
      error: (err) => {
        this.error = 'Error de conexión: ' + err.message;
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
