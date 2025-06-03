import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataPackage } from '../../models/data-package';
import { Persona } from '../../models/persona';
import { ReporteConceptoResponse } from '../../models/reporte-concepto';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private personasUrl = "/rest/personas";

  constructor(private http: HttpClient) { }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(encodeURI(this.personasUrl));
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(encodeURI(`${this.personasUrl}/${id}`));
  }

  save(persona: Persona, isNew: boolean = false): Observable<DataPackage> {
    return isNew
      ? this.http.post<DataPackage>(encodeURI(this.personasUrl), persona)
      : this.http.put<DataPackage>(encodeURI(this.personasUrl), persona);
  }

  remove(id: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(encodeURI(`${this.personasUrl}/${id}`));
  }

  byPage(page: number, size: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(
      encodeURI(`${this.personasUrl}/page?page=${page - 1}&size=${size}`)
    );
  }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(encodeURI(`${this.personasUrl}/search/${searchTerm}`));
  }

  /**
   * Obtiene el reporte de concepto para un docente en un año específico
   * @param dni DNI del docente
   * @param anio Año del reporte
   * @returns Observable con la respuesta del reporte
   */
  obtenerReporteConcepto(dni: number, anio: number): Observable<ReporteConceptoResponse> {
    return this.http.get<ReporteConceptoResponse>(encodeURI(`${this.personasUrl}/${dni}/reporte/${anio}`));
  }
}
