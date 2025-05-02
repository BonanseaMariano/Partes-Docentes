import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginationConfig } from '../../core/constants/pagination.constants';
import { ModalService } from '../../modal/modal.service';
import { ResultsPage } from '../../models/results-page';
import { TipoDesignacion } from '../../models/tipo-designacion';
import { PaginationComponent } from '../../pagination/pagination.component';
import { DesignacionService } from '../service/designacion.service';


@Component({
    selector: 'app-divisiones',
    imports: [CommonModule, RouterModule, PaginationComponent],
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
        private modalService: ModalService
    ) { }

    getDesignaciones(): void {
        this.designacionService.byPage(this.currentPage, this.pageSize).subscribe((dataPackage) => {
            this.resultsPage = <ResultsPage>dataPackage.data;
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
