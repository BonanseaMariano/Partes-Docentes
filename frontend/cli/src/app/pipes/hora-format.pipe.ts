import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'horaFormat',
    standalone: true
})
export class HoraFormatPipe implements PipeTransform {
    /**
     * Formatea una hora en formato HH:MM:SS o HH:MM a HH:MM hs
     * @param value La hora en formato HH:MM:SS o HH:MM
     * @returns La hora formateada como "HH:MM hs"
     */
    transform(value: string): string {
        if (!value) {
            return '';
        }

        // Si la hora viene en formato HH:MM:SS, extraemos solo HH:MM
        const parts = value.split(':');
        if (parts.length >= 2) {
            return `${parts[0]}:${parts[1]} hs`;
        }

        // Si no tiene el formato esperado, devolvemos el valor original
        return `${value} hs`;
    }
}
