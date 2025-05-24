import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as AOS from 'aos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule],
  templateUrl: './home.component.html',
  styleUrl: `./home.component.css`,
})
export class HomeComponent implements OnInit {
  // Propiedades para la página de inicio
  readonly appTitle = 'Sistema de Gestión de Novedades Docentes';
  readonly schoolName = 'Escuela 775 - Puerto Madryn';
  readonly developer = 'Mariano Bonansea';
  readonly year = new Date().getFullYear();

  // Datos de las funcionalidades principales
  readonly features = [
    {
      title: 'Administración del Personal',
      description: 'Gestión completa del plantel docente con registro detallado de personas, historial de designaciones a cargos y espacios curriculares.',
      image: 'AdministracionPersonal.png'
    },
    {
      title: 'Gestión de Licencias',
      description: 'Control automático de licencias solicitadas por el personal docente. Verificación del cumplimiento de requisitos según los artículos del reglamento.',
      image: 'GestionLicencias.png'
    },
    {
      title: 'Informes y Reportes',
      description: 'Generación automatizada de partes diarios de novedades, informes anuales para conceptos del personal y trazabilidad completa.',
      image: 'InformesReportes.png'
    }
  ];

  constructor() {
    // Constructor simple sin lógica adicional
  }

  ngOnInit(): void {
    // Inicializar AOS
    AOS.init({
      duration: 1000, // Duración de las animaciones
      easing: 'ease-in-out', // Tipo de easing
      once: true, // Las animaciones solo se ejecutan una vez
      offset: 200, // Offset desde el viewport
    });
  }
}
