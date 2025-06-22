import { Injectable, ElementRef } from '@angular/core';
import { AnimationService } from './core/services/animation.service';
import { NavbarAnimations } from './navbar-animations.config';

/**
 * Servicio especializado para animaciones del navbar principal del sistema.
 * 
 * Gestiona todas las animaciones relacionadas con la barra de navegación,
 * incluyendo efectos de entrada inicial, transiciones de scroll, animaciones
 * de dropdowns y estados hover. Utiliza configuraciones predefinidas y
 * el AnimationService central para crear una experiencia de navegación
 * fluida y profesional en la aplicación de gestión de partes docente.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */
@Injectable({
    providedIn: 'root'
})
export class NavbarAnimationService {

    /** Map para rastrear estados de dropdowns abiertos/cerrados */
    private dropdownStates = new Map<string, boolean>();

    /**
     * Constructor del servicio NavbarAnimationService.
     * 
     * @param animationService - Servicio central de animaciones para delegación de efectos complejos
     */
    constructor(private animationService: AnimationService) { }

    /**
     * Ejecuta las animaciones de entrada inicial del navbar.
     * 
     * Aplica secuencia de animaciones predefinida para la carga inicial
     * del navbar, creando una entrada suave y profesional.
     * 
     * @param container - Referencia al contenedor del navbar para aplicar animaciones
     * @example
     * ```typescript
     * ngAfterViewInit() {
     *   this.navbarAnimationService.animateInitialEntrance(this.containerRef);
     * }
     * ```
     */
    animateInitialEntrance(container: ElementRef): void {
        this.animationService.executeAnimationSequence(
            container,
            NavbarAnimations.INITIAL_ENTRANCE
        );
    }

