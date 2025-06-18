import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * Utilidades para manejo de fechas en el frontend
 */
export class DateUtils {

    /**
     * Convierte un NgbDateStruct a string en formato YYYY-MM-DD
     * @param date Fecha del datepicker de NgBootstrap
     * @returns String en formato YYYY-MM-DD
     */
    static ngbDateToString(date: NgbDateStruct | null): string | null {
        if (!date) return null;

        return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
    }

    /**
     * Convierte una fecha (Date o string) a NgbDateStruct
     * @param date Fecha como Date o string
     * @returns NgbDateStruct para usar en datepicker
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
     * Valida si una fecha string está en formato YYYY-MM-DD
     * @param dateString String de fecha a validar
     * @returns true si el formato es válido
     */
    static isValidDateString(dateString: string): boolean {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    /**
     * Convierte una fecha en formato yyyy-MM-dd a Date respetando la zona horaria local
     * Evita el problema de conversión UTC que causa diferencias de un día
     * 
     * @param dateString Fecha en formato yyyy-MM-dd
     * @returns Date en zona horaria local
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
     * Convierte una fecha (Date o string) a Date asegurando zona horaria local
     * 
     * @param value Fecha como Date o string
     * @returns Date en zona horaria local
     */
    static toLocalDate(value: Date | string | null | undefined): Date {
        if (!value) return new Date();

        if (value instanceof Date) {
            return value;
        }

        return this.parseLocalDate(value);
    }
}
