import { Injectable, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { AnimationService } from '../../core/services/animation.service';
import { CargosAnimations } from './cargos-animations.config';

@Injectable({
    providedIn: 'root'
})
export class CargosAnimationService {

    constructor(private animationService: AnimationService) { }

    /**
     * Anima la entrada inicial del componente
     */
    animateInitialEntrance(container: ElementRef): void {
        const config = CargosAnimations.INITIAL_ENTRANCE;

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
        const config = CargosAnimations.DATA_LOADING;

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
        const config = CargosAnimations.SORT_TRANSITION;
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
        const config = CargosAnimations.SORT_TRANSITION;
        const tableBody = container.nativeElement.querySelector(config.tableUpdate.selector);

        if (tableBody) {
            gsap.to(tableBody, config.tableUpdate.fadeIn);
        }
    }

    /**
     * Anima el estado de carga con efecto de "respiración"
     */
    animateLoadingBreath(container: ElementRef): void {
        const config = CargosAnimations.DATA_LOADING;
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
        const hoverConfigs = CargosAnimations.HOVER_EFFECTS;

        // Configurar hover para botones de horarios con datos
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.horariosButtons.selector,
            hoverConfigs.horariosButtons.hoverIn,
            hoverConfigs.horariosButtons.hoverOut,
            hoverConfigs.horariosButtons.config
        );

        // Configurar hover para botones de horarios vacíos
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.horariosButtonsEmpty.selector,
            hoverConfigs.horariosButtonsEmpty.hoverIn,
            hoverConfigs.horariosButtonsEmpty.hoverOut,
            hoverConfigs.horariosButtonsEmpty.config
        );

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
     * Animación especial para cuando se hace clic en un botón de horarios
     */
    animateHorariosButtonClick(button: HTMLElement): void {
        const config = CargosAnimations.BUTTON_CLICK;

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
     * Animación especial para cuando se hace clic en cualquier botón
     */
    animateButtonClick(button: HTMLElement): void {
        const config = CargosAnimations.BUTTON_CLICK;

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
     * Animación de entrada del popup de horarios
     */
    animatePopupEntrance(container: ElementRef): void {
        const config = CargosAnimations.POPUP_ENTRANCE;

        // Animar contenedor del popup
        const popupContainer = container.nativeElement;
        if (popupContainer) {
            gsap.fromTo(popupContainer,
                config.container.animation,
                {
                    scale: 1,
                    opacity: 1,
                    duration: config.container.animation.duration,
                    ease: config.container.animation.ease
                }
            );
        }

        // Animar contenido interno
        const contentElement = container.nativeElement.querySelector(config.content.selector);
        if (contentElement) {
            gsap.fromTo(contentElement,
                config.content.animation,
                {
                    y: 0,
                    opacity: 1,
                    duration: config.content.animation.duration,
                    delay: config.content.animation.delay,
                    ease: config.content.animation.ease
                }
            );
        }
    }

    /**
     * Anima los horarios dentro del popup
     */
    animateHorariosPopup(container: ElementRef): void {
        const config = CargosAnimations.HORARIOS_EFFECTS;

        // Animar grupos de días
        const dayGroups = container.nativeElement.querySelectorAll(config.dayGroups.selector);
        if (dayGroups.length > 0) {
            gsap.fromTo(dayGroups,
                config.dayGroups.animation,
                {
                    y: 0,
                    opacity: 1,
                    duration: config.dayGroups.animation.duration,
                    stagger: config.dayGroups.animation.stagger,
                    ease: config.dayGroups.animation.ease
                }
            );
        }

        // Animar horarios individuales
        const horarioItems = container.nativeElement.querySelectorAll(config.horarioItems.selector);
        if (horarioItems.length > 0) {
            gsap.fromTo(horarioItems,
                config.horarioItems.animation,
                {
                    x: 0,
                    opacity: 1,
                    duration: config.horarioItems.animation.duration,
                    stagger: config.horarioItems.animation.stagger,
                    ease: config.horarioItems.animation.ease
                }
            );
        }
    }

    /**
     * Anima badges y elementos especiales
     */
    animateBadges(container: ElementRef): void {
        const config = CargosAnimations.BADGE_ANIMATION;
        const badgeElements = container.nativeElement.querySelectorAll(config.tipoBadges.selector);

        if (badgeElements.length > 0) {
            badgeElements.forEach((element: Element, index: number) => {
                setTimeout(() => {
                    gsap.to(element, config.tipoBadges.animation);
                }, index * 50);
            });
        }
    }

    /**
     * Anima números y estadísticas
     */
    animateNumbers(container: ElementRef): void {
        const config = CargosAnimations.DATA_INDICATORS;
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
        const config = CargosAnimations.DATA_INDICATORS;
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
