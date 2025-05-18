import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, TemplateRef, createComponent } from "@angular/core";
import { PopupComponent } from "./popup.component";

export interface PopupOptions {
  title?: string;
  icon?: string; // Nueva propiedad para el icono (ej: 'fa-user-tie')
  showCloseButton?: boolean;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  data?: any;
}

@Injectable({
  providedIn: "root",
})
export class PopupService {
  private popupRef: ComponentRef<PopupComponent> | null = null;
  private hostElement: HTMLElement | null = null;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) { }

  /**
   * Muestra un popup con el contenido de la plantilla proporcionada
   * @param contentTemplate Plantilla con el contenido a mostrar
   * @param options Opciones de configuración del popup
   * @returns Promesa que se resuelve cuando se cierra el popup
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

    // Configuramos las propiedades del popup
    const instance = this.popupRef.instance;
    instance.title = options.title || '';
    instance.icon = options.icon || ''; // Asignamos el icono si se proporciona
    instance.showCloseButton = options.showCloseButton !== false;
    instance.width = options.width || '80%';
    instance.maxWidth = options.maxWidth || '800px';
    instance.maxHeight = options.maxHeight || '80vh';
    instance.contentTemplate = contentTemplate;
    instance.data = options.data || null;

    // Adjuntamos el componente a la aplicación
    this.appRef.attachView(this.popupRef.hostView);

    // Mostramos el popup
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
   * Cierra el popup actualmente abierto
   */
  close(): void {
    if (this.popupRef) {
      // Detach the view
      this.appRef.detachView(this.popupRef.hostView);

      // Remove the component from the DOM
      if (this.hostElement && this.hostElement.parentNode) {
        this.hostElement.parentNode.removeChild(this.hostElement);
      }

      // Destroy the component
      this.popupRef.destroy();
      this.popupRef = null;
      this.hostElement = null;
    }
  }
}