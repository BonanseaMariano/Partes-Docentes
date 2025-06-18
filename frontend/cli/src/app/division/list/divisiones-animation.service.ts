import { Injectable, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { AnimationService } from '../../core/services/animation.service';
import { DivisionesAnimations } from './divisiones-animations.config';

@Injectable({
    providedIn: 'root'
})
export class DivisionesAnimationService {

    constructor(private animationService: AnimationService) { }

    /**
     * Anima la entrada inicial del componente
     */
    animateInitialEntrance(container: ElementRef): void {
        const config = DivisionesAnimations.INITIAL_ENTRANCE;

        // Animar header
        const headerElement = container.nativeElement.querySelector(config.header.selector);
        if (headerElement) {
            gsap.fromTo(headerElement,
                config.header.animation,
                { y: 0, opacity: 1, duration: config.header.animation.duration, ease: config.header.animation.ease }
            );
        }

        // Animar tabla
        const tableElement = container.nativeElement.querySelector(config.table.selector);
        if (tableElement) {
            gsap.fromTo(tableElement,
                config.table.animation,
                {
                    y: 0,
                    opacity: 1,
                    duration: config.table.animation.duration,
                    delay: config.table.animation.delay,
                    ease: config.table.animation.ease
                }
            );
        }

        // Animar filas de la tabla
        const rowElements = container.nativeElement.querySelectorAll(config.tableRows.selector);
        if (rowElements.length > 0) {
            gsap.fromTo(rowElements,
                config.tableRows.animation,
                {
                    x: 0,
                    opacity: 1,
                    duration: config.tableRows.animation.duration,
                    stagger: config.tableRows.animation.stagger,
                    delay: config.tableRows.animation.delay,
                    ease: config.tableRows.animation.ease
                }
            );
        }

        // Animar footer
        const footerElement = container.nativeElement.querySelector(config.footer.selector);
        if (footerElement) {
            gsap.fromTo(footerElement,
                config.footer.animation,
                {
                    y: 0,
                    opacity: 1,
                    duration: config.footer.animation.duration,
                    delay: config.footer.animation.delay,
                    ease: config.footer.animation.ease
                }
            );
        }
    }

    /**
     * Anima la carga de datos
     */
    animateDataLoad(container: ElementRef, onComplete?: () => void): void {
        const config = DivisionesAnimations.DATA_LOADING;

        const rowElements = container.nativeElement.querySelectorAll(config.newRows.selector);
        if (rowElements.length > 0) {
            gsap.fromTo(rowElements,
                config.newRows.animation,
                {
                    x: 0,
                    opacity: 1,
                    duration: config.newRows.animation.duration,
                    stagger: config.newRows.animation.stagger,
                    ease: config.newRows.animation.ease,
                    onComplete: onComplete
                }
            );
        }
    }

    /**
     * Anima la transición cuando cambia el ordenamiento
     */
    animateSortTransition(container: ElementRef, onComplete?: () => void): void {
        const config = DivisionesAnimations.SORT_TRANSITION;
        const tableBody = container.nativeElement.querySelector(config.tableUpdate.selector);

        if (tableBody) {
            // Primero fade out
            gsap.to(tableBody, {
                ...config.tableUpdate.fadeOut,
                onComplete: () => {
                    // Ejecutar callback (cargar nuevos datos)
                    if (onComplete) {
                        onComplete();
                    }
                }
            });
        }
    }

    /**
     * Anima el fade in después de que los datos se hayan actualizado
     */
    animateSortTransitionIn(container: ElementRef): void {
        const config = DivisionesAnimations.SORT_TRANSITION;
        const tableBody = container.nativeElement.querySelector(config.tableUpdate.selector);

        if (tableBody) {
            gsap.to(tableBody, config.tableUpdate.fadeIn);
        }
    }

    /**
     * Anima el estado de carga con efecto de "respiración"
     */
    animateLoadingBreath(container: ElementRef): void {
        const config = DivisionesAnimations.DATA_LOADING;
        const tableContainer = container.nativeElement.querySelector(config.breathingTable.selector);

        if (tableContainer) {
            const timeline = this.animationService.createTimeline({ repeat: -1, yoyo: true });
            timeline.to(tableContainer, config.breathingTable.animation);
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

    /**
     * Configura todos los efectos de hover
     */
    setupHoverEffects(container: ElementRef): void {
        const hoverConfigs = DivisionesAnimations.HOVER_EFFECTS;

        // Configurar hover para filas de tabla
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.tableRows.selector,
            hoverConfigs.tableRows.hoverIn,
            hoverConfigs.tableRows.hoverOut,
            hoverConfigs.tableRows.config
        );

        // Configurar hover para botones de acción
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.actionButtons.selector,
            hoverConfigs.actionButtons.hoverIn,
            hoverConfigs.actionButtons.hoverOut,
            hoverConfigs.actionButtons.config
        );

        // Configurar hover para botón nuevo
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.newButton.selector,
            hoverConfigs.newButton.hoverIn,
            hoverConfigs.newButton.hoverOut,
            hoverConfigs.newButton.config
        );
    }

    /**
     * Animación especial para cuando se hace clic en un botón
     */
    animateButtonClick(button: HTMLElement): void {
        const config = DivisionesAnimations.BUTTON_CLICK;

        // Efecto de "press"
        gsap.to(button, {
            ...config.pressEffect,
            onComplete: () => {
                // Efecto de "release"
                gsap.to(button, config.releaseEffect);
            }
        });
    }

    /**
     * Anima la eliminación de una fila
     */
    animateRowDelete(row: HTMLElement, onComplete?: () => void): void {
        const config = DivisionesAnimations.MODAL_EFFECTS;

        gsap.to(row, {
            ...config.deleteRow.animation,
            onComplete: onComplete
        });
    }

    /**
     * Anima badges y elementos especiales
     */
    animateBadges(container: ElementRef): void {
        const config = DivisionesAnimations.BADGE_ANIMATION;
        const badgeElements = container.nativeElement.querySelectorAll(config.turnoBadges.selector);

        if (badgeElements.length > 0) {
            badgeElements.forEach((element: Element, index: number) => {
                setTimeout(() => {
                    gsap.to(element, config.turnoBadges.animation);
                }, index * 50);
            });
        }
    }

    /**
     * Anima números y estadísticas
     */
    animateNumbers(container: ElementRef): void {
        const config = DivisionesAnimations.DATA_INDICATORS;
        const numberElements = container.nativeElement.querySelectorAll(config.numbers.selector);

        if (numberElements.length > 0) {
            numberElements.forEach((element: Element, index: number) => {
                setTimeout(() => {
                    gsap.to(element, config.numbers.animation);
                }, index * 80);
            });
        }
    }

    /**
     * Anima el estado vacío
     */
    animateEmptyState(container: ElementRef): void {
        const config = DivisionesAnimations.DATA_INDICATORS;
        const emptyElement = container.nativeElement.querySelector(config.emptyState.selector);

        if (emptyElement) {
            gsap.fromTo(emptyElement,
                config.emptyState.animation,
                {
                    y: 0,
                    opacity: 1,
                    duration: config.emptyState.animation.duration,
                    ease: config.emptyState.animation.ease
                }
            );
        }
    }

    /**
     * Limpia todas las animaciones activas
     */
    clearAnimations(): void {
        // Matar todas las animaciones GSAP activas
        gsap.killTweensOf("*");
    }
}
