import { Injectable, ElementRef } from '@angular/core';
import { gsap } from 'gsap';

/**
 * Configuración base para animaciones con GSAP.
 * 
 * @interface AnimationConfig
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface AnimationConfig {
    /** Duración de la animación en segundos */
    duration?: number;
    /** Retardo antes de iniciar la animación en segundos */
    delay?: number;
    /** Función de easing para la animación */
    ease?: string;
    /** Configuración de escalonamiento para múltiples elementos */
    stagger?: number | object;
    /** Callback ejecutado al completar la animación */
    onComplete?: () => void;
}

/**
 * Configuración extendida para animaciones de elementos específicos.
 * 
 * @interface ElementAnimationConfig
 * @extends AnimationConfig
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface ElementAnimationConfig extends AnimationConfig {
    /** Selector CSS del elemento a animar */
    selector: string;
    /** Propiedades iniciales de la animación */
    from?: gsap.TweenVars;
    /** Propiedades finales de la animación */
    to?: gsap.TweenVars;
}

/**
 * Servicio central para gestión de animaciones con GSAP en el sistema.
 * 
 * Proporciona una interfaz unificada para crear y gestionar animaciones complejas
 * utilizando la biblioteca GSAP (GreenSock Animation Platform). Centraliza toda
 * la lógica de animaciones del frontend, ofreciendo métodos para animaciones
 * básicas, avanzadas, timeline y efectos especiales para mejorar la experiencia
 * de usuario en la aplicación de gestión de partes docente.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */
@Injectable({
    providedIn: 'root'
})
export class AnimationService {

    /**
     * Constructor del servicio AnimationService.
     * 
     * Inicializa el servicio de animaciones sin dependencias externas.
     */
    constructor() { }

    /**
     * Anima elementos con transición desde un estado inicial hacia un estado final.
     * 
     * Crea una animación GSAP que define tanto el estado inicial como el final
     * del elemento, proporcionando control completo sobre la transición.
     * 
     * @param element - Elemento a animar (selector CSS, Element o ElementRef)
     * @param from - Propiedades iniciales de la animación
     * @param to - Propiedades finales de la animación
     * @param config - Configuración opcional de la animación
     * @returns Instancia del tween GSAP para control adicional
     * @example
     * ```typescript
     * this.animationService.animateFromTo(
     *   '.card',
     *   { opacity: 0, y: 50 },
     *   { opacity: 1, y: 0 },
     *   { duration: 0.8, ease: 'power2.out' }
     * );
     * ```
     */
    animateFromTo(
        element: string | Element | ElementRef,
        from: gsap.TweenVars,
        to: gsap.TweenVars,
        config?: AnimationConfig
    ): gsap.core.Tween {
        const mergedTo = {
            ...to,
            duration: config?.duration || 0.5,
            delay: config?.delay || 0,
            ease: config?.ease || "power2.out",
            onComplete: config?.onComplete
        };

        if (config?.stagger) {
            mergedTo.stagger = config.stagger;
        }

        return gsap.fromTo(this.getElement(element), from, mergedTo);
    }

    /**
     * Anima elementos hacia un estado específico desde su estado actual.
     * 
     * Crea una animación que transiciona el elemento desde su estado actual
     * hacia las propiedades definidas en el parámetro 'to'.
     * 
     * @param element - Elemento a animar (selector CSS, Element o ElementRef)
     * @param to - Propiedades finales de la animación
     * @param config - Configuración opcional de la animación
     * @returns Instancia del tween GSAP para control adicional
     * @example
     * ```typescript
     * this.animationService.animateTo(
     *   '#sidebar',
     *   { x: -250, opacity: 0.5 },
     *   { duration: 0.6, ease: 'power1.inOut' }
     * );
     * ```
     */
    animateTo(
        element: string | Element | ElementRef,
        to: gsap.TweenVars,
        config?: AnimationConfig
    ): gsap.core.Tween {
        const mergedTo = {
            ...to,
            duration: config?.duration || 0.5,
            delay: config?.delay || 0,
            ease: config?.ease || "power2.out",
            onComplete: config?.onComplete
        };

        if (config?.stagger) {
            mergedTo.stagger = config.stagger;
        }

        return gsap.to(this.getElement(element), mergedTo);
    }

