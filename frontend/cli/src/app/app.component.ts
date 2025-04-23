import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgbDropdownModule, NgbCollapseModule],
  templateUrl: './app.component.html',
  styles: [`
    .navbar-brand {
      font-weight: 600;
    }
    
    .dropdown-item:hover {
      background-color: #f0f8ff;
    }
    
    .navbar {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    footer {
      margin-top: auto;
      border-top: 1px solid #e9ecef;
    }
  `],
})
export class AppComponent {
  title = 'Sistema de Gestión de Novedades Docentes';
  isMenuCollapsed = true;
}
