import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * Clase de utilidades para manejo seguro y consistente de fechas en el frontend.
 * 
 * Proporciona métodos estáticos para conversión entre diferentes formatos de fecha,
 * manejo de zonas horarias locales, validación de fechas y integración con 
 * componentes de NgBootstrap. Resuelve problemas comunes de conversión UTC
 * y asegura consistencia en el manejo de fechas a través de toda la aplicación.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */
export class DateUtils {

    /**
     * Convierte un NgbDateStruct a string en formato ISO (YYYY-MM-DD).
     * 
     * Transforma la estructura de fecha de NgBootstrap a formato string
     * estándar para comunicación con el backend o almacenamiento.
     * 
     * @param date - Estructura de fecha del datepicker de NgBootstrap
     * @returns String en formato YYYY-MM-DD o null si la fecha es inválida
     * @example
     * ```typescript
     * const ngbDate = { year: 2024, month: 1, day: 15 };
     * const dateString = DateUtils.ngbDateToString(ngbDate);
     * // Resultado: "2024-01-15"
     * ```
     */
    static ngbDateToString(date: NgbDateStruct | null): string | null {
        if (!date) return null;

        return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
    }

    /**
     * Convierte una fecha (Date o string) a estructura NgbDateStruct.
     * 
     * Transforma fechas de diferentes formatos a la estructura requerida
     * por los datepickers de NgBootstrap, manejando zonas horarias locales.
     * 
     * @param date - Fecha como Date, string, null o undefined
     * @returns NgbDateStruct para usar en datepicker o null si es inválida
     * @example
     * ```typescript
     * const date = new Date('2024-01-15');
     * const ngbDate = DateUtils.dateToNgbDate(date);
     * // Resultado: { year: 2024, month: 1, day: 15 }
     * ```
     */
    static dateToNgbDate(date: Date | string | null | undefined): NgbDateStruct | null {
        if (!date) return null;

        const fechaDate = this.toLocalDate(date);

        if (isNaN(fechaDate.getTime())) return null;

        return {
            year: fechaDate.getFullYear(),
            month: fechaDate.getMonth() + 1,
            day: fechaDate.getDate()
        };
    }

    /**
     * Valida si una fecha string cumple con el formato YYYY-MM-DD.
     * 
     * Verifica tanto el formato mediante regex como la validez de la fecha
     * para prevenir fechas inexistentes como 2024-02-30.
     * 
     * @param dateString - String de fecha a validar
     * @returns true si el formato y la fecha son válidos, false en caso contrario
     * @example
     * ```typescript
     * DateUtils.isValidDateString('2024-01-15'); // true
     * DateUtils.isValidDateString('2024-13-01'); // false (mes inválido)
     * DateUtils.isValidDateString('invalid');     // false
     * ```
     */
    static isValidDateString(dateString: string): boolean {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    /**
     * Convierte una fecha en formato yyyy-MM-dd a Date respetando zona horaria local.
     * 
     * Resuelve el problema común de conversión UTC que puede causar diferencias
     * de un día cuando el string se interpreta en UTC en lugar de hora local.
     * Maneja tanto fechas simples (YYYY-MM-DD) como timestamps ISO completos.
     * 
     * @param dateString - Fecha en formato yyyy-MM-dd o ISO con timezone
     * @returns Date en zona horaria local
     * @example
     * ```typescript
     * const date = DateUtils.parseLocalDate('2024-01-15');
     * // Resultado: Date representando 2024-01-15 en hora local
     * ```
     */
    static parseLocalDate(dateString: string | null | undefined): Date {
        if (!dateString) return new Date();

        // Si es formato ISO con tiempo, usar Date constructor normal
        if (dateString.includes('T')) {
            return new Date(dateString);
        }

        // Para fechas en formato yyyy-MM-dd, parsing local
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // month es 0-indexado en JavaScript
    }

    /**
     * Convierte cualquier valor de fecha a Date asegurando zona horaria local.
     * 
     * Método universal que maneja diferentes tipos de entrada (Date, string)
     * y garantiza que el resultado sea un objeto Date válido en zona horaria local.
     * 
     * @param value - Fecha como Date, string, null o undefined
     * @returns Date en zona horaria local o fecha actual si el valor es inválido
     * @example
     * ```typescript
     * const date1 = DateUtils.toLocalDate('2024-01-15');
     * const date2 = DateUtils.toLocalDate(new Date());
     * const date3 = DateUtils.toLocalDate(null); // Retorna new Date()
     * ```
     */
    static toLocalDate(value: Date | string | null | undefined): Date {
        if (!value) return new Date();

        if (value instanceof Date) {
            return value;
        }

        return this.parseLocalDate(value);
    }
}
