import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ValidationService } from './core/services/validation.service';
import { ModalService } from './modal/modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgbDropdownModule, NgbCollapseModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Sistema de Gestión de Novedades Docentes';
  isMenuCollapsed = true;

  constructor(
    private validationService: ValidationService,
    private modalService: ModalService,
    private router: Router
  ) {}

  /**
   * Método para validar la creación de una nueva designación
   * desde el menú principal
   */
  crearNuevaDesignacion(): void {
    this.validationService.validateWithFeedback(
      () => this.validationService.canCreateDesignacion()
    ).subscribe(canCreate => {
      if (canCreate) {
        this.router.navigateByUrl('/designaciones/new');
      }
    });
  }

  /**
   * Método para validar la creación de un nuevo cargo
   * desde el menú principal
   */
  crearNuevoCargo(): void {
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
}
