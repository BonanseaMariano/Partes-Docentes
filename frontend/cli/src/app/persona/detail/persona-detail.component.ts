import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as AOS from 'aos';
import { ModalService } from '../../modal/modal.service';
import { Persona } from '../../models/persona';
import { PersonaService } from '../service/persona.service';

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
  isNewPerson: boolean = true;

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

    this.personaService.save(this.persona, this.isNewPerson).subscribe({
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
            dataPackage.message,
            ""
          ).then(() => this.goBack());
        }
      }
    });
  }

  get(): void {
    const id = this.route.snapshot.paramMap.get("id")!;
    if (id === "new") {
      // Inicializar la persona con valores vacíos
      this.persona = <Persona>{
        sexo: '',
      };
      this.tituloFormulario = 'Nueva Persona';
      this.isNewPerson = true;  // Es una nueva persona
    } else {
      this.personaService.get(parseInt(id!)).subscribe({
        next: (dataPackage) => {
          this.persona = <Persona>dataPackage.data;
          this.tituloFormulario = 'Editar Persona';
          this.isNewPerson = false;  // Es una persona existente
        }
      });
    }
  }

  ngOnInit(): void {
    // Inicializar AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });

    this.get();
  }
}
