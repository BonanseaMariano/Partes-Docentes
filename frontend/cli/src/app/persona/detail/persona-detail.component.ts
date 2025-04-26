import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonaService } from '../service/persona.service';
import { ModalService } from '../../modal/modal.service';
import { CommonModule, Location } from '@angular/common';
import { Persona } from '../../models/persona';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-persona-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './persona-detail.component.html',
  styles: `
    .input-group-text {
      width: 100px;
    }
  `
})
export class PersonaDetailComponent implements OnInit {
  persona!: Persona;
  tituloFormulario: string = 'Nueva Persona';

  constructor(
    private route: ActivatedRoute,
    private personaService: PersonaService,
    private location: Location,
    private modalService: ModalService
  ) { }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (typeof this.persona.sexo === 'string' && this.persona.sexo !== '') {
      // Convertir el valor del sexo a un solo carácter
      this.persona.sexo = this.persona.sexo.charAt(0) as any;
    }

    // Asegurarse de que el DNI sea un número al guardar
    if (typeof this.persona.dni === 'string') {
      this.persona.dni = parseInt(this.persona.dni as string);
    }

    this.personaService.save(this.persona).subscribe({
      next: (dataPackage) => {
        if (dataPackage.status !== 200) {
          this.modalService.error(
            "Error al guardar",
            dataPackage.message,
            ""
          );
        } else {
          this.modalService.success(
            "Éxito",
            "Persona guardada correctamente",
            ""
          ).then(() => this.goBack());
        }
      }
    });
  }

  get(): void {
    const dni = this.route.snapshot.paramMap.get("dni")!;
    if (dni === "new") {
      // Inicializar un objeto persona vacío con las propiedades requeridas
      this.persona = {
        dni: '' as any, // Inicializar como string vacío para mostrar el placeholder
        nombre: '',
        apellido: '',
        cuil: '',
        sexo: '',
        designaciones: []
      };
      this.tituloFormulario = 'Nueva Persona';
    } else {
      this.personaService.get(parseInt(dni!)).subscribe({
        next: (dataPackage) => {
          this.persona = <Persona>dataPackage.data;
          this.tituloFormulario = 'Editar Persona';
        }
      });
    }
  }

  ngOnInit(): void {
    this.get();
  }
}
