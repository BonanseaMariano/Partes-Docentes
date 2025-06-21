/**
 * @fileoverview Configuración principal de la aplicación Angular para el Sistema de Gestión de Partes Docente.
 * Este archivo contiene la configuración global de la aplicación, incluyendo proveedores de rutas y cliente HTTP.
 * 
 * @description El sistema gestiona la administración de personal docente, control de licencias y generación
 * de partes diarios para instituciones educativas, específicamente diseñado para la Escuela 775 - Puerto Madryn.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from "@angular/common/http";

/**
 * Configuración principal de la aplicación Angular.
 * 
 * Define los proveedores globales necesarios para el funcionamiento de la aplicación,
 * incluyendo el sistema de rutas y el cliente HTTP para comunicación con el backend.
 * 
 * @constant {ApplicationConfig} appConfig - Configuración de la aplicación
 * @property {Provider[]} providers - Array de proveedores de servicios Angular
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Proveedor del sistema de rutas de la aplicación
    provideHttpClient()    // Proveedor del cliente HTTP para comunicación con API REST
  ],
};