    /**
     * Anima elementos desde un estado específico hacia su estado actual.
     * 
     * Establece temporalmente las propiedades del elemento según 'from'
     * y luego anima hacia el estado actual del elemento.
     * 
     * @param element - Elemento a animar (selector CSS, Element o ElementRef)
     * @param from - Propiedades iniciales de la animación
     * @param config - Configuración opcional de la animación
     * @returns Instancia del tween GSAP para control adicional
     * @example
     * ```typescript
     * this.animationService.animateFrom(
     *   '.notification',
     *   { scale: 0, rotation: 180 },
     *   { duration: 0.4, ease: 'back.out(1.7)' }
     * );
     * ```
     */
    animateFrom(
        element: string | Element | ElementRef,
        from: gsap.TweenVars,
        config?: AnimationConfig
    ): gsap.core.Tween {
        const mergedFrom = {
            ...from,
            duration: config?.duration || 0.5,
            delay: config?.delay || 0,
            ease: config?.ease || "power2.out",
            onComplete: config?.onComplete
        };

        if (config?.stagger) {
            mergedFrom.stagger = config.stagger;
        }

        return gsap.from(this.getElement(element), mergedFrom);
    }

    /**
     * Establece propiedades iniciales sin animación
     */
    set(element: string | Element | ElementRef, properties: gsap.TweenVars): gsap.core.Tween {
        return gsap.set(this.getElement(element), properties);
    }

    /**
     * Crea una timeline para animaciones secuenciales
     */
    createTimeline(config?: gsap.TimelineVars): gsap.core.Timeline {
        return gsap.timeline(config);
    }

    /**
     * Ejecuta múltiples animaciones basadas en configuración
     */
    executeAnimationSequence(
        container: ElementRef,
        animations: ElementAnimationConfig[]
    ): gsap.core.Timeline {
        const timeline = this.createTimeline();

        animations.forEach(animation => {
            const elements = container.nativeElement.querySelectorAll(animation.selector);

            if (elements.length > 0) {
                if (animation.from && animation.to) {
                    timeline.fromTo(
                        elements,
                        animation.from,
                        {
                            ...animation.to,
                            duration: animation.duration || 0.5,
                            ease: animation.ease || "power2.out",
                            stagger: animation.stagger || 0
                        },
                        animation.delay ? `-=${animation.delay}` : undefined
                    );
                } else if (animation.to) {
                    timeline.to(
                        elements,
                        {
                            ...animation.to,
                            duration: animation.duration || 0.5,
                            ease: animation.ease || "power2.out",
                            stagger: animation.stagger || 0
                        },
                        animation.delay ? `-=${animation.delay}` : undefined
                    );
                } else if (animation.from) {
                    timeline.from(
                        elements,
                        {
                            ...animation.from,
                            duration: animation.duration || 0.5,
                            ease: animation.ease || "power2.out",
                            stagger: animation.stagger || 0
                        },
                        animation.delay ? `-=${animation.delay}` : undefined
                    );
                }
            }
        });

        return timeline;
    }

    /**
     * Configura efectos de hover para elementos
     */
    setupHoverEffects(
        container: ElementRef,
        selector: string,
        hoverIn: gsap.TweenVars,
        hoverOut: gsap.TweenVars,
        config?: { duration?: number; ease?: string }
    ): void {
        const elements = container.nativeElement.querySelectorAll(selector);
        const duration = config?.duration || 0.2;
        const ease = config?.ease || "power2.out";

        elements.forEach((element: HTMLElement) => {
            element.addEventListener('mouseenter', () => {
                gsap.to(element, { ...hoverIn, duration, ease });
            });

            element.addEventListener('mouseleave', () => {
                gsap.to(element, { ...hoverOut, duration, ease });
            });
        });
    }

    /**
     * Obtiene el elemento del DOM
     */
    private getElement(element: string | Element | ElementRef): any {
        if (typeof element === 'string') {
            return element;
        } else if (element instanceof ElementRef) {
            return element.nativeElement;
        } else {
            return element;
        }
    }
}
