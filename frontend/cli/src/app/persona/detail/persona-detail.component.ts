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
    
    this.personaService.save(this.persona).subscribe({
      next: (dataPackage) => {
        if (dataPackage.status !== 200) {
          this.modalService.alert(
            "Error al guardar",
            dataPackage.message,
            ""
          );
        } else {
          this.modalService.alert(
            "Éxito",
            "Persona guardada correctamente",
            ""
          ).then(() => this.goBack());
        }
      },
      error: (err) => {
        this.modalService.alert(
          "Error",
          "Ocurrió un error al guardar la persona",
          err.message
        );
      }
    });
  }

  get(): void {
    const dni = this.route.snapshot.paramMap.get("dni")!;
    if (dni === "new") {
      // Inicializar un objeto persona vacío con las propiedades requeridas
      this.persona = {
        dni: 0,
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
        },
        error: (err) => {
          this.modalService.alert(
            "Error",
            "No se pudo cargar la información de la persona",
            err.message
          ).then(() => this.goBack());
        }
      });
    }
  }

  ngOnInit(): void {
    this.get();
  }
}
