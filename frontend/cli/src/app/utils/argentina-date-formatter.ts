import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * Formateador personalizado para NgBootstrap DatePicker que usa el formato argentino dd/mm/yyyy
 * 
 * Para usar este formateador en un componente, agregarlo en los providers:
 * 
 * @Component({
 *   providers: [
 *     { provide: NgbDateParserFormatter, useClass: ArgentinaDateParserFormatter }
 *   ]
 * })
 * 
 * Características:
 * - Muestra las fechas en formato dd/mm/yyyy
 * - Acepta entrada en formatos dd/mm/yyyy, dd/mm/yy
 * - Acepta separadores: / - .
 * - Valida días válidos por mes
 * - Maneja años de 2 dígitos (asume 20xx)
 */
@Injectable()
export class ArgentinaDateParserFormatter extends NgbDateParserFormatter {

    /**
     * Convierte un NgbDateStruct a string en formato dd/mm/yyyy
     */
    format(date: NgbDateStruct | null): string {
        if (!date) return '';

        const day = String(date.day).padStart(2, '0');
        const month = String(date.month).padStart(2, '0');
        const year = date.year;

        return `${day}/${month}/${year}`;
    }

    /**
     * Convierte un string en formato dd/mm/yyyy a NgbDateStruct
     */
    parse(value: string): NgbDateStruct | null {
        if (!value) return null;

        // Remover espacios en blanco
        value = value.trim();

        // Intentar parsear formato dd/mm/yyyy o dd/mm/yy
        // También acepta separadores como - o .
        const dateRegex = /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/;
        const match = value.match(dateRegex);

        if (match) {
            const day = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            let year = parseInt(match[3], 10);

            // Si el año es de 2 dígitos, asumir que está en el rango 2000-2099
            if (year < 100) {
                year += 2000;
            }

            // Validaciones básicas
            if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
                // Validación adicional para días válidos por mes (simplificada)
                const daysInMonth = new Date(year, month, 0).getDate();
                if (day <= daysInMonth) {
                    return { day, month, year };
                }
            }
        }

        return null;
    }
}
