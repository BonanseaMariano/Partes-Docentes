import { Pipe, PipeTransform } from '@angular/core';
import { TipoDesignacion } from '../models/tipo-designacion';

/**
 * Pipe para formateo legible de tipos de designación académica.
 * 
 * Transforma los valores enum de TipoDesignacion a strings amigables
 * para presentación en la interfaz de usuario. Proporciona una forma
 * consistente de mostrar los tipos de designación en toda la aplicación.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */
@Pipe({
    name: 'tipoDesignacionFormat',
    standalone: true
})
export class TipoDesignacionPipe implements PipeTransform {

    /** Mapeo de valores enum a strings legibles para el usuario */
    private tipoDesignacionMap = {
        [TipoDesignacion.CARGO]: 'Cargo',
        [TipoDesignacion.ESPACIO_CURRICULAR]: 'Espacio Curricular',
    };

    /**
     * Transforma un tipo de designación a formato legible.
     * 
     * Convierte valores del enum TipoDesignacion a strings apropiados
     * para mostrar en la interfaz, manteniendo consistencia visual.
     * 
     * @param tipo - Tipo de designación como string del enum
     * @returns String formateado para mostrar al usuario
     * @example
     * ```typescript
     * // En template: {{ designacion.tipo | tipoDesignacionFormat }}
     * // TipoDesignacion.CARGO → "Cargo"
     * // TipoDesignacion.ESPACIO_CURRICULAR → "Espacio Curricular"
     * ```
     */
    transform(tipo: string): string {
        return this.tipoDesignacionMap[tipo as TipoDesignacion] || tipo;
    }
}
