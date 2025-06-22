
/**
 * Interfaz que representa un parte diario de licencias docentes.
 * 
 * Define la estructura del reporte diario que contiene información
 * de todos los docentes que se encuentran de licencia en una fecha
 * específica. Es fundamental para la gestión operativa diaria de
 * ausencias y planificación de reemplazos en el sistema académico.
 * 
 * @interface ParteDiario
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface ParteDiario {
    /**
     * Fecha de referencia del parte diario.
     * 
     * Día específico para el cual se genera el reporte de licencias,
     * determinando qué docentes están ausentes y requieren cobertura.
     */
    fecha: Date;

    /**
     * Lista completa de docentes en licencia para la fecha especificada.
     * 
     * Arreglo que contiene todos los docentes que tienen licencias
     * vigentes en la fecha del parte, incluyendo detalles de sus
     * licencias y posibles reemplazos asignados.
     */
    docentes: DocenteLicencia[];
}

/**
 * Interfaz que representa a un docente con licencia en el parte diario.
 * 
 * Define la información detallada de un docente que se encuentra
 * de licencia, incluyendo datos personales, tipo de licencia,
 * período de ausencia y información sobre reemplazos disponibles.
 * Es la unidad de información básica para gestión de ausencias.
 * 
 * @interface DocenteLicencia
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface DocenteLicencia {
    /**
     * Documento Nacional de Identidad del docente.
     * 
     * Número único que identifica al docente en el sistema
     * y permite vinculación con otros registros administrativos.
     */
    dni: number;

    /**
     * Nombre de pila del docente en licencia.
     * 
     * Nombres personales del docente para identificación
     * clara en reportes y comunicaciones oficiales.
     */
    nombre: string;

    /**
     * Apellido del docente en licencia.
     * 
     * Apellido familiar para completar la identificación
     * personal del docente ausente.
     */
    apellido: string;

    /**
     * Código del artículo reglamentario que ampara la licencia.
     * 
     * Referencia al marco normativo específico que justifica
     * el tipo de licencia otorgada al docente.
     */
    articulo: string;

    /**
     * Descripción detallada del tipo de licencia.
     * 
     * Texto explicativo del artículo de licencia que proporciona
     * contexto sobre la naturaleza y condiciones de la ausencia.
     */
    descripcion: string;

    /**
     * Fecha de inicio del período de licencia.
     * 
     * Primer día de vigencia de la licencia, determinando
     * desde cuándo el docente está ausente de sus funciones.
     */
    desde: Date;

    /**
     * Fecha de finalización del período de licencia.
     * 
     * Último día de la licencia, estableciendo cuándo el
     * docente debe reincorporarse a sus actividades académicas.
     */
    hasta: Date;

    /**
     * Lista de designaciones que actúan como reemplazos.
     * 
     * Arreglo opcional que contiene información sobre docentes
     * asignados para cubrir las funciones del docente en licencia,
     * facilitando la continuidad académica durante la ausencia.
     */
    reemplazos?: any[];
}
