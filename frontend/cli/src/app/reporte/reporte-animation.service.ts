import { ElementRef, Injectable } from '@angular/core';
import { AnimationService } from '../core/services/animation.service';
import { ReporteAnimations } from '../reporte/reporte-animations.config';

@Injectable({
    providedIn: 'root'
})
export class ReporteAnimationService {

    constructor(private animationService: AnimationService) { }

    /**
     * Ejecuta las animaciones de entrada inicial
     */
    animateInitialEntrance(container: ElementRef): void {
        this.animationService.executeAnimationSequence(
            container,
            ReporteAnimations.INITIAL_ENTRANCE
        );
    }

    /**
     * Anima las tarjetas de designaciones
     */
    animateDesignacionesCards(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.executeAnimationSequence(
            container,
            ReporteAnimations.DESIGNACIONES_CARDS
        );

        if (onComplete) {
            timeline.call(onComplete);
        }
    }

    /**
     * Anima las tarjetas de estadísticas
     */
    animateStatsCards(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.executeAnimationSequence(
            container,
            ReporteAnimations.STATS_CARDS
        );

        if (onComplete) {
            timeline.call(onComplete);
        }
    }

    /**
     * Anima la secuencia completa de carga de datos
     */
    animateDataLoad(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.createTimeline();

        // 1. Animar designaciones
        timeline.add(
            this.animationService.executeAnimationSequence(
                container,
                ReporteAnimations.DESIGNACIONES_CARDS
            )
        );

        // 2. Animar estadísticas
        timeline.add(
            this.animationService.executeAnimationSequence(
                container,
                ReporteAnimations.STATS_CARDS
            ),
            "-=0.4" // Solapamiento
        );

        if (onComplete) {
            timeline.call(onComplete);
        }
    }

    /**
     * Anima la transición cuando cambian los datos
     */
    animateDataTransition(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.executeAnimationSequence(
            container,
            ReporteAnimations.DATA_TRANSITION_OUT
        );

        if (onComplete) {
            timeline.call(() => {
                setTimeout(() => {
                    onComplete();
                }, 100);
            });
        }
    }

    /**
     * Anima el estado de loading
     */
    animateLoading(container: ElementRef): void {
        this.animationService.executeAnimationSequence(
            container,
            ReporteAnimations.LOADING_ANIMATION
        );
    }

    /**
     * Anima mensajes de error
     */
    animateError(container: ElementRef): void {
        // Primero ejecutar la animación de entrada
        this.animationService.executeAnimationSequence(
            container,
            ReporteAnimations.ERROR_DISPLAY
        );

        // Luego ejecutar el efecto shake
        setTimeout(() => {
            const errorElement = container.nativeElement.querySelector(ReporteAnimations.ERROR_SHAKE.selector);
            if (errorElement) {
                this.animationService.animateTo(
                    errorElement,
                    ReporteAnimations.ERROR_SHAKE.animation
                );
            }
        }, 500);
    }

    /**
     * Anima números con efecto contador
     */
    animateCounters(container: ElementRef): void {
        const counterElements = container.nativeElement.querySelectorAll('.counter-number, .stats-card h4');

        counterElements.forEach((element: HTMLElement) => {
            const textContent = element.textContent || '0';
            const matches = textContent.match(/[\d.,]+/);
            if (matches) {
                const finalValue = parseFloat(matches[0].replace(/,/g, ''));
                const obj = { value: 0 };
                const isPercentage = textContent.includes('%');

                // Usar el servicio base para crear una animación personalizada
                const timeline = this.animationService.createTimeline();
                timeline.to(obj, {
                    value: finalValue,
                    duration: ReporteAnimations.COUNTER_ANIMATION.animation.duration,
                    ease: ReporteAnimations.COUNTER_ANIMATION.animation.ease,
                    onUpdate: () => {
                        const currentValue = Math.floor(obj.value * 100) / 100;
                        if (isPercentage) {
                            element.textContent = textContent.replace(/[\d.,]+/, currentValue.toFixed(2));
                        } else {
                            element.textContent = textContent.replace(/[\d.,]+/, Math.floor(obj.value).toString());
                        }
                    }
                });
            }
        });
    }

    /**
     * Anima la transición de cambio de año
     */
    animateYearChange(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.executeAnimationSequence(
            container,
            ReporteAnimations.YEAR_CHANGE_TRANSITION
        );

        if (onComplete) {
            timeline.call(() => {
                setTimeout(() => {
                    onComplete();
                }, 100);
            });
        }
    }

    /**
     * Configura todos los efectos de hover
     */
    setupHoverEffects(container: ElementRef): void {
        const hoverConfigs = ReporteAnimations.HOVER_EFFECTS;

        // Configurar hover para tarjetas de estadísticas
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.statsCards.selector,
            hoverConfigs.statsCards.hoverIn,
            hoverConfigs.statsCards.hoverOut,
            hoverConfigs.statsCards.config
        );

        // Configurar hover para designaciones
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.designacionCards.selector,
            hoverConfigs.designacionCards.hoverIn,
            hoverConfigs.designacionCards.hoverOut,
            hoverConfigs.designacionCards.config
        );

        // Configurar hover para botones
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.buttons.selector,
            hoverConfigs.buttons.hoverIn,
            hoverConfigs.buttons.hoverOut,
            hoverConfigs.buttons.config
        );

        // Configurar hover para selector de año
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.yearSelector.selector,
            hoverConfigs.yearSelector.hoverIn,
            hoverConfigs.yearSelector.hoverOut,
            hoverConfigs.yearSelector.config
        );
    }

    /**
     * Limpia todas las animaciones activas
     */
    clearAnimations(): void {
        // Implementar si es necesario limpiar animaciones específicas
    }
}
