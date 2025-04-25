import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataPackage } from '../../models/data-package';
import { Persona } from '../../models/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private personasUrl = "/rest/personas";

  constructor(private http: HttpClient) { }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(this.personasUrl);
  }

  get(dni: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.personasUrl}/${dni}`);
  }

  save(persona: Persona): Observable<DataPackage> {
    return persona.dni
      ? this.http.put<DataPackage>(this.personasUrl, persona)
      : this.http.post<DataPackage>(this.personasUrl, persona);
  }

  remove(dni: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.personasUrl}/${dni}`);
  }

  byPage(page: number, size: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(
      `${this.personasUrl}/page?page=${page - 1}&size=${size}`
    );
  }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.personasUrl}/search/${searchTerm}`);
  }
}
