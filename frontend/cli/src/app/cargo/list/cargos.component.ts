import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PaginationConfig } from '../../core/constants/pagination.constants';
import { ValidationService } from '../../core/services/validation.service';
import { ModalService } from '../../modal/modal.service';
import { Cargo } from '../../models/cargo';
import { Dia } from '../../models/horario';
import { ResultsPage } from '../../models/results-page';
import { TipoDesignacion } from '../../models/tipo-designacion';
import { PaginationComponent } from '../../pagination/pagination.component';
import { TipoDesignacionPipe } from '../../pipes/tipo-designacion.pipe';
import { PopupService } from '../../popup/popup.service';
import { CargoService } from '../service/cargo.service';


@Component({
    selector: 'app-divisiones',
    imports: [CommonModule, RouterModule, PaginationComponent, TipoDesignacionPipe],
    templateUrl: './cargos.component.html',
    styles: ``
})
export class CargosComponent {
    resultsPage: ResultsPage = <ResultsPage>{};
    currentPage: number = PaginationConfig.INITIAL_PAGE;
    pageSize: number = PaginationConfig.PAGE_SIZE;
    tipoDesignacionEnum = TipoDesignacion;
    diaEnum = Dia;
    selectedCargo: Cargo | null = null;
    Object = Object; // Para poder usar Object.keys en la plantilla

    @ViewChild('horariosTemplate', { static: true }) horariosTemplate!: TemplateRef<any>;

    constructor(
        public cargoService: CargoService, // Cambiado a público para poder acceder desde la plantilla
        private modalService: ModalService,
        private validationService: ValidationService,
        private popupService: PopupService,
        private router: Router
    ) { }

    /**
     * Método para crear un nuevo cargo con validación previa
     */
    crearNuevo(): void {
        this.validationService.checkDivisiones().subscribe(result => {
            const hayDivisiones = result.isValid;

            // Si hay divisiones, navegamos directamente
            if (hayDivisiones) {
                this.router.navigate(['/cargos/new']);
                return;
            }

            // Si no hay divisiones, mostramos confirmación
            this.modalService.confirm(
                result.errorTitle || 'No existen divisiones',
                result.errorMessage || 'No hay divisiones en el sistema',
                result.errorDescription || 'Solo se podrán crear cargos de tipo "Cargo". Los cargos de tipo "Espacio Curricular" requieren una división asociada.'
            ).then(() => {
                // Si el usuario acepta, navegamos con restricción
                this.router.navigate(['/cargos/new'], { queryParams: { restringirTipo: 'true' } });
            }, () => {
                // Si cancela, no hacemos nada
            });
        });
    }

    getCargos(): void {
        this.cargoService.byPage(this.currentPage, this.pageSize).subscribe((dataPackage) => {
            this.resultsPage = <ResultsPage>dataPackage.data;
        });
    }

    remove(id: number): void {
        let that = this;
        this.modalService
            .confirm(
                "Eliminar cargo",
                "¿Estás seguro de que deseas eliminar este cargo?",
                "Si elimina el cargo no lo podrá utilizar luego"
            )
            .then(function () {
                that.cargoService.remove(id).subscribe({
                    next: (dataPackage) => {
                        if (dataPackage.status === HttpStatusCode.InternalServerError) {
                            that.modalService.error(
                                "Error al eliminar",
                                dataPackage.message,
                                ""
                            );
                        }
                        that.getCargos();
                    }
                });
            });
    }

    openHorariosPopup(cargo: Cargo): void {
        this.selectedCargo = cargo;
        this.popupService.show(this.horariosTemplate, {
            title: `Horarios de ${cargo.nombre}`,
            icon: 'fa-clock-o', // Icono de reloj
            data: cargo
        });
    }

    getHorarioCount(cargo: Cargo): number {
        return this.cargoService.hasHorarios(cargo) ? cargo.horarios.length : 0;
    }

    // Método auxiliar para ordenar los horarios por día y hora
    getOrderedHorarios(cargo: Cargo): any[] {
        return this.cargoService.orderHorarios(cargo.horarios);
    }

    getHorariosByDay(cargo: Cargo): { [key: string]: any[] } {
        return this.cargoService.getHorariosByDay(cargo);
    }

    ngOnInit(): void {
        this.getCargos();
    }

    onPageChangeRequested(page: number): void {
        this.currentPage = page;
        this.getCargos();
    }
}
