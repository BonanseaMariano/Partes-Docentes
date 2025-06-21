import { Turno } from "./turno";

/**
 * Interfaz que representa una división escolar en el sistema académico.
 * 
 * Define la estructura organizacional básica de los cursos escolares,
 * incluyendo año de estudio, número de división, orientación académica
 * y turno de funcionamiento. Las divisiones son unidades organizativas
 * fundamentales para la asignación de espacios curriculares y docentes.
 * 
 * @interface Division
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface Division {
    /**
     * Identificador único de la división en el sistema.
     * 
     * Clave primaria autoincremental que identifica unívocamente
     * cada división en la estructura académica institucional.
     */
    id: number;

    /**
     * Año de estudio de la división.
     * 
     * Nivel académico correspondiente al año de cursado en el plan
     * de estudios (ej: 1, 2, 3, 4, 5, 6 para educación secundaria).
     * Determina el nivel de complejidad curricular.
     */
    anio: number;

    /**
     * Número identificatorio de la división dentro del año.
     * 
     * Distingue entre múltiples divisiones del mismo año de estudio
     * (ej: División 1, División 2). Permite organizar grupos paralelos
     * de estudiantes en el mismo nivel académico.
     */
    numDivision: number;

    /**
     * Orientación académica de la división.
     * 
     * Especialización o modalidad educativa que caracteriza el enfoque
     * curricular de la división (ej: "Ciencias Naturales", "Humanidades",
     * "Economía y Administración"). Define el perfil académico específico.
     */
    orientacion: string;

    /**
     * Turno de funcionamiento de la división.
     * 
     * Período del día en que se desarrollan las actividades académicas
     * de la división. Determina los horarios disponibles para
     * programación de espacios curriculares.
     */
    turno: Turno;
}

