import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PersonasComponent } from './persona/list/personas.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "personas", component: PersonasComponent },
];
