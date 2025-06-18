import { ElementAnimationConfig } from '../core/services/animation.service';

/**
 * Configuraciones de animaciones para el componente de parte diario
 */
export class ParteDiarioAnimations {

    /**
     * Animaciones de entrada inicial del componente
     */
    static readonly INITIAL_ENTRANCE: ElementAnimationConfig[] = [
        {
            selector: '.card-header',
            from: { y: -30, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.8,
            ease: "power2.out"
        },
        {
            selector: '.header-controls',
            from: { scale: 0.9, opacity: 0 },
            to: { scale: 1, opacity: 1 },
            duration: 0.6,
            delay: 0.2,
            ease: "back.out(1.7)"
        }
    ];

    /**
     * Animación de entrada de la tabla
     */
    static readonly TABLE_ENTRANCE: ElementAnimationConfig[] = [
        {
            selector: '.table-responsive',
            from: { y: 20, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.6,
            ease: "power2.out"
        },
        {
            selector: '.table thead th',
            from: { y: -15, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.4,
            delay: 0.3,
            stagger: 0.05,
            ease: "power2.out"
        },
        {
            selector: '.table tbody tr',
            from: { x: -20, opacity: 0 },
            to: { x: 0, opacity: 1 },
            duration: 0.5,
            delay: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        }
    ];

    /**
     * Animaciones para el datepicker
     */
    static readonly DATEPICKER_ENTRANCE: ElementAnimationConfig[] = [
        {
            selector: '.date-selector-group',
            from: { scale: 0.95, opacity: 0 },
            to: { scale: 1, opacity: 1 },
            duration: 0.4,
            ease: "back.out(1.7)"
        }
    ];

    /**
     * Animación para cuando se actualiza la fecha
     */
    static readonly DATE_CHANGE_TRANSITION: ElementAnimationConfig[] = [
        {
            selector: '.parte-diario-container',
            to: { opacity: 0.3, scale: 0.98 },
            duration: 0.3,
            ease: "power2.in"
        }
    ];

    /**
     * Animación para mostrar los nuevos datos después de cambiar fecha
     */
    static readonly DATE_CHANGE_IN: ElementAnimationConfig[] = [
        {
            selector: '.parte-diario-container',
            from: { opacity: 0.3, scale: 0.98 },
            to: { opacity: 1, scale: 1 },
            duration: 0.4,
            ease: "power2.out"
        }
    ];

    /**
     * Animación de error/shake
     */
    static readonly ERROR_SHAKE: ElementAnimationConfig[] = [
        {
            selector: '.empty-state-cell',
            to: { x: 8 },
            duration: 0.1,
            ease: "power2.inOut"
        }
    ];

    /**
     * Animación de carga de datos
     */
    static readonly DATA_LOADING: ElementAnimationConfig[] = [
        {
            selector: '.table tbody tr',
            from: { y: 10, opacity: 0 },
            to: { y: 0, opacity: 1 },
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out"
        }
    ];

    /**
     * Efectos de hover para elementos interactivos
     */
    static readonly HOVER_EFFECTS = {
        // Efecto para botones de suplentes (sin cambio de color, ya son azules por defecto)
        popupButtons: {
            selector: '.btn-popup:not(.btn-popup-empty)',
            hoverIn: {
                scale: 1.05
            },
            hoverOut: {
                scale: 1
            },
            config: {
                duration: 0.2,
                ease: "power2.out"
            }
        },
        // Efecto especial para botones vacíos (grises por defecto)
        popupButtonsEmpty: {
            selector: '.btn-popup-empty',
            hoverIn: {
                scale: 1.02
            },
            hoverOut: {
                scale: 1
            },
            config: {
                duration: 0.2,
                ease: "power2.out"
            }
        },
        // Hover para filas de tabla
        tableRows: {
            selector: '.table tbody tr:not(.empty-row)',
            hoverIn: {
                backgroundColor: '#f8f9fa',
                x: 3,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            },
            hoverOut: {
                backgroundColor: 'transparent',
                x: 0,
                boxShadow: '0 0 0 rgba(0, 0, 0, 0)'
            },
            config: {
                duration: 0.25,
                ease: "power2.out"
            }
        },
        // Hover para controles de fecha
        dateControls: {
            selector: '.calendar-btn, .btn-outline-danger',
            hoverIn: {
                scale: 1.08,
                y: -2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            },
            hoverOut: {
                scale: 1,
                y: 0,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            },
            config: {
                duration: 0.2,
                ease: "power2.out"
            }
        },
        // Hover para el input de fecha
        dateInput: {
            selector: '.date-input',
            hoverIn: {
                scale: 1.02,
                borderColor: '#007bff',
                boxShadow: '0 0 8px rgba(0, 123, 255, 0.2)'
            },
            hoverOut: {
                scale: 1,
                borderColor: '#ced4da',
                boxShadow: '0 0 0 rgba(0, 0, 0, 0)'
            },
            config: {
                duration: 0.2,
                ease: "power2.out"
            }
        }
    };

    /**
     * Animación de entrada del popup de suplentes
     */
    static readonly POPUP_ENTRANCE: ElementAnimationConfig[] = [
        {
            selector: '.popup-container',
            from: { scale: 0.9, opacity: 0, y: 20 },
            to: { scale: 1, opacity: 1, y: 0 },
            duration: 0.4,
            ease: "back.out(1.7)"
        },
        {
            selector: '.popup-container .table tbody tr',
            from: { x: -15, opacity: 0 },
            to: { x: 0, opacity: 1 },
            duration: 0.3,
            delay: 0.2,
            stagger: 0.05,
            ease: "power2.out"
        }
    ];

    /**
     * Animación de transición cuando no hay datos
     */
    static readonly EMPTY_STATE: ElementAnimationConfig[] = [
        {
            selector: '.empty-state-cell',
            from: { scale: 0.95, opacity: 0 },
            to: { scale: 1, opacity: 1 },
            duration: 0.5,
            ease: "power2.out"
        }
    ];

    /**
     * Animación para números/contadores si los hay
     */
    static readonly COUNTER_ANIMATION = {
        selector: '.counter-number, .btn-popup span',
        animation: {
            duration: 0.8,
            ease: "power2.out"
        }
    };
}
