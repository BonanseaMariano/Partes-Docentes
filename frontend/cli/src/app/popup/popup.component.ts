/**
 * @fileoverview Componente popup modal reutilizable para mostrar contenido dinámico.
 * Proporciona una ventana modal flexible con contenido personalizable mediante plantillas.
 * 
 * @description Este componente implementa la funcionalidad base de los popups modales
 * del sistema. Permite mostrar contenido dinámico proporcionado mediante plantillas de Angular,
 * con configuración flexible de tamaño, estilos y comportamiento. Es utilizado principalmente
 * para mostrar información detallada de docentes, reemplazos y otros datos del sistema académico.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */

import { CommonModule } from "@angular/common";
import { Component, Input, TemplateRef, ViewEncapsulation } from "@angular/core";

/**
 * Componente popup modal reutilizable.
 * 
 * Implementa una ventana modal flexible que puede mostrar contenido dinámico
 * mediante plantillas de Angular. Proporciona configuración completa de apariencia,
 * tamaño y comportamiento, incluyendo cierre por backdrop y botón de cerrar.
 * 
 * Características principales:
 * - Contenido dinámico mediante plantillas
 * - Configuración flexible de tamaño y apariencia
 * - Soporte para iconos en el título
 * - Cierre por backdrop o botón
 * - Animaciones de entrada y salida
 * - Encapsulación de estilos para mayor flexibilidad
 * 
 * @class PopupComponent
 */
@Component({
  selector: "app-popup",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./popup.component.html",
  styleUrls: ["./popup.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class PopupComponent {
  /**
   * Título del popup mostrado en el encabezado.
   * @type {string}
   */
  @Input() title: string = "";

  /**
   * Icono a mostrar junto al título (clase CSS de FontAwesome).
   * @type {string}
   * @example "fa-user-tie", "fa-info-circle"
   */
  @Input() icon: string = "";

  /**
   * Indica si mostrar el botón de cerrar en la esquina superior derecha.
   * @type {boolean}
   */
  @Input() showCloseButton: boolean = true;

  /**
   * Ancho del popup como valor CSS.
   * @type {string}
   * @example "80%", "500px"
   */
  @Input() width: string = "80%";

  /**
   * Ancho máximo del popup como valor CSS.
   * @type {string}
   */
  @Input() maxWidth: string = "800px";

  /**
   * Altura máxima del popup como valor CSS.
   * @type {string}
   */
  @Input() maxHeight: string = "80vh";

  /**
   * Plantilla con el contenido a mostrar en el popup.
   * @type {TemplateRef<any> | undefined}
   */
  @Input() contentTemplate?: TemplateRef<any>;

  /**
   * Datos contextuales disponibles para la plantilla del popup.
   * @type {any}
   */
  @Input() data: any;

  /**
   * Indica si el popup está visible actualmente.
   * @type {boolean}
   */
  visible: boolean = false;

  /**
   * Constructor del componente popup.
   * @constructor
   */
  constructor() { }

  /**
   * Muestra el popup estableciendo la visibilidad en true.
   * 
   * @method show
   * @returns {void}
   */
  show(): void {
    this.visible = true;
  }

  /**
   * Oculta el popup estableciendo la visibilidad en false.
   * 
   * @method hide
   * @returns {void}
   */
  hide(): void {
    this.visible = false;
  }

  /**
   * Maneja el clic en el fondo del popup para cerrarlo.
   * 
   * Solo cierra el popup si el clic fue directamente en el fondo (backdrop),
   * no en el contenido del popup, evitando cierres accidentales.
   * 
   * @method onBackdropClick
   * @param {MouseEvent} event - Evento del clic del mouse
   * @returns {void}
   */
  onBackdropClick(event: MouseEvent): void {
    // Asegurarse de que el clic fue directamente en el fondo, no en el contenido
    if ((event.target as HTMLElement).classList.contains('popup-backdrop')) {
      this.hide();
    }
  }
}