import { ElementAnimationConfig } from '../core/services/animation.service';

/**
 * Configuraciones de animaciones para el componente de reporte concepto
 */
export class ReporteConceptoAnimations {

    /**
     * Animaciones de entrada inicial del componente
     */
    static readonly INITIAL_ENTRANCE: ElementAnimationConfig[] = [
        {
            selector: '.reporte-header',
            from: { y: -30, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.8,
            ease: "power2.out"
        },
        {
            selector: '.year-selector',
            from: { scale: 0.9, opacity: 0 },
            to: { scale: 1, opacity: 1 },
            duration: 0.6,
            delay: 0.2,
            ease: "back.out(1.7)"
        }
    ];

    /**
     * Animaciones para las estadísticas generales
     */
    static readonly STATS_CARDS: ElementAnimationConfig[] = [
        {
            selector: '.stats-card',
            from: { y: 20, opacity: 0, scale: 0.95 },
            to: { y: 0, opacity: 1, scale: 1 },
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        },
        {
            selector: '.stat-number',
            from: { scale: 0.8, opacity: 0 },
            to: { scale: 1, opacity: 1 },
            duration: 0.4,
            delay: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }
    ];

    /**
     * Animaciones para la tabla de docentes
     */
    static readonly TABLE_ENTRANCE: ElementAnimationConfig[] = [
        {
            selector: '.table-container',
            from: { y: 40, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.8,
            ease: "power2.out"
        },
        {
            selector: '.table thead',
            from: { y: -20, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.6,
            delay: 0.3,
            ease: "power2.out"
        },
        {
            selector: '.table tbody tr',
            from: { x: -20, opacity: 0 },
            to: { x: 0, opacity: 1 },
            duration: 0.4,
            delay: 0.5,
            stagger: 0.05,
            ease: "power2.out"
        }
    ];

    /**
     * Animaciones de transición cuando cambian los datos
     */
    static readonly DATA_TRANSITION_OUT: ElementAnimationConfig[] = [
        {
            selector: '.content-wrapper',
            to: { opacity: 0.3, scale: 0.98 },
            duration: 0.3,
            ease: "power2.in"
        }
    ];

    /**
     * Animación de loading
     */
    static readonly LOADING_ANIMATION: ElementAnimationConfig[] = [
        {
            selector: '.loading-container',
            from: { opacity: 0, scale: 0.9 },
            to: { opacity: 1, scale: 1 },
            duration: 0.5,
            ease: "power2.out"
        }
    ];

    /**
     * Animaciones de error
     */
    static readonly ERROR_DISPLAY: ElementAnimationConfig[] = [
        {
            selector: '.error-alert',
            from: { x: -20, opacity: 0 },
            to: { x: 0, opacity: 1 },
            duration: 0.5,
            ease: "power2.out"
        }
    ];

    /**
     * Animaciones para popups y modales
     */
    static readonly POPUP_ENTRANCE: ElementAnimationConfig[] = [
        {
            selector: '.modal-content',
            from: { scale: 0.9, opacity: 0, y: 20 },
            to: { scale: 1, opacity: 1, y: 0 },
            duration: 0.4,
            ease: "back.out(1.7)"
        },
        {
            selector: '.popup-designation-item',
            from: { x: -20, opacity: 0 },
            to: { x: 0, opacity: 1 },
            duration: 0.3,
            stagger: 0.1,
            delay: 0.2,
            ease: "power2.out"
        }
    ];

    /**
     * Configuraciones de efectos hover
     */
    static readonly HOVER_EFFECTS = {
        statsCards: {
            selector: '.stats-card',
            hoverIn: { scale: 1.05, y: -5 },
            hoverOut: { scale: 1, y: 0 },
            config: { duration: 0.3, ease: "power2.out" }
        },
        tableRows: {
            selector: '.table tbody tr',
            hoverIn: { backgroundColor: '#f8f9fa', x: 5 },
            hoverOut: { backgroundColor: 'transparent', x: 0 },
            config: { duration: 0.2, ease: "power2.out" }
        },
        buttons: {
            selector: '.btn-reporte',
            hoverIn: { scale: 1.05 },
            hoverOut: { scale: 1 },
            config: { duration: 0.2, ease: "power2.out" }
        },
        yearSelector: {
            selector: '.year-selector select',
            hoverIn: { scale: 1.05 },
            hoverOut: { scale: 1 },
            config: { duration: 0.2, ease: "power2.out" }
        }
    };

    /**
     * Animaciones para números contadores
     */
    static readonly COUNTER_ANIMATION = {
        selector: '.counter-number',
        animation: {
            duration: 1.5,
            ease: "power2.out"
        }
    };

    /**
     * Configuración de animación de "shake" para errores
     */
    static readonly ERROR_SHAKE = {
        selector: '.error-alert',
        animation: { x: 8, duration: 0.1, repeat: 3, yoyo: true, delay: 0.5 }
    };

    /**
     * Animaciones para el cambio de año
     */
    static readonly YEAR_CHANGE_TRANSITION: ElementAnimationConfig[] = [
        {
            selector: '.year-content',
            to: { opacity: 0, y: -10 },
            duration: 0.3,
            ease: "power2.in"
        }
    ];
}
