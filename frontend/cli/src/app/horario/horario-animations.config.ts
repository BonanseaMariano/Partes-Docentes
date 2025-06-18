import { ElementAnimationConfig } from '../core/services/animation.service';

/**
 * Configuraciones de animaciones para el componente de horarios
 */
export class HorarioAnimations {

    /**
     * Animaciones de entrada inicial del componente
     */
    static readonly INITIAL_ENTRANCE: ElementAnimationConfig[] = [
        {
            selector: '.animated-header',
            from: { y: -50, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.8,
            ease: "power2.out"
        },
        {
            selector: '.initial-filters',
            from: { scale: 0.9, opacity: 0 },
            to: { scale: 1, opacity: 1 },
            duration: 0.6,
            delay: 0.2,
            ease: "back.out(1.7)"
        }
    ];

    /**
     * Animaciones de la grilla de horarios
     */
    static readonly SCHEDULE_GRID: ElementAnimationConfig[] = [
        {
            selector: '.horario-card',
            from: { opacity: 0, scale: 0.95 },
            to: { opacity: 1, scale: 1 },
            duration: 0.6,
            ease: "power2.out"
        },
        {
            selector: '.horario-header tr',
            from: { y: -20, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.5,
            delay: 0.3,
            ease: "power2.out"
        },
        {
            selector: '.horario-row',
            from: { x: -30, opacity: 0 },
            to: { x: 0, opacity: 1 },
            duration: 0.4,
            delay: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        },
        {
            selector: '.espacio-curricular',
            from: { scale: 0.8, opacity: 0, y: 10 },
            to: { scale: 1, opacity: 1, y: 0 },
            duration: 0.3,
            delay: 0.8,
            stagger: { amount: 0.6, from: "start" },
            ease: "back.out(1.7)"
        }
    ];

    /**
     * Animación de transición entre datos
     */
    static readonly DATA_TRANSITION_OUT: ElementAnimationConfig[] = [
        {
            selector: '.horario-card',
            to: { opacity: 0.3, scale: 0.98 },
            duration: 0.3,
            ease: "power2.in"
        }
    ];

    /**
     * Animación de error
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
        espaciosCurriculares: {
            selector: '.espacio-curricular',
            hoverIn: { scale: 1.05 },
            hoverOut: { scale: 1 },
            config: { duration: 0.2, ease: "power2.out" }
        },
        horasBadges: {
            selector: '.hora-badge',
            hoverIn: { scale: 1.1 },
            hoverOut: { scale: 1 },
            config: { duration: 0.3, ease: "back.out(1.7)" }
        }
    };

    /**
     * Configuración de animación de "shake" para errores
     */
    static readonly ERROR_SHAKE = {
        selector: '.alert-danger',
        animation: { x: 5, duration: 0.1, repeat: 3, yoyo: true, delay: 0.5 }
    };
}
