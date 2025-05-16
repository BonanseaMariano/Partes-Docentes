import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cuilFormat',
    standalone: true
})
export class CuilFormatPipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '';

        // Eliminar cualquier caracter no numérico que pudiera haber
        const numericValue = value.replace(/\D/g, '');

        // Verificar que tenga 11 dígitos (formato estándar de CUIL argentino)
        if (numericValue.length !== 11) {
            return value; // Devolvemos el valor original si no cumple con el formato esperado
        }

        // Formatear como XX-XXXXXXXX-X
        return `${numericValue.substring(0, 2)}-${numericValue.substring(2, 10)}-${numericValue.substring(10)}`;
    }
}