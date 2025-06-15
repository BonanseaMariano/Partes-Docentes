import { Injectable, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { AnimationService } from '../core/services/animation.service';
import { ParteDiarioAnimations } from './parte-diario-animations.config';

@Injectable({
    providedIn: 'root'
})
export class ParteDiarioAnimationService {

    constructor(private animationService: AnimationService) { }

    /**
     * Ejecuta las animaciones de entrada inicial
     */
    animateInitialEntrance(container: ElementRef): void {
        this.animationService.executeAnimationSequence(
            container,
            ParteDiarioAnimations.INITIAL_ENTRANCE
        );
    }

    /**
     * Anima la entrada de los datos de la tabla
     */
    animateTableEntrance(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.executeAnimationSequence(
            container,
            ParteDiarioAnimations.TABLE_ENTRANCE
        );

        if (onComplete) {
            timeline.call(onComplete);
        }
    }

    /**
     * Anima la carga de nuevos datos
     */
    animateDataLoad(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.createTimeline();

        // 1. Animar entrada de la tabla
        timeline.add(
            this.animationService.executeAnimationSequence(
                container,
                ParteDiarioAnimations.TABLE_ENTRANCE
            )
        );

        // 2. Animar datos específicos
        timeline.add(
            this.animationService.executeAnimationSequence(
                container,
                ParteDiarioAnimations.DATA_LOADING
            ),
            "-=0.3" // Solapamiento
        );

        if (onComplete) {
            timeline.call(onComplete);
        }
    }

    /**
     * Anima la transición cuando cambia la fecha
     */
    animateDateTransition(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.executeAnimationSequence(
            container,
            ParteDiarioAnimations.DATE_CHANGE_TRANSITION
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
     * Anima la entrada de datos después del cambio de fecha
     */
    animateDateChangeIn(container: ElementRef, onComplete?: () => void): void {
        const timeline = this.animationService.executeAnimationSequence(
            container,
            ParteDiarioAnimations.DATE_CHANGE_IN
        );

        if (onComplete) {
            timeline.call(onComplete);
        }
    }

    /**
     * Anima el estado de error
     */
    animateError(container: ElementRef): void {
        // Primero ejecutar el shake
        const timeline = this.animationService.createTimeline();

        timeline.to(container.nativeElement.querySelectorAll('.empty-state-cell'), {
            x: 8,
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            ease: "power2.inOut"
        });
    }

    /**
     * Anima el estado vacío
     */
    animateEmptyState(container: ElementRef): void {
        this.animationService.executeAnimationSequence(
            container,
            ParteDiarioAnimations.EMPTY_STATE
        );
    }

    /**
     * Anima popups y modales
     */
    animatePopupEntrance(container: ElementRef): void {
        this.animationService.executeAnimationSequence(
            container,
            ParteDiarioAnimations.POPUP_ENTRANCE
        );
    }

    /**
     * Configura todos los efectos de hover
     */
    setupHoverEffects(container: ElementRef): void {
        const hoverConfigs = ParteDiarioAnimations.HOVER_EFFECTS;

        // Configurar hover para botones de popup con suplentes
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.popupButtons.selector,
            hoverConfigs.popupButtons.hoverIn,
            hoverConfigs.popupButtons.hoverOut,
            hoverConfigs.popupButtons.config
        );

        // Configurar hover para botones de popup vacíos
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.popupButtonsEmpty.selector,
            hoverConfigs.popupButtonsEmpty.hoverIn,
            hoverConfigs.popupButtonsEmpty.hoverOut,
            hoverConfigs.popupButtonsEmpty.config
        );

        // Configurar hover para filas de tabla
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.tableRows.selector,
            hoverConfigs.tableRows.hoverIn,
            hoverConfigs.tableRows.hoverOut,
            hoverConfigs.tableRows.config
        );

        // Configurar hover para controles de fecha
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.dateControls.selector,
            hoverConfigs.dateControls.hoverIn,
            hoverConfigs.dateControls.hoverOut,
            hoverConfigs.dateControls.config
        );

        // Configurar hover para input de fecha
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.dateInput.selector,
            hoverConfigs.dateInput.hoverIn,
            hoverConfigs.dateInput.hoverOut,
            hoverConfigs.dateInput.config
        );
    }

    /**
     * Animación especial para cuando se hace clic en un botón de suplentes
     */
    animatePopupButtonClick(button: HTMLElement): void {
        const timeline = this.animationService.createTimeline();
        timeline.to(button, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.out"
        }).to(button, {
            scale: 1,
            duration: 0.2,
            ease: "back.out(1.7)"
        });
    }

    /**
     * Anima números con efecto contador (para el número de suplentes)
     */
    animateCounters(container: ElementRef): void {
        const counterElements = container.nativeElement.querySelectorAll('.btn-popup span');

        counterElements.forEach((element: HTMLElement) => {
            const finalValue = parseInt(element.textContent || '0');
            if (finalValue > 0) {
                const obj = { value: 0 };

                const timeline = this.animationService.createTimeline();
                timeline.to(obj, {
                    value: finalValue,
                    duration: 0.8,
                    ease: "power2.out",
                    onUpdate: () => {
                        element.textContent = Math.round(obj.value).toString();
                    }
                });
            }
        });
    }

    /**
     * Limpia todas las animaciones activas
     */
    clearAnimations(): void {
        // Matar todas las animaciones GSAP activas
        gsap.killTweensOf("*");
    }

    /**
     * Animación de "respiración" suave para la tabla cuando está cargando
     */
    animateLoadingBreath(container: ElementRef): void {
        const tableContainer = container.nativeElement.querySelector('.table-responsive');

        if (tableContainer) {
            const timeline = this.animationService.createTimeline({ repeat: -1, yoyo: true });
            timeline.to(tableContainer, {
                opacity: 0.7,
                duration: 1,
                ease: "power2.inOut"
            });
        }
    }

    /**
     * Detiene la animación de carga
     */
    stopLoadingAnimation(container: ElementRef): void {
        const tableContainer = container.nativeElement.querySelector('.table-responsive');

        if (tableContainer) {
            // Matar todas las animaciones en el contenedor de la tabla
            gsap.killTweensOf(tableContainer);

            // Restaurar opacidad normal
            gsap.to(tableContainer, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }
}
