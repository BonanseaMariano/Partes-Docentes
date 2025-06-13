import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cargo } from '../../models/cargo';
import { DataPackage } from '../../models/data-package';
import { DiaSemana, DiaSemanaLabels, Horario } from '../../models/horario';
import { HorarioDTO } from '../../models/horario-dto';
import { Turno } from '../../models/turno';

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

    byPage(page: number, size: number, sortField: string = 'id', sortDirection: string = 'desc'): Observable<DataPackage> {
        return this.http.get<DataPackage>(
            encodeURI(`${this.cargosUrl}/page?page=${page - 1}&size=${size}&sortField=${sortField}&sortDirection=${sortDirection}`)
        );
    }

    search(searchTerm: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.cargosUrl}/search/${searchTerm}`));
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

            // Si es el mismo día, ordenar por hora (comparando los valores numéricos)
            return a.hora - b.hora;
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
            result[day].sort((a, b) => a.hora - b.hora);
        }

        return result;
    }

    /**
     * Obtiene los horarios de espacios curriculares para un turno y fecha específicos
     * @param turno Turno para filtrar las divisiones
     * @param fecha Fecha para verificar la vigencia de cargos y designaciones (formato: yyyy-MM-dd)
     * @returns Observable con los horarios organizados en una grilla semanal
     */
    obtenerHorarios(turno: Turno, fecha: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(encodeURI(`${this.cargosUrl}/horarios/${turno}/${fecha}`));
    }
}
