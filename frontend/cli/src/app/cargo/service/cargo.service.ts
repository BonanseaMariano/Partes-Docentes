import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Cargo } from '../../models/cargo';
import { DataPackage } from '../../models/data-package';
import { DiaSemana, DiaSemanaLabels, Horario } from '../../models/horario';

@Injectable({
    providedIn: 'root'
})
export class CargoService {
    private cargosUrl = "/rest/cargos";

    constructor(private http: HttpClient) { }

    all(): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(this.cargosUrl))
            .pipe(map(response => this.ensureHorariosArray(response)));
    }

    get(id: number): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.cargosUrl}/${id}`))
            .pipe(map(response => this.ensureHorariosArray(response)));
    }

    save(cargo: Cargo, isNew: boolean = false): Observable<DataPackage> {
        // Asegurarnos que el cargo tiene un array de horarios antes de enviarlo al backend
        if (!cargo.horarios) {
            cargo.horarios = [];
        }

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
        ).pipe(map(response => this.ensureHorariosArray(response)));
    }

    search(searchTerm: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.cargosUrl}/search/${searchTerm}`))
            .pipe(map(response => this.ensureHorariosArray(response)));
    }

    /**
     * Asegura que todos los cargos en la respuesta tienen un array de horarios inicializado
     * @param response Respuesta del servidor
     * @returns La misma respuesta con arrays de horarios inicializados
     */
    private ensureHorariosArray(response: DataPackage): DataPackage {
        // Si la respuesta contiene un único cargo
        if (response.data && typeof response.data === 'object' && 'id' in response.data) {
            const cargo = response.data as Cargo;
            if (!cargo.horarios) {
                cargo.horarios = [];
            }
        }

        // Si la respuesta contiene una lista de cargos (ej: paginación)
        if (response.data && typeof response.data === 'object' && 'content' in response.data) {
            const page = response.data as { content: Cargo[] };
            if (page.content && Array.isArray(page.content)) {
                page.content.forEach(cargo => {
                    if (!cargo.horarios) {
                        cargo.horarios = [];
                    }
                });
            }
        }

        // Si la respuesta es un array de cargos
        if (response.data && Array.isArray(response.data)) {
            (response.data as Cargo[]).forEach(cargo => {
                if (!cargo.horarios) {
                    cargo.horarios = [];
                }
            });
        }

        return response;
    }

    /**
     * Ordena los horarios de un cargo por día y hora
     * @param horarios Lista de horarios a ordenar
     * @returns Lista ordenada de horarios
     */
    orderHorarios(horarios: Horario[]): Horario[] {
        if (!horarios || horarios.length === 0) {
            return [];
        }

        // Orden de los días de la semana según enum DiaSemana
        const daysOrder = {
            [DiaSemana.LUNES]: 1,
            [DiaSemana.MARTES]: 2,
            [DiaSemana.MIERCOLES]: 3,
            [DiaSemana.JUEVES]: 4,
            [DiaSemana.VIERNES]: 5,
            [DiaSemana.SABADO]: 6,
            [DiaSemana.DOMINGO]: 7
        };

        return [...horarios].sort((a, b) => {
            // Primero ordenar por día
            const dayDiffA = daysOrder[a.dia];
            const dayDiffB = daysOrder[b.dia];
            if (dayDiffA !== dayDiffB) return dayDiffA - dayDiffB;

            // Si es el mismo día, ordenar por hora (comparando los strings hora)
            return a.hora.localeCompare(b.hora);
        });
    }

    /**
     * Comprueba si un cargo tiene horarios asignados
     * @param cargo El cargo a comprobar
     * @returns true si el cargo tiene horarios, false en caso contrario
     */
    hasHorarios(cargo: Cargo): boolean {
        return cargo && cargo.horarios && cargo.horarios.length > 0;
    }

    /**
     * Obtiene el nombre para mostrar de un día de la semana
     * @param dia El enum DiaSemana
     * @returns El nombre del día en español para mostrar
     */
    getDiaSemanaLabel(dia: DiaSemana): string {
        return DiaSemanaLabels[dia] || dia;
    }

    /**
     * Agrupa los horarios por día de la semana
     * @param cargo El cargo cuyos horarios se quieren agrupar
     * @returns Un objeto con los días como claves y arrays de horarios como valores
     */
    getHorariosByDay(cargo: Cargo): { [key: string]: Horario[] } {
        if (!cargo || !cargo.horarios || cargo.horarios.length === 0) {
            return {};
        }

        const result: { [key: string]: Horario[] } = {};

        for (const horario of cargo.horarios) {
            // Usamos el nombre para mostrar del día como clave
            const displayName = this.getDiaSemanaLabel(horario.dia);

            if (!result[displayName]) {
                result[displayName] = [];
            }
            result[displayName].push(horario);
        }

        // Ordenar los horarios dentro de cada día
        for (const day in result) {
            result[day].sort((a, b) => a.hora.localeCompare(b.hora));
        }

        return result;
    }
}
