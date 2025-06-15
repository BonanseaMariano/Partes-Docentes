import { ElementAnimationConfig } from '../services/animation.service';

/**
 * Configuraciones base de animaciones reutilizables para toda la aplicación
 */
export class BaseAnimations {

    /**
     * Animaciones comunes de entrada para tarjetas
     */
    static readonly CARD_ENTRANCE: ElementAnimationConfig[] = [
        {
            selector: '.card',
            from: { y: 20, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1
        }
    ];

    /**
     * Animaciones de fade in genéricas
     */
    static readonly FADE_IN: ElementAnimationConfig[] = [
        {
            selector: '.fade-in',
            from: { opacity: 0 },
            to: { opacity: 1 },
            duration: 0.5,
            ease: "power2.out"
        }
    ];

    /**
     * Animaciones de slide up para elementos
     */
    static readonly SLIDE_UP: ElementAnimationConfig[] = [
        {
            selector: '.slide-up',
            from: { y: 30, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.6,
            ease: "power2.out"
        }
    ];

    /**
     * Animaciones de scale para botones y elementos interactivos
     */
    static readonly SCALE_IN: ElementAnimationConfig[] = [
        {
            selector: '.scale-in',
            from: { scale: 0.8, opacity: 0 },
            to: { scale: 1, opacity: 1 },
            duration: 0.4,
            ease: "back.out(1.7)"
        }
    ];

    /**
     * Animaciones de entrada staggered para listas
     */
    static readonly LIST_STAGGER: ElementAnimationConfig[] = [
        {
            selector: '.list-item',
            from: { x: -20, opacity: 0 },
            to: { x: 0, opacity: 1 },
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out"
        }
    ];

    /**
     * Configuraciones de hover comunes
     */
    static readonly HOVER_EFFECTS = {
        buttons: {
            selector: '.btn, .button',
            hoverIn: { scale: 1.05 },
            hoverOut: { scale: 1 },
            config: { duration: 0.2, ease: "power2.out" }
        },
        cards: {
            selector: '.card-hover',
            hoverIn: { y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" },
            hoverOut: { y: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
            config: { duration: 0.3, ease: "power2.out" }
        },
        icons: {
            selector: '.icon-hover',
            hoverIn: { scale: 1.2, rotation: 360 },
            hoverOut: { scale: 1, rotation: 0 },
            config: { duration: 0.3, ease: "back.out(1.7)" }
        }
    };

    /**
     * Animaciones de error comunes
     */
    static readonly ERROR_ANIMATIONS = {
        shake: {
            selector: '.shake-error',
            animation: { x: 10, duration: 0.1, repeat: 5, yoyo: true }
        },
        slideIn: {
            selector: '.error-alert',
            from: { x: -20, opacity: 0 },
            to: { x: 0, opacity: 1 },
            duration: 0.5,
            ease: "power2.out"
        }
    };

    /**
     * Transiciones de página
     */
    static readonly PAGE_TRANSITIONS = {
        fadeOut: {
            selector: '.page-content',
            to: { opacity: 0 },
            duration: 0.3,
            ease: "power2.in"
        },
        fadeIn: {
            selector: '.page-content',
            from: { opacity: 0 },
            to: { opacity: 1 },
            duration: 0.5,
            ease: "power2.out"
        }
    };
}
