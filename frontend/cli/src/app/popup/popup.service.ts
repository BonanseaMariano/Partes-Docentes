/**
 * @fileoverview Servicio para gestión de popups dinámicos del sistema de gestión de partes docente.
 * Proporciona funcionalidades avanzadas para crear y gestionar ventanas modales dinámicas.
 * 
 * @description Este servicio centraliza la lógica para mostrar popups modales con contenido
 * personalizable mediante plantillas de Angular. Es especialmente útil para mostrar información
 * detallada de docentes, reemplazos, suplencias y otros datos del sistema académico.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */

import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, TemplateRef, createComponent } from "@angular/core";
import { PopupComponent } from "./popup.component";

/**
 * Interfaz para configuración de opciones de popup.
 * 
 * Define las propiedades disponibles para personalizar la apariencia
 * y comportamiento de los popups del sistema, permitiendo flexibilidad
 * total en la presentación de información modal.
 * 
 * @interface PopupOptions
 */
export interface PopupOptions {
  /** Título del popup mostrado en el encabezado */
  title?: string;
  /** Icono a mostrar junto al título (clase CSS, ej: 'fa-user-tie') */
  icon?: string;
  /** Indica si mostrar el botón de cerrar en la esquina superior derecha */
  showCloseButton?: boolean;
  /** Ancho del popup como valor CSS (ej: '80%', '500px') */
  width?: string;
  /** Ancho máximo del popup como valor CSS */
  maxWidth?: string;
  /** Altura máxima del popup como valor CSS */
  maxHeight?: string;
  /** Datos adicionales para el popup, disponibles en la plantilla */
  data?: any;
}

/**
 * Servicio para gestión de popups dinámicos del sistema.
 * 
 * Proporciona funcionalidades completas para crear y gestionar popups modales dinámicos
 * con contenido personalizable mediante plantillas de Angular. Maneja automáticamente
 * el ciclo de vida de los componentes, la gestión de memoria y la integración con el DOM.
 * 
 * Características principales:
 * - Creación dinámica de popups mediante plantillas
 * - Configuración flexible de apariencia y comportamiento
 * - Gestión automática del ciclo de vida y limpieza de recursos
 * - Integración con el sistema de animaciones
 * - Soporte para datos contextuales
 * 
 * @class PopupService
 * @injectable
 */
@Injectable({
  providedIn: "root",
})
export class PopupService {
  /**
   * Referencia al componente popup actualmente activo.
   * @private
   * @type {ComponentRef<PopupComponent> | null}
   */
  private popupRef: ComponentRef<PopupComponent> | null = null;

  /**
   * Elemento DOM que contiene el popup actual.
   * @private
   * @type {HTMLElement | null}
   */
  private hostElement: HTMLElement | null = null;

  /**
   * Constructor del servicio de popups.
   * 
   * Inicializa las dependencias necesarias para la creación dinámica de componentes
   * y su gestión dentro del contexto de la aplicación Angular.
   * 
   * @constructor
   * @param {ApplicationRef} appRef - Referencia a la aplicación Angular para gestión de vistas
   * @param {EnvironmentInjector} environmentInjector - Inyector de entorno para creación de componentes
   */
  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) { }

  /**
   * Muestra un popup modal con el contenido de la plantilla proporcionada.
   * 
   * Crea dinámicamente un componente popup, lo configura según las opciones especificadas
   * y lo muestra en pantalla. Si ya existe un popup activo, lo cierra automáticamente
   * antes de mostrar el nuevo. Maneja toda la lógica de creación, configuración y
   * ciclo de vida del popup.
   * 
   * @method show
   * @param {TemplateRef<any>} contentTemplate - Plantilla Angular con el contenido a mostrar
   * @param {PopupOptions} [options={}] - Opciones de configuración del popup
   * @returns {Promise<any>} Promesa que se resuelve cuando se cierra el popup
   * 
   * @example
   * ```typescript
   * this.popupService.show(this.miTemplate, {
   *   title: 'Información del Docente',
   *   icon: 'fa-user',
   *   width: '600px',
   *   data: { docente: docenteSeleccionado }
   * });
   * ```
   */
  show(contentTemplate: TemplateRef<any>, options: PopupOptions = {}): Promise<any> {
    // Si ya hay un popup abierto, lo cerramos primero
    this.close();

    // Creamos y adjuntamos el componente popup al DOM
    const hostElement = document.createElement('div');
    document.body.appendChild(hostElement);
    this.hostElement = hostElement;

    this.popupRef = createComponent(PopupComponent, {
      environmentInjector: this.environmentInjector,
      hostElement
    });

    // Configuramos las propiedades del popup según las opciones proporcionadas
    const instance = this.popupRef.instance;
    instance.title = options.title || '';
    instance.icon = options.icon || '';
    instance.showCloseButton = options.showCloseButton !== false;
    instance.width = options.width || '80%';
    instance.maxWidth = options.maxWidth || '800px';
    instance.maxHeight = options.maxHeight || '80vh';
    instance.contentTemplate = contentTemplate;
    instance.data = options.data || null;

    // Adjuntamos el componente a la aplicación Angular
    this.appRef.attachView(this.popupRef.hostView);

    // Mostramos el popup con animaciones
    instance.show();

    // Devolvemos una promesa que se resuelve cuando se cierra el popup
    return new Promise<void>((resolve) => {
      const checkVisibility = setInterval(() => {
        if (!instance.visible) {
          clearInterval(checkVisibility);
          this.close();
          resolve();
        }
      }, 100);
    });
  }

  /**
   * Cierra el popup actualmente abierto y limpia todos los recursos asociados.
   * 
   * Realiza una limpieza completa del popup activo: desacopla la vista de la aplicación,
   * remueve el elemento del DOM y destruye el componente para liberar memoria y
   * evitar memory leaks. Es seguro llamar este método incluso si no hay popup activo.
   * 
   * @method close
   * @returns {void}
   */
  close(): void {
    if (this.popupRef) {
      // Desacoplar la vista de la aplicación Angular
      this.appRef.detachView(this.popupRef.hostView);

      // Remover el elemento del DOM
      if (this.hostElement && this.hostElement.parentNode) {
        this.hostElement.parentNode.removeChild(this.hostElement);
      }

      // Destruir el componente y limpiar referencias
      this.popupRef.destroy();
      this.popupRef = null;
      this.hostElement = null;
    }
  }
}