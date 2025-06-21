import { Division } from './division';
import { Horario } from './horario';
import { TipoDesignacion } from './tipo-designacion';

/**
 * Interfaz que representa un cargo docente en el sistema académico.
 * 
 * Define la estructura de datos para cargos que pueden ser tanto puestos
 * administrativos como espacios curriculares específicos. Incluye información
 * sobre carga horaria, vigencia, tipo de designación y horarios asociados.
 * Los cargos son la base para las designaciones docentes en el sistema.
 * 
 * @interface Cargo
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface Cargo {
    /**
     * Identificador único del cargo en el sistema.
     * 
     * Clave primaria autoincremental que identifica unívocamente
     * cada cargo en la base de datos académica.
     */
    id: number;

    /**
     * Denominación oficial del cargo o espacio curricular.
     * 
     * Nombre descriptivo que identifica el cargo, puede ser un puesto
     * administrativo (ej: "Director") o una materia específica
     * (ej: "Matemática I").
     */
    nombre: string;

    /**
     * Carga horaria semanal asignada al cargo.
     * 
     * Cantidad de horas pedagógicas que corresponden al cargo
     * por semana académica. Utilizada para cálculos de dedicación
     * y distribución de horarios.
     */
    cargaHoraria: number;

    /**
     * Fecha de inicio de vigencia del cargo.
     * 
     * Fecha a partir de la cual el cargo está disponible para
     * designaciones. Formato: YYYY-MM-DD o objeto Date.
     */
    fechaInicio: Date | string;

    /**
     * Fecha de finalización de vigencia del cargo.
     * 
     * Fecha hasta la cual el cargo permanece activo. Si no se especifica,
     * el cargo tiene vigencia indefinida. Formato: YYYY-MM-DD o objeto Date.
     */
    fechaFin?: Date | string;

    /**
     * Tipo de designación aplicable al cargo.
     * 
     * Especifica si el cargo es para designación como cargo directivo
     * o como espacio curricular, determinando las reglas de asignación
     * y validaciones correspondientes.
     */
    tipoDesignacion: TipoDesignacion;

    /**
     * División académica asociada al cargo.
     * 
     * Referencia a la división (curso/año) donde se imparte el espacio
     * curricular. Solo aplica para cargos de tipo ESPACIO_CURRICULAR.
     * Es opcional para cargos administrativos.
     */
    division?: Division;

    /**
     * Distribución horaria semanal del cargo.
     * 
     * Colección de horarios específicos que definen cuándo se desarrolla
     * la actividad del cargo durante la semana. Incluye día, hora y
     * información complementaria para planificación académica.
     */
    horarios: Horario[];
}

