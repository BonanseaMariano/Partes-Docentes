import { Pipe, PipeTransform } from '@angular/core';
import { TipoDesignacion } from '../models/tipo-designacion';

/**
 * Pipe para formatear los tipos de designación de manera amigable al usuario
 * Uso: {{ tipoDesignacion | tipoDesignacionFormat }}
 */
@Pipe({
    name: 'tipoDesignacionFormat',
    standalone: true
})
export class TipoDesignacionPipe implements PipeTransform {
    private tipoDesignacionMap = {
        [TipoDesignacion.CARGO]: 'Cargo',
        [TipoDesignacion.ESPACIO_CURRICULAR]: 'Espacio Curricular',
    };

    transform(tipo: string): string {
        return this.tipoDesignacionMap[tipo as TipoDesignacion] || tipo;
    }
}
