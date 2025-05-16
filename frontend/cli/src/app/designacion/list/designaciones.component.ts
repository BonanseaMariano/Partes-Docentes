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
import { DesignacionService } from '../service/designacion.service';


@Component({
    selector: 'app-divisiones',
    imports: [CommonModule, RouterModule, PaginationComponent, TipoDesignacionPipe],
    templateUrl: './designaciones.component.html',
    styles: ``
})
export class DesignacionesComponent {
    resultsPage: ResultsPage = <ResultsPage>{};
    currentPage: number = PaginationConfig.INITIAL_PAGE;
    pageSize: number = PaginationConfig.PAGE_SIZE;
    tipoDesignacionEnum = TipoDesignacion;

    constructor(
        private designacionService: DesignacionService,
        private modalService: ModalService,
        private validationService: ValidationService,
        private router: Router
    ) { }

    getDesignaciones(): void {
        this.designacionService.byPage(this.currentPage, this.pageSize).subscribe((dataPackage) => {
            this.resultsPage = <ResultsPage>dataPackage.data;
        });
    }

    /**
     * Método para navegar a la creación de una nueva designación
     * con validación previa de requisitos
     */
    crearNueva(): void {
        this.validationService.validateWithFeedback(
            () => this.validationService.canCreateDesignacion()
        ).subscribe(canCreate => {
            if (canCreate) {
                this.router.navigateByUrl('/designaciones/new');
            }
        });
    }

    remove(id: number): void {
        let that = this;
        this.modalService
            .confirm(
                "Eliminar designación",
                "¿Estás seguro de que deseas eliminar esta designación?",
                "Si elimina la designación no la podrá utilizar luego"
            )
            .then(function () {
                that.designacionService.remove(id).subscribe({
                    next: (dataPackage) => {
                        if (dataPackage.status === 409) {
                            that.modalService.error(
                                "Error al eliminar",
                                dataPackage.message,
                                ""
                            );
                        }
                        that.getDesignaciones();
                    }
                });
            });
    }

    ngOnInit(): void {
        this.getDesignaciones();
    }

    onPageChangeRequested(page: number): void {
        this.currentPage = page;
        this.getDesignaciones();
    }
}
