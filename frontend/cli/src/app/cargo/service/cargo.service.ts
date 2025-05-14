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
        return this.http.get<DataPackage>(encodeURI(this.cargosUrl));
    }

    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.cargosUrl}/${id}`));
    }

    save(cargo: Cargo, isNew: boolean = false): Observable<DataPackage> {
        return isNew
            ? this.http.post<DataPackage>(encodeURI(this.cargosUrl), cargo)
            : this.http.put<DataPackage>(encodeURI(this.cargosUrl), cargo);
    }

    remove(id: number): Observable<DataPackage> {
        return this.http.delete<DataPackage>(encodeURI(`${this.cargosUrl}/${id}`));
    }

    byPage(page: number, size: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(
            encodeURI(`${this.cargosUrl}/page?page=${page - 1}&size=${size}`)
        );
    }

    search(searchTerm: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.cargosUrl}/search/${searchTerm}`));
    }

    // El formateo de TipoDesignacion ahora se maneja a través del pipe TipoDesignacionPipe
}
