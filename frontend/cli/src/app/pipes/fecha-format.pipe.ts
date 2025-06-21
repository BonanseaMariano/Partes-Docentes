import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from '../utils/date-utils';

/**
 * Pipe para formateo de fechas según el estándar argentino.
 * 
 * Transforma valores de fecha a formato dd/mm/YYYY siguiendo las
 * convenciones locales argentinas. Utiliza DateUtils para conversión
 * segura de fechas y maneja diferentes tipos de entrada (Date, string).
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */
@Pipe({
    name: 'fechaFormat',
    standalone: true
})
export class FechaFormatPipe implements PipeTransform {

    /**
     * Transforma una fecha al formato estándar argentino dd/mm/YYYY.
     * 
     * Convierte valores de fecha de diferentes tipos a una representación
     * string consistente. Utiliza DateUtils para manejo seguro de zonas
     * horarias y validación automática de fechas.
     * 
     * @param value - Fecha a formatear (Date, string, null o undefined)
     * @returns String con la fecha formateada o cadena vacía si el valor es inválido
     * @example
     * ```typescript
     * // En template: {{ licencia.fechaInicio | fechaFormat }}
     * // new Date('2024-01-15') → "15/01/2024"
     * // "2024-01-15" → "15/01/2024"
     * // null → ""
     * ```
     */
    transform(value: Date | string | null | undefined): string {
        if (value === null || value === undefined) return '';

        const fecha = DateUtils.toLocalDate(value);

        // Verificar si la fecha es válida
        if (isNaN(fecha.getTime())) return '';

        // Formatear como dd/mm/YYYY según el estándar argentino
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();

        return `${dia}/${mes}/${anio}`;
    }
}
