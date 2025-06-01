import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LicenciaService } from '../licencia/service/licencia.service';
import { ParteDiario, DocenteLicencia } from '../models/parte-diario';
import { DataPackage } from '../models/data-package';
import { DniFormatPipe } from '../pipes/dni-format.pipe';

@Component({
    selector: 'app-parte-diario',
    standalone: true,
    imports: [CommonModule, FormsModule, NgbDatepickerModule, DniFormatPipe],
    templateUrl: './parte-diario.component.html',
    styles: `
    .input-group-text {
      width: 100px;
    }
    .calendar {
      cursor: pointer;
    }
    .parte-diario-table {
      font-size: 0.9rem;
    }
    .parte-diario-table th {
      background-color: #f8f9fa;
    }
  `
})
export class ParteDiarioComponent implements OnInit {
    // Fecha seleccionada para el parte diario
    fechaSeleccionada: NgbDateStruct = this.getFechaActual();

    // Modelo de parte diario
    parteDiario: ParteDiario = {
        fecha: new Date(),
        docentes: []
    };

    // El modelo de parte diario es suficiente para gestionar el estado

    constructor(
        private licenciaService: LicenciaService,
        private route: ActivatedRoute,
        private router: Router
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
     * Formatea la fecha en formato yyyy-MM-dd
     */
    formatearFecha(fecha: NgbDateStruct): string {
        return `${fecha.year}-${String(fecha.month).padStart(2, '0')}-${String(fecha.day).padStart(2, '0')}`;
    }

    /**
     * Carga el parte diario para la fecha seleccionada
     */
    cargarParteDiario(): void {
        const fechaFormateada = this.formatearFecha(this.fechaSeleccionada);

        this.licenciaService.getParteDiario(fechaFormateada)
            .subscribe({
                next: (response: DataPackage) => {
                    if (response.data) {
                        // Necesitamos hacer un cast para acceder a la estructura ParteDiario
                        const responseData = response.data as any;

                        if (responseData.ParteDiario) {
                            // Mapeamos los datos correctamente desde la estructura de la API
                            this.parteDiario = {
                                fecha: new Date(responseData.ParteDiario.Fecha),
                                docentes: responseData.ParteDiario.Docentes.map((docente: any) => ({
                                    dni: docente.DNI,
                                    nombre: docente.Nombre,
                                    apellido: docente.Apellido,
                                    articulo: docente.Artículo,
                                    descripcion: docente.Descripción,
                                    desde: new Date(docente.Desde),
                                    hasta: new Date(docente.Hasta)
                                }))
                            };
                        }

                        console.log('Parte diario cargado:', this.parteDiario);
                    }
                },
                error: (err) => {
                    console.error('Error al cargar parte diario:', err);
                    // Inicializar el parte diario vacío en caso de error
                    this.parteDiario = {
                        fecha: new Date(),
                        docentes: []
                    };
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
     * Formatea una fecha para mostrar en la tabla
     */
    formatoFechaTabla(fecha: Date): string {
        return fecha.toISOString().split('T')[0];
    }

    /**
     * Maneja el botón de búsqueda
     */
    buscar(): void {
        this.cargarParteDiario();
        this.actualizarURL();
    }

    /**
     * Reinicia la búsqueda con la fecha actual
     */
    reset(): void {
        this.fechaSeleccionada = this.getFechaActual();
        this.parteDiario = {
            fecha: new Date(),
            docentes: []
        };
    }
}
