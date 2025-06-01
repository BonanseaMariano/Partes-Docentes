import { Routes } from '@angular/router';
import { CargoDetailComponent } from './cargo/detail/cargo-detail.component';
import { CargosComponent } from './cargo/list/cargos.component';
import { DivisionDetailComponent } from './division/detail/division-detail.component';
import { DivisionesComponent } from './division/list/divisiones.component';
import { HomeComponent } from './home/home.component';
import { PersonaDetailComponent } from './persona/detail/persona-detail.component';
import { PersonasComponent } from './persona/list/personas.component';
import { DesignacionesComponent } from './designacion/list/designaciones.component';
import { DesignacionDetailComponent } from './designacion/detail/designacion-detail.component';
import { LicenciasComponent } from './licencia/list/licencias.component';
import { LicenciaDetailComponent } from './licencia/detail/licencia-detail.component';
import { ParteDiarioComponent } from './parte-diario/parte-diario.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "personas", component: PersonasComponent },
    { path: "personas/:id", component: PersonaDetailComponent },
    { path: "divisiones", component: DivisionesComponent },
    { path: "divisiones/:id", component: DivisionDetailComponent },
    { path: "cargos", component: CargosComponent },
    { path: "cargos/:id", component: CargoDetailComponent },
    { path: "designaciones", component: DesignacionesComponent },
    { path: "designaciones/:id", component: DesignacionDetailComponent },
    { path: "licencias", component: LicenciasComponent },
    { path: "licencias/parte-diario/:fecha", component: ParteDiarioComponent },
    { path: "licencias/:id", component: LicenciaDetailComponent },
];
