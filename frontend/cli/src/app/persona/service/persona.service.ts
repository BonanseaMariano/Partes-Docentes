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

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.personasUrl}/${id}`);
  }

  save(persona: Persona, isNew: boolean = false): Observable<DataPackage> {
    return isNew
      ? this.http.post<DataPackage>(this.personasUrl, persona)
      : this.http.put<DataPackage>(this.personasUrl, persona);
  }

  remove(id: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.personasUrl}/${id}`);
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
