import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataPackage } from '../../models/data-package';
import { Division } from '../../models/division';

@Injectable({
    providedIn: 'root'
})
export class DivisionService {
    private divisionesUrl = "/rest/divisiones";

    constructor(private http: HttpClient) { }

    all(): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(this.divisionesUrl));
    }

    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.divisionesUrl}/${id}`));
    }

    save(division: Division, isNew: boolean = false): Observable<DataPackage> {
        return isNew
            ? this.http.post<DataPackage>(encodeURI(this.divisionesUrl), division)
            : this.http.put<DataPackage>(encodeURI(this.divisionesUrl), division);
    }

    remove(id: number): Observable<DataPackage> {
        return this.http.delete<DataPackage>(encodeURI(`${this.divisionesUrl}/${id}`));
    }

    byPage(page: number, size: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(
            encodeURI(`${this.divisionesUrl}/page?page=${page - 1}&size=${size}`)
        );
    }

    search(searchTerm: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.divisionesUrl}/search/${searchTerm}`));
    }
}
