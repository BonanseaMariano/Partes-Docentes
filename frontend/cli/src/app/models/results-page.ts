/**
 * Interfaz que representa una página de resultados paginados del backend.
 * 
 * Define la estructura estándar de respuestas paginadas que retorna
 * el backend Spring Boot, proporcionando metadatos completos sobre
 * la paginación y el contenido de la página actual. Facilita la
 * implementación de navegación paginada en componentes del frontend.
 * 
 * @interface ResultsPage
 * @template T Tipo de elementos contenidos en la página
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface ResultsPage {
    /** Arreglo de elementos contenidos en la página actual */
    content: any[];

    /** Número total de páginas disponibles en el conjunto de resultados */
    totalPages: number;

    /** Número total de elementos en todo el conjunto de resultados */
    totalElements: number;

    /** Indica si esta es la última página del conjunto de resultados */
    last: boolean;

    /** Indica si esta es la primera página del conjunto de resultados */
    first: boolean;

    /** Número de elementos presentes en la página actual */
    numberOfElements: number;

    /** Tamaño configurado de la página (máximo número de elementos por página) */
    size: number;

    /** Número de la página actual (base 0) */
    number: number;
}