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

        const fechaDate = date instanceof Date ? date : new Date(date);

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
}
