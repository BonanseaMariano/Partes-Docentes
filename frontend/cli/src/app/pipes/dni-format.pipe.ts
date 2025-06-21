import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formateo estándar de números de DNI argentinos.
 * 
 * Transforma números de DNI aplicando el formato estándar argentino
 * con puntos separadores (XX.XXX.XXX). Maneja diferentes longitudes
 * de DNI y limpia caracteres no numéricos automáticamente.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */
@Pipe({
    name: 'dniFormat',
    standalone: true
})
export class DniFormatPipe implements PipeTransform {

    /**
     * Transforma un valor de DNI al formato estándar argentino.
     * 
     * Aplica formato con puntos separadores según la longitud del DNI.
     * Limpia automáticamente caracteres no numéricos y maneja valores
     * nulos o indefinidos de manera segura.
     * 
     * @param value - Número de DNI a formatear (number, string, null o undefined)
     * @returns String con el DNI formateado o cadena vacía si el valor es inválido
     * @example
     * ```typescript
     * // En template: {{ persona.dni | dniFormat }}
     * // 12345678 → "12.345.678"
     * // "98765432" → "98.765.432"
     * // null → ""
     * ```
     */
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