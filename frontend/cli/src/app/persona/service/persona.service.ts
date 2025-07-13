import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataPackage } from '../../models/data-package';
import { Persona } from '../../models/persona';
import { ReporteResponse } from '../../models/reporte';

/**
 * Servicio para gestión de personas y generación de reportes del sistema.
 * 
 * Proporciona operaciones CRUD completas para personas (docentes y personal),
 * además de funcionalidades especializadas para generación de reportes
 * individuales y de concepto general por año académico.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private personasUrl = "https://partes-docentes-1.onrender.com/personas";

  /**
   * Constructor del servicio.
   * 
   * @param http Cliente HTTP de Angular para realizar peticiones al backend
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las personas del sistema.
   * 
   * @returns Observable con el paquete de datos conteniendo la lista completa de personas
   */
  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(encodeURI(this.personasUrl));
  }

  /**
   * Obtiene una persona específica por su ID.
   * 
   * @param id Identificador único de la persona
   * @returns Observable con el paquete de datos conteniendo la persona solicitada
   */
  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(encodeURI(`${this.personasUrl}/${id}`));
  }

  /**
   * Guarda una persona en el sistema (creación o actualización).
   * 
   * @param persona Objeto persona a guardar
   * @param isNew Indica si es una creación (true) o actualización (false)
   * @returns Observable con el resultado de la operación
   */
  save(persona: Persona, isNew: boolean = false): Observable<DataPackage> {
    return isNew
      ? this.http.post<DataPackage>(encodeURI(this.personasUrl), persona)
      : this.http.put<DataPackage>(encodeURI(this.personasUrl), persona);
  }

  /**
   * Elimina una persona del sistema.
   * 
   * @param id Identificador único de la persona a eliminar
   * @returns Observable con el resultado de la operación de eliminación
   */
  remove(id: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(encodeURI(`${this.personasUrl}/${id}`));
  }

  /**
   * Obtiene personas paginadas con ordenamiento personalizable.
   * 
   * @param page Número de página (base 1)
   * @param size Cantidad de elementos por página
   * @param sortField Campo por el cual ordenar (por defecto 'id')
   * @param sortDirection Dirección del ordenamiento ('asc' o 'desc')
   * @returns Observable con la página de personas solicitada
   */
  byPage(page: number, size: number, sortField: string = 'id', sortDirection: string = 'desc'): Observable<DataPackage> {
    return this.http.get<DataPackage>(
      encodeURI(`${this.personasUrl}/page?page=${page - 1}&size=${size}&sortField=${sortField}&sortDirection=${sortDirection}`)
    );
  }

  /**
   * Busca personas que coincidan con el término de búsqueda.
   * 
   * @param searchTerm Término de búsqueda para filtrar personas
   * @returns Observable con las personas que coinciden con la búsqueda
   */
  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(encodeURI(`${this.personasUrl}/search/${searchTerm}`));
  }

  /**
   * Obtiene el reporte para un docente en un año específico
   * @param dni DNI del docente
   * @param anio Año del reporte
   * @returns Observable con la respuesta del reporte
   */
  obtenerReporte(dni: number, anio: number): Observable<ReporteResponse> {
    return this.http.get<ReporteResponse>(encodeURI(`${this.personasUrl}/dni/${dni}/reporte/${anio}`));
  }

  /**
   * Obtiene el reporte de concepto general para un año específico
   * @param anio Año del reporte
   * @returns Observable con la respuesta del reporte de concepto
   */
  obtenerReporteConcepto(anio: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(encodeURI(`${this.personasUrl}/reporte-concepto/${anio}`));
  }
}
