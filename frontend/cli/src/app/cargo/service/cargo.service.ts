import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cargo } from '../../models/cargo';
import { DataPackage } from '../../models/data-package';

@Injectable({
    providedIn: 'root'
})
export class CargoService {
    private cargosUrl = "/rest/cargos";

    constructor(private http: HttpClient) { }

    all(): Observable<DataPackage> {
        return this.http.get<DataPackage>(this.cargosUrl);
    }

    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(`${this.cargosUrl}/${id}`);
    }

    save(cargo: Cargo, isNew: boolean = false): Observable<DataPackage> {
        return isNew
            ? this.http.post<DataPackage>(this.cargosUrl, cargo)
            : this.http.put<DataPackage>(this.cargosUrl, cargo);
    }

    remove(id: number): Observable<DataPackage> {
        return this.http.delete<DataPackage>(`${this.cargosUrl}/${id}`);
    }

    byPage(page: number, size: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(
            `${this.cargosUrl}/page?page=${page - 1}&size=${size}`
        );
    }

    search(searchTerm: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(`${this.cargosUrl}/search/${searchTerm}`);
    }
}
