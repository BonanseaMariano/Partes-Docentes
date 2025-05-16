import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { PaginationConfig } from '../../core/constants/pagination.constants';
import { ValidationService } from '../../core/services/validation.service';
import { ModalService } from '../../modal/modal.service';
import { ResultsPage } from '../../models/results-page';
import { TipoDesignacion } from '../../models/tipo-designacion';
import { PaginationComponent } from '../../pagination/pagination.component';
import { TipoDesignacionPipe } from '../../pipes/tipo-designacion.pipe';
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

    constructor(
        private cargoService: CargoService,
        private modalService: ModalService,
        private validationService: ValidationService,
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
                        if (dataPackage.status === 409) {
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

    ngOnInit(): void {
        this.getCargos();
    }

    onPageChangeRequested(page: number): void {
        this.currentPage = page;
        this.getCargos();
    }
}
