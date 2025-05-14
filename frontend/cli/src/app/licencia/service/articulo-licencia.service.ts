import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticuloLicencia } from '../../models/articulo-licencia';
import { DataPackage } from '../../models/data-package';

@Injectable({
    providedIn: 'root'
})
export class ArticuloLicenciaService {
    private articulosLicenciasUrl = "/rest/articulos-licencias";

    constructor(private http: HttpClient) { }

    all(): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(this.articulosLicenciasUrl));
    }

    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.articulosLicenciasUrl}/${id}`));
    }

    getByArticulo(articulo: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.articulosLicenciasUrl}/articulo/${articulo}`));
    }

    save(articuloLicencia: ArticuloLicencia, isNew: boolean = false): Observable<DataPackage> {
        return isNew
            ? this.http.post<DataPackage>(encodeURI(this.articulosLicenciasUrl), articuloLicencia)
            : this.http.put<DataPackage>(encodeURI(this.articulosLicenciasUrl), articuloLicencia);
    }

    remove(id: number): Observable<DataPackage> {
        return this.http.delete<DataPackage>(encodeURI(`${this.articulosLicenciasUrl}/${id}`));
    }

    byPage(page: number, size: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(
            encodeURI(`${this.articulosLicenciasUrl}/page?page=${page - 1}&size=${size}`)
        );
    }

    search(searchTerm: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.articulosLicenciasUrl}/search/${searchTerm}`));
    }
}
