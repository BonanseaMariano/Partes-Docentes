import { Injectable, ElementRef } from '@angular/core';
import { gsap } from 'gsap';

export interface AnimationConfig {
    duration?: number;
    delay?: number;
    ease?: string;
    stagger?: number | object;
    onComplete?: () => void;
}

export interface ElementAnimationConfig extends AnimationConfig {
    selector: string;
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
}

@Injectable({
    providedIn: 'root'
})
export class AnimationService {

    constructor() { }

    /**
     * Anima elementos con configuración desde/hacia
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
     * Anima elementos hacia un estado específico
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
     * Anima elementos desde un estado específico
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
