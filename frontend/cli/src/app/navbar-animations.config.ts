import { ElementAnimationConfig } from './core/services/animation.service';

/**
 * Configuraciones de animaciones para el navbar principal
 */
export class NavbarAnimations {

    /**
     * Animaciones de entrada inicial del navbar
     */
    static readonly INITIAL_ENTRANCE: ElementAnimationConfig[] = [
        {
            selector: '.navbar',
            from: { y: -100, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.8,
            ease: "power2.out"
        },
        {
            selector: '.navbar-brand',
            from: { x: -50, opacity: 0 },
            to: { x: 0, opacity: 1 },
            duration: 0.6,
            delay: 0.3,
            ease: "back.out(1.7)"
        },
        {
            selector: '.nav-item',
            from: { y: -20, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.4,
            delay: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        }
    ];

    /**
     * Animaciones para el scroll del navbar
     */
    static readonly SCROLL_EFFECTS: ElementAnimationConfig[] = [
        {
            selector: '.navbar.scrolled',
            to: {
                backgroundColor: 'rgba(13, 110, 253, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            },
            duration: 0.3,
            ease: "power2.out"
        }
    ];

    /**
     * Animaciones para dropdowns
     */
    static readonly DROPDOWN_ANIMATIONS = {
        open: {
            selector: '.dropdown-menu',
            from: {
                opacity: 0,
                scale: 0.95,
                y: -10,
                transformOrigin: 'top center'
            },
            to: {
                opacity: 1,
                scale: 1,
                y: 0
            },
            duration: 0.2,
            ease: "back.out(1.7)"
        },
        close: {
            selector: '.dropdown-menu',
            to: {
                opacity: 0,
                scale: 0.95,
                y: -10
            },
            duration: 0.15,
            ease: "power2.in"
        },
        items: {
            selector: '.dropdown-item',
            from: { x: -20, opacity: 0 },
            to: { x: 0, opacity: 1 },
            duration: 0.2,
            stagger: 0.05,
            delay: 0.1,
            ease: "power2.out"
        }
    };

    /**
     * Animaciones para el menú móvil
     */
    static readonly MOBILE_MENU_ANIMATIONS = {
        expand: {
            selector: '.navbar-collapse',
            from: { height: 0, opacity: 0 },
            to: { height: 'auto', opacity: 1 },
            duration: 0.4,
            ease: "power2.out"
        },
        collapse: {
            selector: '.navbar-collapse',
            to: { height: 0, opacity: 0 },
            duration: 0.3,
            ease: "power2.in"
        },
        menuItems: {
            selector: '.navbar-nav .nav-item',
            from: { x: -30, opacity: 0 },
            to: { x: 0, opacity: 1 },
            duration: 0.3,
            stagger: 0.1,
            delay: 0.2,
            ease: "power2.out"
        }
    };

    /**
     * Configuraciones de efectos hover
     */
    static readonly HOVER_EFFECTS = {
        navItems: {
            selector: '.nav-link',
            hoverIn: {
                scale: 1.05,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '6px'
            },
            hoverOut: {
                scale: 1,
                backgroundColor: 'transparent',
                borderRadius: '0px'
            },
            config: { duration: 0.2, ease: "power2.out" }
        },
        dropdownItems: {
            selector: '.dropdown-item',
            hoverIn: {
                x: 5,
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                paddingLeft: '20px'
            },
            hoverOut: {
                x: 0,
                backgroundColor: 'transparent',
                paddingLeft: '16px'
            },
            config: { duration: 0.2, ease: "power2.out" }
        },
        brand: {
            selector: '.navbar-brand',
            hoverIn: {
                scale: 1.05,
                filter: 'brightness(1.1)'
            },
            hoverOut: {
                scale: 1,
                filter: 'brightness(1)'
            },
            config: { duration: 0.3, ease: "back.out(1.7)" }
        },
        togglerButton: {
            selector: '.navbar-toggler',
            hoverIn: {
                scale: 1.1,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px'
            },
            hoverOut: {
                scale: 1,
                backgroundColor: 'transparent',
                borderRadius: '4px'
            },
            config: { duration: 0.2, ease: "power2.out" }
        }
    };

    /**
     * Animaciones para iconos
     */
    static readonly ICON_ANIMATIONS = {
        hover: {
            selector: '.nav-link i',
            hoverIn: {
                scale: 1.2,
                rotation: 5,
                filter: 'brightness(1.2)'
            },
            hoverOut: {
                scale: 1,
                rotation: 0,
                filter: 'brightness(1)'
            },
            config: { duration: 0.3, ease: "back.out(1.7)" }
        },
        dropdown: {
            selector: '.dropdown-toggle::after',
            opened: { rotation: 180 },
            closed: { rotation: 0 },
            config: { duration: 0.2, ease: "power2.out" }
        }
    };

    /**
     * Efectos de pulso para elementos activos
     */
    static readonly PULSE_EFFECTS = {
        activeItem: {
            selector: '.nav-link.active',
            animation: {
                scale: 1.02,
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut"
            }
        }
    };

    /**
     * Animaciones para notificaciones en el navbar
     */
    static readonly NOTIFICATION_ANIMATIONS = {
        badge: {
            selector: '.notification-badge',
            from: { scale: 0, opacity: 0 },
            to: { scale: 1, opacity: 1 },
            duration: 0.3,
            ease: "back.out(1.7)"
        },
        bounce: {
            selector: '.notification-bounce',
            animation: {
                y: -5,
                duration: 0.5,
                repeat: 3,
                yoyo: true,
                ease: "power2.out"
            }
        }
    };

    /**
     * Transiciones de tema/color
     */
    static readonly THEME_TRANSITIONS = {
        colorChange: {
            selector: '.navbar',
            duration: 0.5,
            ease: "power2.out"
        }
    };
}
