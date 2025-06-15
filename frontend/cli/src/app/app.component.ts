import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ValidationService } from './core/services/validation.service';
import { ModalService } from './modal/modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, NgbDropdownModule, NgbCollapseModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Sistema de Gestión de Novedades Docentes';
  isMenuCollapsed = true;
  isNavbarScrolled = false;
  
  // Fecha actual para el enlace del parte diario
  fechaHoy = new Date();

  constructor(
    private validationService: ValidationService,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicialización del componente
  }

  /**
   * Detecta el scroll para aplicar efectos al navbar
   */
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isNavbarScrolled = scrollTop > 50;
  }

  /**
   * Cierra el menú móvil cuando se hace clic en un enlace
   */
  closeNavbar(): void {
    this.isMenuCollapsed = true;
  }

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

  /**
   * Devuelve la fecha actual en formato yyyy-MM-dd para usarla en la URL del parte diario
   */
  getFechaHoy(): string {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Devuelve el año actual para usarlo en la URL del reporte de concepto
   */
  getAnioActual(): number {
    return new Date().getFullYear();
  }
}
