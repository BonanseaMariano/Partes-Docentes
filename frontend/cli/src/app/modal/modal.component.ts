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
  alertMode = false; // Para indicar que es solo alerta sin confirmación
}
