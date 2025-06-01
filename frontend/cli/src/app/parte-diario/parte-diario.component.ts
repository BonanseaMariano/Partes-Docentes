import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LicenciaService } from '../licencia/service/licencia.service';
import { ParteDiario, DocenteLicencia } from '../models/parte-diario';
import { DataPackage } from '../models/data-package';
import { DniFormatPipe } from '../pipes/dni-format.pipe';
import { FechaFormatPipe } from '../pipes/fecha-format.pipe';

@Component({
    selector: 'app-parte-diario',
    standalone: true,
    imports: [CommonModule, FormsModule, NgbDatepickerModule, DniFormatPipe, FechaFormatPipe],
    templateUrl: './parte-diario.component.html',
    styleUrl: './parte-diario.component.css'
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
                    }
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
        // Después de reiniciar la fecha, cargar el parte diario para la fecha actual
        this.cargarParteDiario();
        // Actualizar la URL para reflejar la fecha actual
        this.actualizarURL();
    }

    /**
     * Método que se ejecuta cuando cambia la fecha en el datepicker
     * Combina la funcionalidad de buscar y actualizarURL
     */
    onFechaChange(): void {
        this.cargarParteDiario();
        this.actualizarURL();
    }
}
