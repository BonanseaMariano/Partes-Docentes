import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataPackage } from '../../models/data-package';
import { Division } from '../../models/division';

/**
 * Servicio para gestión de divisiones académicas del sistema.
 * 
 * Proporciona operaciones CRUD completas para divisiones (cursos/grados),
 * incluyendo funcionalidades de paginación y búsqueda para facilitar
 * la administración de la estructura académica institucional.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */
@Injectable({
    providedIn: 'root'
})
export class DivisionService {
    private divisionesUrl = "https://partes-docentes-1.onrender.com/divisiones";

    /**
     * Constructor del servicio.
     * 
     * @param http Cliente HTTP de Angular para realizar peticiones al backend
     */
    constructor(private http: HttpClient) { }

    /**
     * Obtiene todas las divisiones del sistema.
     * 
     * @returns Observable con el paquete de datos conteniendo la lista completa de divisiones
     */
    all(): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(this.divisionesUrl));
    }

    /**
     * Obtiene una división específica por su ID.
     * 
     * @param id Identificador único de la división
     * @returns Observable con el paquete de datos conteniendo la división solicitada
     */
    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.divisionesUrl}/${id}`));
    }

    /**
     * Guarda una división en el sistema (creación o actualización).
     * 
     * @param division Objeto división a guardar
     * @param isNew Indica si es una creación (true) o actualización (false)
     * @returns Observable con el resultado de la operación
     */
    save(division: Division, isNew: boolean = false): Observable<DataPackage> {
        return isNew
            ? this.http.post<DataPackage>(encodeURI(this.divisionesUrl), division)
            : this.http.put<DataPackage>(encodeURI(this.divisionesUrl), division);
    }

    /**
     * Elimina una división del sistema.
     * 
     * @param id Identificador único de la división a eliminar
     * @returns Observable con el resultado de la operación de eliminación
     */
    remove(id: number): Observable<DataPackage> {
        return this.http.delete<DataPackage>(encodeURI(`${this.divisionesUrl}/${id}`));
    }

    /**
     * Obtiene divisiones paginadas con ordenamiento personalizable.
     * 
     * @param page Número de página (base 1)
     * @param size Cantidad de elementos por página
     * @param sortField Campo por el cual ordenar (por defecto 'id')
     * @param sortDirection Dirección del ordenamiento ('asc' o 'desc')
     * @returns Observable con la página de divisiones solicitada
     */
    byPage(page: number, size: number, sortField: string = 'id', sortDirection: string = 'desc'): Observable<DataPackage> {
        return this.http.get<DataPackage>(
            encodeURI(`${this.divisionesUrl}/page?page=${page - 1}&size=${size}&sortField=${sortField}&sortDirection=${sortDirection}`)
        );
    }

    /**
     * Busca divisiones que coincidan con el término de búsqueda.
     * 
     * @param searchTerm Término de búsqueda para filtrar divisiones
     * @returns Observable con las divisiones que coinciden con la búsqueda
     */
    search(searchTerm: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.divisionesUrl}/search/${searchTerm}`));
    }
}
