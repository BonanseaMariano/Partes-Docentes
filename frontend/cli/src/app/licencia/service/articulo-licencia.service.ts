import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticuloLicencia } from '../../models/articulo-licencia';
import { DataPackage } from '../../models/data-package';

/**
 * Servicio para gestión de artículos de licencia del sistema.
 * 
 * Proporciona operaciones CRUD completas para artículos de licencia, incluyendo
 * búsqueda por artículo específico, paginación y consultas especializadas.
 * Este servicio centraliza toda la lógica de comunicación con el backend para
 * la gestión de los artículos que definen los tipos y condiciones de licencias
 * disponibles en el sistema académico.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */
@Injectable({
    providedIn: 'root'
})
export class ArticuloLicenciaService {
    /** URL base para las operaciones REST de artículos de licencia */
    private articulosLicenciasUrl = "/rest/articulos-licencias";

    /**
     * Constructor del servicio ArticuloLicenciaService.
     * 
     * @param http - Cliente HTTP de Angular para comunicación con el backend
     */
    constructor(private http: HttpClient) { }

    /**
     * Obtiene todos los artículos de licencia disponibles en el sistema.
     * 
     * Realiza una consulta general que retorna todos los artículos de licencia
     * sin aplicar filtros o paginación.
     * 
     * @returns Observable que emite un DataPackage con la lista completa de artículos de licencia
     * @example
     * ```typescript
     * this.articuloLicenciaService.all().subscribe(response => {
     *   console.log('Todos los artículos:', response.data);
     * });
     * ```
     */
    all(): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(this.articulosLicenciasUrl));
    }

    /**
     * Obtiene un artículo de licencia específico por su identificador único.
     * 
     * @param id - Identificador único del artículo de licencia a recuperar
     * @returns Observable que emite un DataPackage con el artículo de licencia solicitado
     * @throws Error HTTP si el artículo no existe o no se puede acceder
     * @example
     * ```typescript
     * this.articuloLicenciaService.get(1).subscribe(response => {
     *   console.log('Artículo encontrado:', response.data);
     * });
     * ```
     */
    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.articulosLicenciasUrl}/${id}`));
    }

    /**
     * Busca artículos de licencia por número de artículo específico.
     * 
     * Permite localizar artículos de licencia utilizando su número o código
     * de artículo como criterio de búsqueda.
     * 
     * @param articulo - Número o código del artículo a buscar
     * @returns Observable que emite un DataPackage con los artículos que coinciden
     * @example
     * ```typescript
     * this.articuloLicenciaService.getByArticulo('ART-001').subscribe(response => {
     *   console.log('Artículos encontrados:', response.data);
     * });
     * ```
     */
    getByArticulo(articulo: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.articulosLicenciasUrl}/articulo/${articulo}`));
    }

    /**
     * Guarda un artículo de licencia en el sistema (creación o actualización).
     * 
     * Realiza operaciones de persistencia diferenciando entre creación de nuevos
     * artículos (POST) y actualización de existentes (PUT) basado en el parámetro isNew.
     * 
     * @param articuloLicencia - Objeto ArticuloLicencia con los datos a guardar
     * @param isNew - Indica si es un nuevo artículo (true) o actualización (false). Por defecto false
     * @returns Observable que emite un DataPackage con el artículo guardado y metadatos de operación
     * @example
     * ```typescript
     * const nuevoArticulo = new ArticuloLicencia();
     * this.articuloLicenciaService.save(nuevoArticulo, true).subscribe(response => {
     *   console.log('Artículo creado:', response.data);
     * });
     * ```
     */
    save(articuloLicencia: ArticuloLicencia, isNew: boolean = false): Observable<DataPackage> {
        return isNew
            ? this.http.post<DataPackage>(encodeURI(this.articulosLicenciasUrl), articuloLicencia)
            : this.http.put<DataPackage>(encodeURI(this.articulosLicenciasUrl), articuloLicencia);
    }

    /**
     * Elimina un artículo de licencia del sistema.
     * 
     * Realiza una eliminación lógica o física del artículo especificado,
     * dependiendo de la implementación del backend.
     * 
     * @param id - Identificador único del artículo de licencia a eliminar
     * @returns Observable que emite un DataPackage con confirmación de eliminación
     * @throws Error HTTP si el artículo no puede ser eliminado (ej: tiene dependencias)
     * @example
     * ```typescript
     * this.articuloLicenciaService.remove(1).subscribe(response => {
     *   console.log('Artículo eliminado:', response.message);
     * });
     * ```
     */
    remove(id: number): Observable<DataPackage> {
        return this.http.delete<DataPackage>(encodeURI(`${this.articulosLicenciasUrl}/${id}`));
    }

    /**
     * Obtiene artículos de licencia con paginación.
     * 
     * Implementa consulta paginada para manejo eficiente de grandes volúmenes
     * de datos, permitiendo navegación por páginas específicas.
     * 
     * @param page - Número de página a recuperar (base 1, se convierte automáticamente a base 0 para el backend)
     * @param size - Cantidad de elementos por página
     * @returns Observable que emite un DataPackage con artículos paginados y metadatos de paginación
     * @example
     * ```typescript
     * this.articuloLicenciaService.byPage(1, 10).subscribe(response => {
     *   console.log('Página 1 con 10 elementos:', response.data);
     *   console.log('Total de páginas:', response.totalPages);
     * });
     * ```
     */
    byPage(page: number, size: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(
            encodeURI(`${this.articulosLicenciasUrl}/page?page=${page - 1}&size=${size}`)
        );
    }

    /**
     * Realiza búsqueda de artículos de licencia por término de búsqueda.
     * 
     * Implementa búsqueda flexible que puede incluir múltiples campos como
     * título, descripción, código de artículo u otros criterios definidos en el backend.
     * 
     * @param searchTerm - Término de búsqueda para localizar artículos
     * @returns Observable que emite un DataPackage con artículos que coinciden con el criterio
     * @example
     * ```typescript
     * this.articuloLicenciaService.search('maternidad').subscribe(response => {
     *   console.log('Artículos encontrados:', response.data);
     * });
     * ```
     */
    search(searchTerm: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.articulosLicenciasUrl}/search/${searchTerm}`));
    }
}
