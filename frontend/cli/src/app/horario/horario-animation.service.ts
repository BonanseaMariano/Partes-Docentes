import { Injectable, ElementRef } from '@angular/core';
import { AnimationService } from '../core/services/animation.service';
import { HorarioAnimations } from './horario-animations.config';

@Injectable({
    providedIn: 'root'
})
export class HorarioAnimationService {

    constructor(private animationService: AnimationService) { }

    /**
     * Ejecuta las animaciones de entrada inicial
     */
    animateInitialEntrance(container: ElementRef): void {
        this.animationService.executeAnimationSequence(
            container,
            HorarioAnimations.INITIAL_ENTRANCE
        );
    }

    /**
     * Ejecuta las animaciones de la grilla de horarios
     */
    animateScheduleGrid(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.executeAnimationSequence(
            container,
            HorarioAnimations.SCHEDULE_GRID
        );

        if (onComplete) {
            timeline.call(onComplete);
        }
    }

    /**
     * Ejecuta la animación de transición de datos
     */
    animateDataTransition(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.executeAnimationSequence(
            container,
            HorarioAnimations.DATA_TRANSITION_OUT
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
     * Ejecuta la animación de error
     */
    animateError(container: ElementRef): void {
        // Primero ejecutar la animación de entrada
        this.animationService.executeAnimationSequence(
            container,
            HorarioAnimations.ERROR_DISPLAY
        );

        // Luego ejecutar el efecto shake
        setTimeout(() => {
            const errorElement = container.nativeElement.querySelector(HorarioAnimations.ERROR_SHAKE.selector);
            if (errorElement) {
                this.animationService.animateTo(
                    errorElement,
                    HorarioAnimations.ERROR_SHAKE.animation
                );
            }
        }, 500);
    }

    /**
     * Configura todos los efectos de hover
     */
    setupHoverEffects(container: ElementRef): void {
        const hoverConfigs = HorarioAnimations.HOVER_EFFECTS;

        // Configurar hover para espacios curriculares
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.espaciosCurriculares.selector,
            hoverConfigs.espaciosCurriculares.hoverIn,
            hoverConfigs.espaciosCurriculares.hoverOut,
            hoverConfigs.espaciosCurriculares.config
        );

        // Configurar hover para badges de horas
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.horasBadges.selector,
            hoverConfigs.horasBadges.hoverIn,
            hoverConfigs.horasBadges.hoverOut,
            hoverConfigs.horasBadges.config
        );
    }

    /**
     * Limpia todas las animaciones activas
     */
    clearAnimations(): void {
        // Implementar si es necesario limpiar animaciones
    }
}
