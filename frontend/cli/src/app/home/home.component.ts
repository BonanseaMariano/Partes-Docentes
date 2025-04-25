import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {
  // Componente simple sin lógica adicional
}
