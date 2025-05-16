import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dniFormat',
    standalone: true
})
export class DniFormatPipe implements PipeTransform {
    transform(value: number | string | null | undefined): string {
        if (value === null || value === undefined) return '';

        // Convertir a string si es un número
        const stringValue = value.toString();

        // Eliminar cualquier caracter no numérico
        const numericValue = stringValue.replace(/\D/g, '');

        // Si el DNI no tiene suficientes dígitos, devolver el valor original
        if (numericValue.length < 1) return stringValue;

        // Formatear según la longitud del DNI (considerando que puede variar)
        if (numericValue.length <= 2) {
            return numericValue;
        } else if (numericValue.length <= 5) {
            return `${numericValue.substring(0, 2)}.${numericValue.substring(2)}`;
        } else {
            return `${numericValue.substring(0, 2)}.${numericValue.substring(2, 5)}.${numericValue.substring(5)}`;
        }
    }
}