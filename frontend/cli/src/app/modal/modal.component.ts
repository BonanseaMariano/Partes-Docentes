/**
 * @fileoverview Componente modal reutilizable para diálogos de confirmación, error y éxito.
 * Proporciona una interfaz unificada para mostrar diferentes tipos de modales en la aplicación.
 * 
 * @description Este componente encapsula la funcionalidad de modales utilizando NgBootstrap,
 * proporcionando una interfaz consistente para mostrar mensajes de confirmación, errores
 * y notificaciones de éxito en todo el sistema de gestión de partes docente.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */

import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";

/**
 * Tipos de modales disponibles en la aplicación.
 * 
 * @typedef {'confirm' | 'error' | 'success'} ModalType
 * - confirm: Modal de confirmación con botones Aceptar/Cancelar
 * - error: Modal de error con botón único de Aceptar
 * - success: Modal de éxito con botón único de Aceptar
 */
type ModalType = 'confirm' | 'error' | 'success';

/**
 * Componente modal reutilizable para diferentes tipos de diálogos.
 * 
 * Proporciona una interfaz unificada para mostrar modales de confirmación, error y éxito.
 * Utiliza NgBootstrap para la funcionalidad base del modal y adapta su comportamiento
 * según el tipo específico de modal requerido.
 * 
 * @class ModalComponent
 */
@Component({
  selector: "app-modal",
  imports: [CommonModule],
  templateUrl: "./modal.component.html",
  styles: ``,
})
export class ModalComponent {
  /**
   * Título del modal.
   * @type {string}
   */
  title = "";

  /**
   * Mensaje principal del modal.
   * @type {string}
   */
  message = "";

  /**
   * Descripción adicional o detalle del modal.
   * @type {string}
   */
  description = "";

  /**
   * Tipo de modal que determina el comportamiento y apariencia.
   * @type {ModalType}
   */
  modalType: ModalType = 'confirm';

  /**
   * Constructor del componente modal.
   * 
   * @constructor
   * @param {NgbActiveModal} modal - Instancia activa del modal de NgBootstrap
   */
  constructor(public modal: NgbActiveModal) { }

  /**
   * Determina si el modal debe mostrar el botón de cancelar.
   * 
   * Solo los modales de tipo 'confirm' muestran el botón de cancelar,
   * mientras que los modales de 'error' y 'success' solo muestran el botón de aceptar.
   * 
   * @getter
   * @returns {boolean} true si debe mostrar el botón de cancelar, false en caso contrario
   */
  get showCancelButton(): boolean {
    return this.modalType === 'confirm';
  }
}