    /**
     * Anima el efecto de scroll del navbar con transición de estado.
     * 
     * Aplica animaciones de cambio de apariencia cuando el usuario
     * hace scroll, típicamente cambiando opacidad, color o sombra.
     * 
     * @param container - Referencia al contenedor del navbar
     * @param isScrolled - Indica si la página ha sido scrolleada
     * @example
     * ```typescript
     * @HostListener('window:scroll')
     * onScroll() {
     *   const scrolled = window.pageYOffset > 50;
     *   this.navbarAnimationService.animateScrollEffect(this.containerRef, scrolled);
     * }
     * ```
     */
    animateScrollEffect(container: ElementRef, isScrolled: boolean): void {
        const navbar = container.nativeElement.querySelector('.navbar');
        if (!navbar) return;

        if (isScrolled) {
            this.animationService.animateTo(navbar, {
                backgroundColor: 'rgba(13, 110, 253, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                padding: '0.5rem 0',
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            this.animationService.animateTo(navbar, {
                backgroundColor: 'rgb(13, 110, 253)',
                backdropFilter: 'none',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                padding: '1rem 0',
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }

    /**
     * Anima la apertura de un dropdown
     */
    animateDropdownOpen(dropdownId: string, container: ElementRef): void {
        this.dropdownStates.set(dropdownId, true);

        const dropdownMenu = container.nativeElement.querySelector(`#${dropdownId} + .dropdown-menu`);
        if (!dropdownMenu) return;

        // Configurar estado inicial
        this.animationService.set(dropdownMenu, NavbarAnimations.DROPDOWN_ANIMATIONS.open.from!);

        // Animar apertura del dropdown
        this.animationService.animateTo(
            dropdownMenu,
            {
                ...NavbarAnimations.DROPDOWN_ANIMATIONS.open.to,
                duration: NavbarAnimations.DROPDOWN_ANIMATIONS.open.duration,
                ease: NavbarAnimations.DROPDOWN_ANIMATIONS.open.ease,
                onComplete: () => {
                    // Animar items del dropdown
                    this.animateDropdownItems(dropdownMenu);
                }
            }
        );
    }

    /**
     * Anima el cierre de un dropdown
     */
    animateDropdownClose(dropdownId: string, container: ElementRef): void {
        this.dropdownStates.set(dropdownId, false);

        const dropdownMenu = container.nativeElement.querySelector(`#${dropdownId} + .dropdown-menu`);
        if (!dropdownMenu) return;

        this.animationService.animateTo(
            dropdownMenu,
            {
                ...NavbarAnimations.DROPDOWN_ANIMATIONS.close.to,
                duration: NavbarAnimations.DROPDOWN_ANIMATIONS.close.duration,
                ease: NavbarAnimations.DROPDOWN_ANIMATIONS.close.ease
            }
        );
    }

    /**
     * Anima los items de un dropdown
     */
    private animateDropdownItems(dropdownMenu: Element): void {
        const items = Array.from(dropdownMenu.querySelectorAll('.dropdown-item')) as Element[];

        // Configurar estado inicial de los items
        items.forEach(item => {
            this.animationService.set(item, NavbarAnimations.DROPDOWN_ANIMATIONS.items.from!);
        });

        // Animar items con stagger
        this.animationService.animateTo(
            '.dropdown-item',
            {
                ...NavbarAnimations.DROPDOWN_ANIMATIONS.items.to,
                duration: NavbarAnimations.DROPDOWN_ANIMATIONS.items.duration,
                stagger: NavbarAnimations.DROPDOWN_ANIMATIONS.items.stagger,
                delay: NavbarAnimations.DROPDOWN_ANIMATIONS.items.delay,
                ease: NavbarAnimations.DROPDOWN_ANIMATIONS.items.ease
            }
        );
    }

    /**
     * Anima la expansión del menú móvil
     */
    animateMobileMenuExpand(container: ElementRef): void {
        const navbarCollapse = container.nativeElement.querySelector('.navbar-collapse');
        if (!navbarCollapse) return;

        // Configurar estado inicial
        this.animationService.set(navbarCollapse, NavbarAnimations.MOBILE_MENU_ANIMATIONS.expand.from!);

        // Animar expansión
        this.animationService.animateTo(
            navbarCollapse,
            {
                ...NavbarAnimations.MOBILE_MENU_ANIMATIONS.expand.to,
                duration: NavbarAnimations.MOBILE_MENU_ANIMATIONS.expand.duration,
                ease: NavbarAnimations.MOBILE_MENU_ANIMATIONS.expand.ease,
                onComplete: () => {
                    // Animar items del menú móvil
                    this.animateMobileMenuItems(container);
                }
            }
        );
    }

    /**
     * Anima el colapso del menú móvil
     */
    animateMobileMenuCollapse(container: ElementRef): void {
        const navbarCollapse = container.nativeElement.querySelector('.navbar-collapse');
        if (!navbarCollapse) return;

        this.animationService.animateTo(
            navbarCollapse,
            {
                ...NavbarAnimations.MOBILE_MENU_ANIMATIONS.collapse.to,
                duration: NavbarAnimations.MOBILE_MENU_ANIMATIONS.collapse.duration,
                ease: NavbarAnimations.MOBILE_MENU_ANIMATIONS.collapse.ease
            }
        );
    }

    /**
     * Anima los items del menú móvil
     */
    private animateMobileMenuItems(container: ElementRef): void {
        const menuItems = Array.from(container.nativeElement.querySelectorAll('.navbar-nav .nav-item')) as Element[];

        // Configurar estado inicial
        menuItems.forEach(item => {
            this.animationService.set(item, NavbarAnimations.MOBILE_MENU_ANIMATIONS.menuItems.from!);
        });

        // Animar items
        this.animationService.animateTo(
            '.navbar-nav .nav-item',
            {
                ...NavbarAnimations.MOBILE_MENU_ANIMATIONS.menuItems.to,
                duration: NavbarAnimations.MOBILE_MENU_ANIMATIONS.menuItems.duration,
                stagger: NavbarAnimations.MOBILE_MENU_ANIMATIONS.menuItems.stagger,
                delay: NavbarAnimations.MOBILE_MENU_ANIMATIONS.menuItems.delay,
                ease: NavbarAnimations.MOBILE_MENU_ANIMATIONS.menuItems.ease
            }
        );
    }

    /**
     * Anima notificaciones en el navbar
     */
    animateNotification(selector: string, container: ElementRef): void {
        const element = container.nativeElement.querySelector(selector);
        if (!element) return;

        // Animar aparición del badge
        this.animationService.animateFromTo(
            element,
            NavbarAnimations.NOTIFICATION_ANIMATIONS.badge.from!,
            NavbarAnimations.NOTIFICATION_ANIMATIONS.badge.to!,
            {
                duration: NavbarAnimations.NOTIFICATION_ANIMATIONS.badge.duration,
                ease: NavbarAnimations.NOTIFICATION_ANIMATIONS.badge.ease,
                onComplete: () => {
                    // Efecto de bounce
                    this.animationService.animateTo(
                        element,
                        NavbarAnimations.NOTIFICATION_ANIMATIONS.bounce.animation
                    );
                }
            }
        );
    }

    /**
     * Configura todos los efectos de hover del navbar
     */
    setupHoverEffects(container: ElementRef): void {
        const hoverConfigs = NavbarAnimations.HOVER_EFFECTS;

        // Hover para nav items
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.navItems.selector,
            hoverConfigs.navItems.hoverIn,
            hoverConfigs.navItems.hoverOut,
            hoverConfigs.navItems.config
        );

        // Hover para dropdown items
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.dropdownItems.selector,
            hoverConfigs.dropdownItems.hoverIn,
            hoverConfigs.dropdownItems.hoverOut,
            hoverConfigs.dropdownItems.config
        );

        // Hover para brand
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.brand.selector,
            hoverConfigs.brand.hoverIn,
            hoverConfigs.brand.hoverOut,
            hoverConfigs.brand.config
        );

        // Hover para botón toggler
        this.animationService.setupHoverEffects(
            container,
            hoverConfigs.togglerButton.selector,
            hoverConfigs.togglerButton.hoverIn,
            hoverConfigs.togglerButton.hoverOut,
            hoverConfigs.togglerButton.config
        );

        // Hover para iconos
        this.setupIconHoverEffects(container);
    }

    /**
     * Configura efectos de hover específicos para iconos
     */
    private setupIconHoverEffects(container: ElementRef): void {
        const navLinks = container.nativeElement.querySelectorAll('.nav-link');

        navLinks.forEach((link: HTMLElement) => {
            const icon = link.querySelector('i');
            if (!icon) return;

            link.addEventListener('mouseenter', () => {
                this.animationService.animateTo(icon, {
                    ...NavbarAnimations.ICON_ANIMATIONS.hover.hoverIn,
                    duration: NavbarAnimations.ICON_ANIMATIONS.hover.config.duration,
                    ease: NavbarAnimations.ICON_ANIMATIONS.hover.config.ease
                });
            });

            link.addEventListener('mouseleave', () => {
                this.animationService.animateTo(icon, {
                    ...NavbarAnimations.ICON_ANIMATIONS.hover.hoverOut,
                    duration: NavbarAnimations.ICON_ANIMATIONS.hover.config.duration,
                    ease: NavbarAnimations.ICON_ANIMATIONS.hover.config.ease
                });
            });
        });
    }

    /**
     * Anima elementos activos con efecto de pulso
     */
    animateActiveElements(container: ElementRef): void {
        const activeItems = container.nativeElement.querySelectorAll('.nav-link.active');

        activeItems.forEach((item: HTMLElement) => {
            this.animationService.animateTo(
                item,
                NavbarAnimations.PULSE_EFFECTS.activeItem.animation
            );
        });
    }

    /**
     * Limpia todas las animaciones activas
     */
    clearAnimations(): void {
        this.dropdownStates.clear();
    }
}
