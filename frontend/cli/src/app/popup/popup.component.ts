import { Component, Input, TemplateRef, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-popup",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./popup.component.html",
  styleUrls: ["./popup.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class PopupComponent {
  @Input() title: string = "";
  @Input() icon: string = ""; // Nueva propiedad para el icono
  @Input() showCloseButton: boolean = true;
  @Input() width: string = "80%";
  @Input() maxWidth: string = "800px";
  @Input() maxHeight: string = "80vh";
  @Input() contentTemplate?: TemplateRef<any>;
  @Input() data: any;
  
  visible: boolean = false;
  
  constructor() { }
  
  // Método para mostrar el popup
  show(): void {
    this.visible = true;
  }
  
  // Método para ocultar el popup
  hide(): void {
    this.visible = false;
  }
  
  // Método para manejar el clic fuera del popup
  onBackdropClick(event: MouseEvent): void {
    // Asegurarse de que el clic fue directamente en el fondo, no en el contenido
    if ((event.target as HTMLElement).classList.contains('popup-backdrop')) {
      this.hide();
    }
  }
}