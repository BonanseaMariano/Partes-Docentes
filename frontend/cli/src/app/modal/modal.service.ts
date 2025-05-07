import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "./modal.component";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(private modalService: NgbModal) { }

  /**
   * Muestra un diálogo de confirmación al usuario
   * @param title Título del modal
   * @param message Mensaje principal a mostrar
   * @param description Descripción adicional (opcional)
   * @returns Promise que se resuelve al aceptar y se rechaza al cancelar
   */
  confirm(title: string, message: string, description: string = ""): Promise<any> {
    const modal = this.modalService.open(ModalComponent, {
      backdrop: 'static', // Previene que se cierre al hacer clic fuera
      keyboard: false,    // Previene que se cierre con la tecla Escape
      centered: true,
      windowClass: 'modal-confirm' // Clase para la ventana modal completa
    });
    modal.componentInstance.title = title;
    modal.componentInstance.message = message;
    modal.componentInstance.description = description;
    modal.componentInstance.modalType = 'confirm';

    // Retornamos una promesa que captura y maneja adecuadamente el rechazo
    return new Promise((resolve, reject) => {
      modal.result.then(
        result => resolve(result),
        reason => {
          // Simplemente ignoramos el rechazo sin propagarlo
          if (reason === 'Cross click' || reason === 'Cancel click') {
            // No hacemos nada, solo evitamos que el error se propague
          } else {
            reject(reason);
          }
        }
      );
    });
  }

  /**
   * Muestra una alerta de error al usuario
   * @param title Título del modal
   * @param message Mensaje principal a mostrar
   * @param description Descripción adicional (opcional)
   * @returns Promise que se resuelve al cerrar la alerta
   */
  error(title: string, message: string, description: string = ""): Promise<any> {
    const modal = this.modalService.open(ModalComponent, {
      backdrop: 'static', // Previene que se cierre al hacer clic fuera
      keyboard: false,    // Previene que se cierre con la tecla Escape
      centered: true,
      windowClass: 'modal-error' // Clase para la ventana modal completa
    });
    modal.componentInstance.title = title;
    modal.componentInstance.message = message;
    modal.componentInstance.description = description;
    modal.componentInstance.modalType = 'error';

    // Manejamos cualquier cierre del modal sin propagar errores
    return new Promise((resolve) => {
      modal.result.then(
        result => resolve(result),
        () => {
          // Ignoramos cualquier rechazo para evitar errores en consola
        }
      );
    });
  }

  /**
   * Muestra una alerta de éxito al usuario
   * @param title Título del modal
   * @param message Mensaje principal a mostrar
   * @param description Descripción adicional (opcional)
   * @returns Promise que se resuelve al cerrar la alerta
   */
  success(title: string, message: string, description: string = ""): Promise<any> {
    const modal = this.modalService.open(ModalComponent, {
      backdrop: 'static', // Previene que se cierre al hacer clic fuera
      keyboard: false,    // Previene que se cierre con la tecla Escape
      centered: true,
      windowClass: 'modal-success' // Clase para la ventana modal completa
    });
    modal.componentInstance.title = title;
    modal.componentInstance.message = message;
    modal.componentInstance.description = description;
    modal.componentInstance.modalType = 'success';

    // Manejamos cualquier cierre del modal sin propagar errores
    return new Promise((resolve) => {
      modal.result.then(
        result => resolve(result),
        () => {
          // Ignoramos cualquier rechazo para evitar errores en consola
        }
      );
    });
  }
}
