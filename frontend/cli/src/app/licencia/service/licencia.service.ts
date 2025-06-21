import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataPackage } from '../../models/data-package';
import { Licencia } from '../../models/licencia';

/**
 * Servicio para gestión de licencias y partes diarios del sistema.
 * 
 * Proporciona operaciones CRUD completas para licencias docentes,
 * además de funcionalidades especializadas para generación de partes
 * diarios de licencias por fecha específica.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */
@Injectable({
    providedIn: 'root'
})
export class LicenciaService {
    private licenciasUrl = "/rest/licencias";

    /**
     * Constructor del servicio.
     * 
     * @param http Cliente HTTP de Angular para realizar peticiones al backend
     */
    constructor(private http: HttpClient) { }

    /**
     * Obtiene todas las licencias del sistema.
     * 
     * @returns Observable con el paquete de datos conteniendo la lista completa de licencias
     */
    all(): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(this.licenciasUrl));
    }

    /**
     * Obtiene una licencia específica por su ID.
     * 
     * @param id Identificador único de la licencia
     * @returns Observable con el paquete de datos conteniendo la licencia solicitada
     */
    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.licenciasUrl}/${id}`));
    }

    /**
     * Guarda una licencia en el sistema (creación o actualización).
     * 
     * @param licencia Objeto licencia a guardar
     * @param isNew Indica si es una creación (true) o actualización (false)
     * @returns Observable con el resultado de la operación
     */
    save(licencia: Licencia, isNew: boolean = false): Observable<DataPackage> {
        return isNew
            ? this.http.post<DataPackage>(encodeURI(this.licenciasUrl), licencia)
            : this.http.put<DataPackage>(encodeURI(this.licenciasUrl), licencia);
    }

    /**
     * Elimina una licencia del sistema.
     * 
     * @param id Identificador único de la licencia a eliminar
     * @returns Observable con el resultado de la operación de eliminación
     */
    remove(id: number): Observable<DataPackage> {
        return this.http.delete<DataPackage>(encodeURI(`${this.licenciasUrl}/${id}`));
    }

    /**
     * Obtiene licencias paginadas con ordenamiento personalizable.
     * 
     * @param page Número de página (base 1)
     * @param size Cantidad de elementos por página
     * @param sortField Campo por el cual ordenar (por defecto 'id')
     * @param sortDirection Dirección del ordenamiento ('asc' o 'desc')
     * @returns Observable con la página de licencias solicitada
     */
    byPage(page: number, size: number, sortField: string = 'id', sortDirection: string = 'desc'): Observable<DataPackage> {
        return this.http.get<DataPackage>(
            encodeURI(`${this.licenciasUrl}/page?page=${page - 1}&size=${size}&sortField=${sortField}&sortDirection=${sortDirection}`)
        );
    }

    /**
     * Busca licencias que coincidan con el término de búsqueda.
     * 
     * @param searchTerm Término de búsqueda para filtrar licencias
     * @returns Observable con las licencias que coinciden con la búsqueda
     */
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
