import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataPackage } from '../../models/data-package';
import { Designacion as Licencia } from '../../models/designacion';

@Injectable({
    providedIn: 'root'
})
export class LicenciaService {
    private licenciasUrl = "/rest/licencias";

    constructor(private http: HttpClient) { }

    all(): Observable<DataPackage> {
        return this.http.get<DataPackage>(this.licenciasUrl);
    }

    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(`${this.licenciasUrl}/${id}`);
    }

    save(licencia: Licencia, isNew: boolean = false): Observable<DataPackage> {
        return isNew
            ? this.http.post<DataPackage>(this.licenciasUrl, licencia)
            : this.http.put<DataPackage>(this.licenciasUrl, licencia);
    }

    remove(id: number): Observable<DataPackage> {
        return this.http.delete<DataPackage>(`${this.licenciasUrl}/${id}`);
    }

    byPage(page: number, size: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(
            `${this.licenciasUrl}/page?page=${page - 1}&size=${size}`
        );
    }

    search(searchTerm: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(`${this.licenciasUrl}/search/${searchTerm}`);
    }
}
