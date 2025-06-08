import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CargoService } from '../cargo/service/cargo.service';
import { HorarioDTO, HoraEspacioCurricular } from '../models/horario-dto';
import { Turno } from '../models/turno';
import { DiaSemana } from '../models/horario';

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css'
})
export class HorarioComponent implements OnInit {
  
  horarioData: HorarioDTO | null = null;
  loading = false;
  error: string | null = null;
  
  // Filtros
  turnoSeleccionado: string = 'MANIANA'; // Usar la clave del enum, no el valor
  fechaSeleccionada: string = '';
  
  // Opciones para los selectores
  turnos = Object.values(Turno);
  dias = [DiaSemana.LUNES, DiaSemana.MARTES, DiaSemana.MIERCOLES, DiaSemana.JUEVES, DiaSemana.VIERNES];
  horas = Array.from({ length: 8 }, (_, i) => i + 1);

  constructor(
    private cargoService: CargoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Inicializar con la fecha actual
    this.fechaSeleccionada = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    // Obtener parámetros de la ruta
    this.route.params.subscribe(params => {
      if (params['turno'] && params['fecha']) {
        this.turnoSeleccionado = params['turno'];
        this.fechaSeleccionada = params['fecha'];
        this.cargarHorarios();
      } else {
        // Si no hay parámetros, usar valores por defecto y cargar
        this.cargarHorarios();
      }
    });
  }

  /**
   * Carga los horarios según los filtros seleccionados
   */
  cargarHorarios(): void {
    if (!this.turnoSeleccionado || !this.fechaSeleccionada) {
      return;
    }

    this.loading = true;
    this.error = null;

    // Convertir el string (clave del enum) al valor del enum
    const turnoEnum = Turno[this.turnoSeleccionado as keyof typeof Turno];

    this.cargoService.obtenerHorarios(turnoEnum, this.fechaSeleccionada).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.horarioData = response.data as HorarioDTO;
        } else {
          this.error = 'Error al cargar los horarios: ' + (response.message || 'Error desconocido');
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error de conexión: ' + err.message;
        this.loading = false;
      }
    });
  }

  /**
   * Se ejecuta cuando cambian los filtros
   */
  onFiltrosChange(): void {
    // Navegar a la nueva ruta con los parámetros actualizados
    this.router.navigate(['/cargos/horarios', this.turnoSeleccionado, this.fechaSeleccionada]);
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
}
