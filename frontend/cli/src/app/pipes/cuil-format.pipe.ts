import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formateo estándar de números de CUIL/CUIT argentinos.
 * 
 * Transforma números de CUIL/CUIT aplicando el formato estándar argentino
 * con guiones separadores (XX-XXXXXXXX-X). Valida que el número tenga
 * exactamente 11 dígitos y limpia caracteres no numéricos automáticamente.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */
@Pipe({
    name: 'cuilFormat',
    standalone: true
})
export class CuilFormatPipe implements PipeTransform {

    /**
     * Transforma un valor de CUIL/CUIT al formato estándar argentino.
     * 
     * Aplica formato con guiones separadores siguiendo el estándar
     * XX-XXXXXXXX-X. Valida que el número tenga exactamente 11 dígitos
     * y devuelve el valor original si no cumple con el formato esperado.
     * 
     * @param value - Número de CUIL/CUIT a formatear (string, null o undefined)
     * @returns String con el CUIL/CUIT formateado o el valor original si es inválido
     * @example
     * ```typescript
     * // En template: {{ empleado.cuil | cuilFormat }}
     * // "20123456789" → "20-12345678-9"
     * // "12345" → "12345" (valor original, formato inválido)
     * // null → ""
     * ```
     */
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