/**
 * Enumeración de turnos académicos disponibles en el sistema.
 * 
 * Define los períodos del día en que se pueden desarrollar actividades
 * académicas, determinando los horarios disponibles para divisiones
 * y espacios curriculares. Cada turno tiene asociados rangos horarios
 * específicos que condicionan la programación académica.
 * 
 * @enum Turno
 * @author Mariano Bonansea
 * @version 1.0
 */
export enum Turno {
    /** Turno matutino - Aproximadamente de 7:00 a 12:00 horas */
    MANIANA = 'Mañana',

    /** Turno de tarde - Aproximadamente de 13:00 a 18:00 horas */
    TARDE = 'Tarde',

    /** Turno vespertino - Aproximadamente de 18:00 a 22:00 horas */
    VESPERTINO = 'Vespertino',

    /** Turno nocturno - Aproximadamente de 19:00 a 23:00 horas */
    NOCHE = 'Noche'
}