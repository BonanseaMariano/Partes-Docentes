
/**
 * Modelo que representa un parte diario con la información de los docentes en licencia para una fecha específica
 */
export interface ParteDiario {
    /**
     * Fecha del parte diario
     */
    fecha: Date;

    /**
     * Lista de docentes en licencia para la fecha especificada
     */
    docentes: DocenteLicencia[];
}

/**
 * Modelo que representa a un docente con licencia dentro de un parte diario
 */
export interface DocenteLicencia {
    /**
     * DNI del docente
     */
    dni: number;

    /**
     * Nombre del docente
     */
    nombre: string;

    /**
     * Apellido del docente
     */
    apellido: string;

    /**
     * Artículo aplicado a la licencia
     */
    articulo: string;

    /**
     * Descripción de la licencia
     */
    descripcion: string;

    /**
     * Fecha de inicio de la licencia
     */
    desde: Date;

    /**
     * Fecha de finalización de la licencia
     */
    hasta: Date;

    /**
     * Lista de designaciones que actúan como reemplazos
     */
    reemplazos?: any[];
}
