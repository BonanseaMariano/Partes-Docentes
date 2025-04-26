import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-modal",
  imports: [CommonModule],
  templateUrl: "./modal.component.html",
  styles: ``,
})
export class ModalComponent {
  constructor(public modal: NgbActiveModal) { }
  title = "";
  message = "";
  description = "";
  modalType: 'confirm' | 'error' | 'success' = 'confirm';

  /**
   * Determina si el modal debe mostrar el botón de cancelar
   * @returns true si debe mostrar el botón de cancelar, false en caso contrario
   */
  get showCancelButton(): boolean {
    return this.modalType === 'confirm';
  }
}
