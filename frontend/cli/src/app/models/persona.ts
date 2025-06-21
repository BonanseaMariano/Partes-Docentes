import { Designacion } from './designacion';

/**
 * Interfaz que representa una persona docente en el sistema académico.
 * 
 * Define la estructura de datos para personas que pueden tener designaciones
 * en cargos docentes o espacios curriculares. Incluye información personal
 * básica, datos de contacto y relaciones con designaciones académicas.
 * Es la entidad central para la gestión de recursos humanos docentes.
 * 
 * @interface Persona
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface Persona {

    /**
     * Identificador único de la persona en el sistema.
     * 
     * Clave primaria autoincremental que identifica unívocamente
     * a cada persona en la base de datos.
     */
    id: number;

    /**
     * Documento Nacional de Identidad de la persona.
     * 
     * Número único e irrepetible que identifica a la persona según
     * el registro civil argentino. Campo obligatorio y único en el sistema.
     */
    dni: number;

    /**
     * Código Único de Identificación Laboral.
     * 
     * Identificador único utilizado por ANSES para identificación
     * tributaria y laboral. Formato: XX-XXXXXXXX-X. Campo obligatorio.
     */
    cuil: string;

    /**
     * Nombre completo de la persona.
     * 
     * Nombres de pila de la persona según documento de identidad.
     * Campo obligatorio para identificación personal.
     */
    nombre: string;

    /**
     * Apellido completo de la persona.
     * 
     * Apellido familiar según documento de identidad.
     * Campo obligatorio para identificación personal.
     */
    apellido: string;

    /**
     * Título académico o profesional de la persona.
     * 
     * Título de grado, posgrado o formación profesional relevante
     * para el desempeño docente. Campo opcional.
     */
    titulo?: string;

    /**
     * Sexo biológico de la persona.
     * 
     * Información demográfica utilizada para estadísticas
     * y cumplimiento de normativas de género. Campo opcional.
     */
    sexo?: string;

    /**
     * Domicilio particular de la persona.
     * 
     * Dirección de residencia habitual para correspondencia
     * y comunicaciones oficiales. Campo opcional.
     */
    domicilio?: string;

    /**
     * Número de teléfono de contacto.
     * 
     * Teléfono fijo o móvil para comunicaciones urgentes
     * y notificaciones del sistema. Campo opcional.
     */
    telefono?: string;

    /**
     * Lista de designaciones académicas asociadas a la persona.
     * 
     * Colección de todas las designaciones en cargos docentes
     * y espacios curriculares que tiene o ha tenido la persona.
     * Incluye designaciones activas e históricas.
     */
    designaciones: Designacion[];
}