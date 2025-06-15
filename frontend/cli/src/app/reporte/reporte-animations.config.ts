import { ElementAnimationConfig } from '../core/services/animation.service';

/**
 * Configuraciones de animaciones para el componente de reporte individual
 */
export class ReporteAnimations {

    /**
     * Animaciones de entrada inicial del componente
     */
    static readonly INITIAL_ENTRANCE: ElementAnimationConfig[] = [
        {
            selector: '.d-flex.justify-content-between.align-items-center',
            from: { y: -30, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.8,
            ease: "power2.out"
        },
        {
            selector: '.input-group',
            from: { scale: 0.9, opacity: 0 },
            to: { scale: 1, opacity: 1 },
            duration: 0.6,
            delay: 0.2,
            ease: "back.out(1.7)"
        }
    ];

    /**
     * Animaciones para las tarjetas de designaciones
     */
    static readonly DESIGNACIONES_CARDS: ElementAnimationConfig[] = [
        {
            selector: '.card.shadow-sm:first-child',
            from: { y: 30, opacity: 0, scale: 0.95 },
            to: { y: 0, opacity: 1, scale: 1 },
            duration: 0.8,
            ease: "power2.out"
        },
        {
            selector: '.border.rounded.p-3.mb-3',
            from: { x: -20, opacity: 0 },
            to: { x: 0, opacity: 1 },
            duration: 0.6,
            stagger: 0.1,
            delay: 0.3,
            ease: "power2.out"
        },
        {
            selector: '.badge.bg-success',
            from: { scale: 0.8, opacity: 0 },
            to: { scale: 1, opacity: 1 },
            duration: 0.4,
            delay: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }
    ];

    /**
     * Animaciones para las estadísticas
     */
    static readonly STATS_CARDS: ElementAnimationConfig[] = [
        {
            selector: '.card.shadow-sm:last-child',
            from: { y: 30, opacity: 0, scale: 0.95 },
            to: { y: 0, opacity: 1, scale: 1 },
            duration: 0.8,
            ease: "power2.out"
        },
        {
            selector: '.stats-card',
            from: { y: 20, opacity: 0, scale: 0.9 },
            to: { y: 0, opacity: 1, scale: 1 },
            duration: 0.6,
            stagger: 0.1,
            delay: 0.3,
            ease: "power2.out"
        },
        {
            selector: '.calificacion-card',
            from: { scale: 0.8, opacity: 0, rotationY: 180 },
            to: { scale: 1, opacity: 1, rotationY: 0 },
            duration: 0.8,
            delay: 0.6,
            ease: "back.out(1.7)"
        },
        {
            selector: '.stats-card h4',
            from: { scale: 0.5, opacity: 0 },
            to: { scale: 1, opacity: 1 },
            duration: 0.4,
            delay: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }
    ];

    /**
     * Animaciones de transición cuando cambian los datos
     */
    static readonly DATA_TRANSITION_OUT: ElementAnimationConfig[] = [
        {
            selector: '.row',
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
            selector: '.text-center.py-5',
            from: { opacity: 0, scale: 0.9 },
            to: { opacity: 1, scale: 1 },
            duration: 0.5,
            ease: "power2.out"
        },
        {
            selector: '.fa-exclamation-triangle',
            from: { rotationY: 180, scale: 0.5 },
            to: { rotationY: 0, scale: 1 },
            duration: 0.8,
            delay: 0.2,
            ease: "back.out(1.7)"
        }
    ];

    /**
     * Animaciones de error
     */
    static readonly ERROR_DISPLAY: ElementAnimationConfig[] = [
        {
            selector: '.alert-danger',
            from: { x: -20, opacity: 0 },
            to: { x: 0, opacity: 1 },
            duration: 0.5,
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
        designacionCards: {
            selector: '.border.rounded.p-3.mb-3',
            hoverIn: { scale: 1.02, x: 5 },
            hoverOut: { scale: 1, x: 0 },
            config: { duration: 0.3, ease: "power2.out" }
        },
        buttons: {
            selector: '.btn',
            hoverIn: { scale: 1.05 },
            hoverOut: { scale: 1 },
            config: { duration: 0.2, ease: "power2.out" }
        },
        yearSelector: {
            selector: '.form-select',
            hoverIn: { scale: 1.02 },
            hoverOut: { scale: 1 },
            config: { duration: 0.2, ease: "power2.out" }
        }
    };

    /**
     * Animaciones para números contadores
     */
    static readonly COUNTER_ANIMATION = {
        selector: '.counter-number, .stats-card h4',
        animation: {
            duration: 1.5,
            ease: "power2.out"
        }
    };

    /**
     * Configuración de animación de "shake" para errores
     */
    static readonly ERROR_SHAKE = {
        selector: '.alert-danger',
        animation: { x: 8, duration: 0.1, repeat: 3, yoyo: true, delay: 0.5 }
    };

    /**
     * Animaciones para el cambio de año
     */
    static readonly YEAR_CHANGE_TRANSITION: ElementAnimationConfig[] = [
        {
            selector: '.row',
            to: { opacity: 0, y: -10 },
            duration: 0.3,
            ease: "power2.in"
        }
    ];
}
