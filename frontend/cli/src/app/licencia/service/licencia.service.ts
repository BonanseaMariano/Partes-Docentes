import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataPackage } from '../../models/data-package';
import { Licencia } from '../../models/licencia';

@Injectable({
    providedIn: 'root'
})
export class LicenciaService {
    private licenciasUrl = "/rest/licencias";

    constructor(private http: HttpClient) { }

    all(): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(this.licenciasUrl));
    }

    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.licenciasUrl}/${id}`));
    }

    save(licencia: Licencia, isNew: boolean = false): Observable<DataPackage> {
        return isNew
            ? this.http.post<DataPackage>(encodeURI(this.licenciasUrl), licencia)
            : this.http.put<DataPackage>(encodeURI(this.licenciasUrl), licencia);
    }

    remove(id: number): Observable<DataPackage> {
        return this.http.delete<DataPackage>(encodeURI(`${this.licenciasUrl}/${id}`));
    }

    byPage(page: number, size: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(
            encodeURI(`${this.licenciasUrl}/page?page=${page - 1}&size=${size}`)
        );
    }

    search(searchTerm: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.licenciasUrl}/search/${searchTerm}`));
    }

    /**
     * Obtiene el parte diario de licencias para una fecha específica
     * @param fecha Fecha para la cual se requiere el parte diario (formato: YYYY-MM-DD)
     * @returns Observable con el parte diario de licencias
     */
    getParteDiario(fecha: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.licenciasUrl}/parte-diario/${fecha}`));
    }
}
