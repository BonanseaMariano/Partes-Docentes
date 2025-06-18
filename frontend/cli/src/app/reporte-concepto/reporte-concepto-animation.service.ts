import { Injectable, ElementRef } from '@angular/core';
import { AnimationService } from '../core/services/animation.service';
import { ReporteConceptoAnimations } from './reporte-concepto-animations.config';

@Injectable({
    providedIn: 'root'
})
export class ReporteConceptoAnimationService {

    constructor(private animationService: AnimationService) { }

    /**
     * Ejecuta las animaciones de entrada inicial
     */
    animateInitialEntrance(container: ElementRef): void {
        this.animationService.executeAnimationSequence(
            container,
            ReporteConceptoAnimations.INITIAL_ENTRANCE
        );
    }

    /**
     * Anima las tarjetas de estadísticas
     */
    animateStatsCards(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.executeAnimationSequence(
            container,
            ReporteConceptoAnimations.STATS_CARDS
        );

        if (onComplete) {
            timeline.call(onComplete);
        }
    }

    /**
     * Anima la tabla de docentes
     */
    animateTableEntrance(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.executeAnimationSequence(
            container,
            ReporteConceptoAnimations.TABLE_ENTRANCE
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

        // 1. Animar estadísticas
        timeline.add(
            this.animationService.executeAnimationSequence(
                container,
                ReporteConceptoAnimations.STATS_CARDS
            )
        );

        // 2. Animar tabla
        timeline.add(
            this.animationService.executeAnimationSequence(
                container,
                ReporteConceptoAnimations.TABLE_ENTRANCE
            ),
            "-=0.2" // Solapamiento
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
            ReporteConceptoAnimations.DATA_TRANSITION_OUT
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
            ReporteConceptoAnimations.LOADING_ANIMATION
        );
    }

    /**
     * Anima mensajes de error
     */
    animateError(container: ElementRef): void {
        // Primero ejecutar la animación de entrada
        this.animationService.executeAnimationSequence(
            container,
            ReporteConceptoAnimations.ERROR_DISPLAY
        );

        // Luego ejecutar el efecto shake
        setTimeout(() => {
            const errorElement = container.nativeElement.querySelector(ReporteConceptoAnimations.ERROR_SHAKE.selector);
            if (errorElement) {
                this.animationService.animateTo(
                    errorElement,
                    ReporteConceptoAnimations.ERROR_SHAKE.animation
                );
            }
        }, 500);
    }

    /**
     * Anima popups y modales
     */
    animatePopupEntrance(container: ElementRef): void {
        this.animationService.executeAnimationSequence(
            container,
            ReporteConceptoAnimations.POPUP_ENTRANCE
        );
    }

    /**
     * Anima números con efecto contador
     */
    animateCounters(container: ElementRef): void {
        const counterElements = container.nativeElement.querySelectorAll('.counter-number');

        counterElements.forEach((element: HTMLElement) => {
            const finalValue = parseInt(element.textContent || '0');
            const obj = { value: 0 };

            // Usar el servicio base para crear una animación personalizada
            const timeline = this.animationService.createTimeline();
            timeline.to(obj, {
                value: finalValue,
                duration: ReporteConceptoAnimations.COUNTER_ANIMATION.animation.duration,
                ease: ReporteConceptoAnimations.COUNTER_ANIMATION.animation.ease,
                onUpdate: () => {
                    element.textContent = Math.floor(obj.value).toString();
                }
            });
        });
    }

    /**
     * Anima la transición de cambio de año
     */
    animateYearChange(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.executeAnimationSequence(
            container,
            ReporteConceptoAnimations.YEAR_CHANGE_TRANSITION
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
        const hoverConfigs = ReporteConceptoAnimations.HOVER_EFFECTS;

        // Configurar hover para tarjetas de estadísticas
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.statsCards.selector,
            hoverConfigs.statsCards.hoverIn,
            hoverConfigs.statsCards.hoverOut,
            hoverConfigs.statsCards.config
        );

        // Configurar hover para filas de tabla
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.tableRows.selector,
            hoverConfigs.tableRows.hoverIn,
            hoverConfigs.tableRows.hoverOut,
            hoverConfigs.tableRows.config
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
