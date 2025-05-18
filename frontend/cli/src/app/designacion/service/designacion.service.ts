import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataPackage } from '../../models/data-package';
import { Designacion } from '../../models/designacion';

@Injectable({
    providedIn: 'root'
})
export class DesignacionService {
    private designacionesUrl = "/rest/designaciones";

    constructor(private http: HttpClient) { }

    all(): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(this.designacionesUrl));
    }

    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.designacionesUrl}/${id}`));
    }

    save(designacion: Designacion, isNew: boolean = false): Observable<DataPackage> {
        return isNew
            ? this.http.post<DataPackage>(encodeURI(this.designacionesUrl), designacion)
            : this.http.put<DataPackage>(encodeURI(this.designacionesUrl), designacion);
    }

    remove(id: number): Observable<DataPackage> {
        return this.http.delete<DataPackage>(encodeURI(`${this.designacionesUrl}/${id}`));
    }

    byPage(page: number, size: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(
            encodeURI(`${this.designacionesUrl}/page?page=${page - 1}&size=${size}`)
        );
    }

    search(searchTerm: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.designacionesUrl}/search/${searchTerm}`));
    }

    /**
     * Determina si una designación está activa basándose en su fecha de fin
     * @param designacion La designación a evaluar
     * @returns `true` si la designación está activa, `false` en caso contrario
     */
    isActive(designacion: Designacion): boolean {
        // Si no hay fecha de fin o es posterior a la fecha actual, está activa
        if (!designacion.fechaFin) return true;

        const fechaFin = designacion.fechaFin instanceof Date ? designacion.fechaFin : new Date(designacion.fechaFin);
        return fechaFin >= new Date();
    }
}
