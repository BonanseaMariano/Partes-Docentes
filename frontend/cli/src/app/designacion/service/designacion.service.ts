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
        return this.http.get<DataPackage>(this.designacionesUrl);
    }

    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(`${this.designacionesUrl}/${id}`);
    }

    save(designacion: Designacion, isNew: boolean = false): Observable<DataPackage> {
        return isNew
            ? this.http.post<DataPackage>(this.designacionesUrl, designacion)
            : this.http.put<DataPackage>(this.designacionesUrl, designacion);
    }

    remove(id: number): Observable<DataPackage> {
        return this.http.delete<DataPackage>(`${this.designacionesUrl}/${id}`);
    }

    byPage(page: number, size: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(
            `${this.designacionesUrl}/page?page=${page - 1}&size=${size}`
        );
    }

    search(searchTerm: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(`${this.designacionesUrl}/search/${searchTerm}`);
    }
}
