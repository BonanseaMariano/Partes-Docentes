/**
 * Configuración de animaciones GSAP para el componente Licencias
 * Basado en el patrón establecido en personas, divisiones, cargos, designaciones y parte-diario
 */
export class LicenciasAnimations {

    /**
     * Configuración para la animación inicial del componente
     */
    static readonly INITIAL_ENTRANCE = {
        // Animación del header
        header: {
            selector: '.card-header',
            animation: {
                y: -50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            }
        },

        // Animación de la tabla
        table: {
            selector: '.table-responsive',
            animation: {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: "power2.out"
            }
        },

        // Animación escalonada de las filas
        tableRows: {
            selector: '.table tbody tr',
            animation: {
                x: -30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                delay: 0.5,
                ease: "power2.out"
            }
        },

        // Animación del footer (paginación)
        footer: {
            selector: '.card-footer',
            animation: {
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: 0.8,
                ease: "power2.out"
            }
        }
    };

    /**
     * Configuración para animaciones de carga de datos
     */
    static readonly DATA_LOADING = {
        // Efecto de "respiración" durante la carga
        breathingTable: {
            selector: '.table-responsive',
            animation: {
                opacity: 0.7,
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut"
            }
        },

        // Entrada de nuevas filas
        newRows: {
            selector: '.table tbody tr',
            animation: {
                x: -20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "power2.out"
            }
        }
    };

    /**
     * Efectos de hover para elementos interactivos
     */
    static readonly HOVER_EFFECTS = {
        // Efecto para botones de designaciones (azules por defecto, gris si están vacíos)
        designacionesButtons: {
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

        // Efecto para botones vacíos de designaciones
        designacionesButtonsEmpty: {
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

        // Efecto para botones de logs (naranjas por defecto, gris si están vacíos)
        logsButtons: {
            selector: '.btn-popup-logs:not(.btn-popup-empty)',
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

        // Efecto para filas de la tabla
        tableRows: {
            selector: '.table tbody tr:not(.no-results)',
            hoverIn: { 
                x: 5,
                backgroundColor: 'rgba(13, 110, 253, 0.05)'
            },
            hoverOut: { 
                x: 0,
                backgroundColor: 'transparent'
            },
            config: { 
                duration: 0.3, 
                ease: "power2.out"
            }
        },

        // Efecto para botones de acción
        actionButtons: {
            selector: '.btn-sm',
            hoverIn: { 
                y: -2,
                scale: 1.05
            },
            hoverOut: { 
                y: 0,
                scale: 1
            },
            config: { 
                duration: 0.2, 
                ease: "power2.out"
            }
        },

        // Efecto para botón de nueva licencia
        newButton: {
            selector: '.btn-nuevo',
            hoverIn: { 
                y: -3,
                scale: 1.02,
                boxShadow: '0 6px 15px rgba(13, 110, 253, 0.3)'
            },
            hoverOut: { 
                y: 0,
                scale: 1,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            },
            config: { 
                duration: 0.3, 
                ease: "power2.out"
            }
        }
    };

    /**
     * Animación de entrada de los popups
     */
    static readonly POPUP_ENTRANCE = {
        container: {
            selector: '.popup-container',
            animation: {
                scale: 0.9,
                opacity: 0,
                duration: 0.4,
                ease: "back.out(1.7)"
            }
        },

        content: {
            selector: '.popup-container .designaciones-container, .popup-container .logs-container',
            animation: {
                y: 20,
                opacity: 0,
                duration: 0.5,
                delay: 0.1,
                ease: "power2.out"
            }
        }
    };

    /**
     * Animación para botones al hacer clic
     */
    static readonly BUTTON_CLICK = {
        // Efecto de "press" y "release" para botones
        pressEffect: {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.out"
        },
        releaseEffect: {
            scale: 1,
            duration: 0.2,
            ease: "back.out(1.7)"
        }
    };

    /**
     * Animación para badges de estado
     */
    static readonly BADGE_ANIMATION = {
        // Animación para badges de estado
        estadoBadges: {
            selector: '.badge-estado',
            animation: {
                scale: 1.1,
                duration: 0.3,
                yoyo: true,
                ease: "power2.inOut"
            }
        }
    };

    /**
     * Transiciones de ordenamiento
     */
    static readonly SORT_TRANSITION = {
        // Efecto cuando se cambia el ordenamiento
        tableUpdate: {
            selector: '.table tbody',
            fadeOut: {
                opacity: 0,
                duration: 0.3,
                ease: "power2.inOut"
            },
            fadeIn: {
                opacity: 1,
                duration: 0.5,
                ease: "power2.out"
            }
        },

        // Efecto en headers de ordenamiento
        sortHeaders: {
            selector: '.sortable-header.active',
            animation: {
                backgroundColor: 'rgba(13, 110, 253, 0.15)',
                duration: 0.3,
                ease: "power2.out"
            }
        }
    };

    /**
     * Efectos especiales para indicadores de datos
     */
    static readonly DATA_INDICATORS = {
        // Animación para números y estadísticas
        numbers: {
            selector: '.table td:first-child, .pagination .page-link',
            animation: {
                scale: 1.15,
                duration: 0.2,
                yoyo: true,
                ease: "power2.inOut"
            }
        },

        // Efecto para estado vacío
        emptyState: {
            selector: '.empty-state-cell',
            animation: {
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out"
            }
        }
    };

    /**
     * Animaciones específicas para contenido de popups
     */
    static readonly POPUP_CONTENT = {
        // Animación para items de designaciones en popup
        designacionItems: {
            selector: '.designacion-item',
            animation: {
                x: -20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: "power2.out"
            }
        },

        // Animación para items de logs en popup
        logItems: {
            selector: '.log-item',
            animation: {
                y: 15,
                opacity: 0,
                duration: 0.3,
                stagger: 0.08,
                ease: "power2.out"
            }
        },

        // Animación para badges activos/inactivos en designaciones
        statusBadges: {
            selector: '.status-badge',
            animation: {
                scale: 1.1,
                duration: 0.2,
                yoyo: true,
                ease: "power2.inOut"
            }
        }
    };

    /**
     * Efectos especiales para licencias
     */
    static readonly LICENCIA_EFFECTS = {
        // Animación para fechas de licencia
        fechasLicencia: {
            selector: '.fecha-licencia',
            animation: {
                scale: 1.05,
                duration: 0.2,
                ease: "power2.out"
            }
        },

        // Animación para tipos de licencia
        tiposLicencia: {
            selector: '.tipo-licencia',
            animation: {
                color: '#007bff',
                duration: 0.3,
                ease: "power2.out"
            }
        }
    };
}
