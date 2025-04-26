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
      backdrop: 'static',
      centered: true
    });
    modal.componentInstance.title = title;
    modal.componentInstance.message = message;
    modal.componentInstance.description = description;
    modal.componentInstance.modalType = 'confirm';
    return modal.result;
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
      backdrop: 'static',
      centered: true
    });
    modal.componentInstance.title = title;
    modal.componentInstance.message = message;
    modal.componentInstance.description = description;
    modal.componentInstance.modalType = 'error';
    return modal.result;
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
      backdrop: 'static',
      centered: true
    });
    modal.componentInstance.title = title;
    modal.componentInstance.message = message;
    modal.componentInstance.description = description;
    modal.componentInstance.modalType = 'success';
    return modal.result;
  }
}
