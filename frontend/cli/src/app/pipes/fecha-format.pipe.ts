import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from '../utils/date-utils';

@Pipe({
    name: 'fechaFormat',
    standalone: true
})
export class FechaFormatPipe implements PipeTransform {
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
