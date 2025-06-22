/**
 * @fileoverview Componente de página de inicio del Sistema de Gestión de Partes Docente.
 * Presenta la pantalla principal con información institucional y navegación a las funcionalidades principales.
 * 
 * @description Este componente sirve como punto de entrada principal de la aplicación, mostrando información
 * institucional, características del sistema y proporcionando navegación hacia los módulos principales como
 * administración de personal, gestión de licencias y generación de reportes.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as AOS from 'aos';

/**
 * Representa una funcionalidad del sistema mostrada en la página de inicio.
 * 
 * @interface Feature
 * @property {string} title - Título de la funcionalidad
 * @property {string} description - Descripción detallada de la funcionalidad
 * @property {string} image - Nombre del archivo de imagen asociado
 */
interface Feature {
  title: string;
  description: string;
  image: string;
}

/**
 * Componente principal de la página de inicio del sistema.
 * 
 * Gestiona la presentación de información institucional y las funcionalidades principales
 * del sistema de gestión de partes docente. Incluye animaciones con la librería AOS
 * para mejorar la experiencia del usuario.
 * 
 * @class HomeComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule],
  templateUrl: './home.component.html',
  styleUrl: `./home.component.css`,
})
export class HomeComponent implements OnInit {
  /**
   * Título principal de la aplicación.
   * @readonly
   * @type {string}
   */
  readonly appTitle = 'Sistema de Gestión de Novedades Docentes';

  /**
   * Nombre de la institución educativa.
   * @readonly
   * @type {string}
   */
  readonly schoolName = 'Escuela 775 - Puerto Madryn';

  /**
   * Nombre del desarrollador del sistema.
   * @readonly
   * @type {string}
   */
  readonly developer = 'Mariano Bonansea';

  /**
   * Año actual calculado dinámicamente.
   * @readonly
   * @type {number}
   */
  readonly year = new Date().getFullYear();

  /**
   * Array de funcionalidades principales del sistema mostradas en la página de inicio.
   * Cada funcionalidad incluye título, descripción e imagen asociada.
   * 
   * @readonly
   * @type {Feature[]}
   */
  readonly features: Feature[] = [
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

  /**
   * Constructor del componente.
   * 
   * @constructor
   */
  constructor() {
    // Constructor simple sin lógica adicional
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta después de la inicialización del componente.
   * 
   * Configura e inicializa la librería AOS (Animate On Scroll) para las animaciones
   * de aparición de elementos al hacer scroll en la página.
   * 
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    // Inicializar AOS con configuración personalizada
    AOS.init({
      duration: 1000,        // Duración de las animaciones en milisegundos
      easing: 'ease-in-out', // Tipo de transición suave
      once: true,            // Las animaciones solo se ejecutan una vez
      offset: 200,           // Offset desde el viewport para activar la animación
    });
  }
}
