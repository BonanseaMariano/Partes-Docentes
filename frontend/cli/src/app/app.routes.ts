import { Routes } from '@angular/router';
import { CargoDetailComponent } from './cargo/detail/cargo-detail.component';
import { CargosComponent } from './cargo/list/cargos.component';
import { DivisionDetailComponent } from './division/detail/division-detail.component';
import { DivisionesComponent } from './division/list/divisiones.component';
import { HomeComponent } from './home/home.component';
import { PersonaDetailComponent } from './persona/detail/persona-detail.component';
import { PersonasComponent } from './persona/list/personas.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "personas", component: PersonasComponent },
    { path: "personas/:dni", component: PersonaDetailComponent },
    { path: "divisiones", component: DivisionesComponent },
    { path: "divisiones/:id", component: DivisionDetailComponent },
    { path: "cargos", component: CargosComponent },
    { path: "cargos/:id", component: CargoDetailComponent },
];
