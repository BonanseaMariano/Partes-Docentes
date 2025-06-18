/**
 * Configuración de animaciones GSAP para el componente Personas
 * Basado en el patrón establecido en parte-diario
 */
export class PersonasAnimations {

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
        designationButtons: {
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
        designationButtonsEmpty: {
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

        // Efecto para botón de nueva persona (igual que divisiones)
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
     * Animación de entrada del popup de designaciones
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
            selector: '.popup-container .table-responsive',
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
     * Animación para contadores/números
     */
    static readonly COUNTER_ANIMATION = {
        numbers: {
            selector: '.btn-popup span, .pagination .page-link',
            animation: {
                scale: 1.2,
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
}
