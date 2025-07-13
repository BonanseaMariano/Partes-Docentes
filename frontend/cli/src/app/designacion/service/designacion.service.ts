import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataPackage } from '../../models/data-package';
import { Designacion } from '../../models/designacion';
import { DateUtils } from '../../utils/date-utils';

/**
 * Servicio para gestión de designaciones docentes del sistema.
 * 
 * Proporciona operaciones CRUD completas para designaciones de personal
 * a cargos específicos, incluyendo funcionalidades para determinar el
 * estado de actividad de las designaciones basándose en fechas.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */
@Injectable({
    providedIn: 'root'
})
export class DesignacionService {
    private designacionesUrl = "https://partes-docentes-1.onrender.com/designaciones";

    /**
     * Constructor del servicio.
     * 
     * @param http Cliente HTTP de Angular para realizar peticiones al backend
     */
    constructor(private http: HttpClient) { }

    /**
     * Obtiene todas las designaciones del sistema.
     * 
     * @returns Observable con el paquete de datos conteniendo la lista completa de designaciones
     */
    all(): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(this.designacionesUrl));
    }

    /**
     * Obtiene una designación específica por su ID.
     * 
     * @param id Identificador único de la designación
     * @returns Observable con el paquete de datos conteniendo la designación solicitada
     */
    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.designacionesUrl}/${id}`));
    }

    /**
     * Guarda una designación en el sistema (creación o actualización).
     * 
     * @param designacion Objeto designación a guardar
     * @param isNew Indica si es una creación (true) o actualización (false)
     * @returns Observable con el resultado de la operación
     */
    save(designacion: Designacion, isNew: boolean = false): Observable<DataPackage> {
        return isNew
            ? this.http.post<DataPackage>(encodeURI(this.designacionesUrl), designacion)
            : this.http.put<DataPackage>(encodeURI(this.designacionesUrl), designacion);
    }

    /**
     * Elimina una designación del sistema.
     * 
     * @param id Identificador único de la designación a eliminar
     * @returns Observable con el resultado de la operación de eliminación
     */
    remove(id: number): Observable<DataPackage> {
        return this.http.delete<DataPackage>(encodeURI(`${this.designacionesUrl}/${id}`));
    }

    /**
     * Obtiene designaciones paginadas con ordenamiento personalizable.
     * 
     * @param page Número de página (base 1)
     * @param size Cantidad de elementos por página
     * @param sortField Campo por el cual ordenar (por defecto 'id')
     * @param sortDirection Dirección del ordenamiento ('asc' o 'desc')
     * @returns Observable con la página de designaciones solicitada
     */
    byPage(page: number, size: number, sortField: string = 'id', sortDirection: string = 'desc'): Observable<DataPackage> {
        return this.http.get<DataPackage>(
            encodeURI(`${this.designacionesUrl}/page?page=${page - 1}&size=${size}&sortField=${sortField}&sortDirection=${sortDirection}`)
        );
    }

    /**
     * Busca designaciones que coincidan con el término de búsqueda.
     * 
     * @param searchTerm Término de búsqueda para filtrar designaciones
     * @returns Observable con las designaciones que coinciden con la búsqueda
     */
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

        const fechaFin = DateUtils.toLocalDate(designacion.fechaFin);
        return fechaFin >= new Date();
    }
}
