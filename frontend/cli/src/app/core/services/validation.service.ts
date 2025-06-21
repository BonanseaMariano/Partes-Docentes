import { Injectable } from '@angular/core';
import { Observable, of, map, catchError, forkJoin, switchMap } from 'rxjs';
import { CargoService } from '../../cargo/service/cargo.service';
import { PersonaService } from '../../persona/service/persona.service';
import { ModalService } from '../../modal/modal.service';
import { Router } from '@angular/router';
import { DivisionService } from '../../division/service/division.service';

/**
 * Interfaz para resultado de validación del sistema.
 * 
 * Define la estructura estándar para los resultados de validaciones,
 * incluyendo estado, mensajes de error y opciones de redirección.
 */
export interface ValidationResult {
    /** Indica si la validación fue exitosa */
    isValid: boolean;
    /** Mensaje de error principal */
    errorMessage?: string;
    /** Título del error para modales */
    errorTitle?: string;
    /** Descripción detallada del error */
    errorDescription?: string;
    /** URL de redirección en caso de error */
    redirectTo?: string;
}

/**
 * Servicio para validaciones de integridad y prerrequisitos del sistema.
 * 
 * Proporciona validaciones de reglas de negocio que deben cumplirse antes
 * de realizar ciertas operaciones, como verificar la existencia de entidades
 * dependientes antes de crear nuevos registros. Incluye manejo automático
 * de feedback al usuario y redirecciones inteligentes.
 * 
 * @author Mariano Bonansea
 * @version 1.0
 */
@Injectable({
    providedIn: 'root'
})
export class ValidationService {
    /**
     * Constructor del servicio.
     * 
     * @param cargoService Servicio para gestión de cargos
     * @param personaService Servicio para gestión de personas
     * @param divisionService Servicio para gestión de divisiones
     * @param modalService Servicio para mostrar modales de usuario
     * @param router Router de Angular para navegación
     */
    constructor(
        private cargoService: CargoService,
        private personaService: PersonaService,
        private divisionService: DivisionService,
        private modalService: ModalService,
        private router: Router
    ) { }

    /**
     * Valida si es posible crear una nueva designación
     * Verifica que existan personas y cargos en el sistema
     * @returns Observable con el resultado de la validación
     */
    canCreateDesignacion(): Observable<ValidationResult> {
        return forkJoin({
            personas: this.personaService.all().pipe(
                map(response => response.data || []),
                catchError(() => of([]))
            ),
            cargos: this.cargoService.all().pipe(
                map(response => response.data || []),
                catchError(() => of([]))
            )
        }).pipe(
            map(results => {
                const hayPersonas = Array.isArray(results.personas) && results.personas.length > 0;
                const hayCargos = Array.isArray(results.cargos) && results.cargos.length > 0;

                if (!hayPersonas && !hayCargos) {
                    return {
                        isValid: false,
                        errorTitle: 'No se puede crear designación',
                        errorMessage: 'No existen personas ni cargos en el sistema',
                        errorDescription: 'Debe crear al menos una persona y un cargo antes de poder crear una designación',
                        redirectTo: '/personas/new'
                    };
                } else if (!hayPersonas) {
                    return {
                        isValid: false,
                        errorTitle: 'No se puede crear designación',
                        errorMessage: 'No existen personas en el sistema',
                        errorDescription: 'Debe crear al menos una persona antes de poder crear una designación',
                        redirectTo: '/personas/new'
                    };
                } else if (!hayCargos) {
                    return {
                        isValid: false,
                        errorTitle: 'No se puede crear designación',
                        errorMessage: 'No existen cargos en el sistema',
                        errorDescription: 'Debe crear al menos un cargo antes de poder crear una designación',
                        redirectTo: '/cargos/new'
                    };
                }

                return { isValid: true };
            })
        );
    }

    /**
     * Valida un requisito y muestra un mensaje de error si no se cumple
     * @param validationFn Función de validación que devuelve un observable con el resultado
     * @returns Observable<boolean> que indica si la validación fue exitosa
     */
    validateWithFeedback(validationFn: () => Observable<ValidationResult>): Observable<boolean> {
        return validationFn().pipe(
            map(result => {
                if (!result.isValid) {
                    this.modalService.error(
                        result.errorTitle || 'Error de validación',
                        result.errorMessage || 'No se puede realizar esta operación',
                        result.errorDescription || ''
                    ).then(() => {
                        if (result.redirectTo) {
                            this.router.navigateByUrl(result.redirectTo);
                        }
                    });
                    return false;
                }
                return true;
            })
        );
    }

    /**
     * Valida si existen divisiones en el sistema
     * @returns Observable con el resultado de la validación
     */
    checkDivisiones(): Observable<ValidationResult> {
        return this.divisionService.all().pipe(
            map(response => {
                const divisiones = response.data || [];
                const hayDivisiones = Array.isArray(divisiones) && divisiones.length > 0;

                if (!hayDivisiones) {
                    return {
                        isValid: false,
                        errorTitle: 'No existen divisiones',
                        errorMessage: 'No hay divisiones en el sistema',
                        errorDescription: 'Solo se podrán crear cargos de tipo "Cargo". Los cargos de tipo "Espacio Curricular" requieren una división asociada.',
                        redirectTo: undefined
                    };
                }

                return { isValid: true };
            }),
            catchError(() => of({
                isValid: false,
                errorTitle: 'Error de conexión',
                errorMessage: 'No se pudo verificar si existen divisiones',
                errorDescription: 'Hubo un error al intentar comprobar si existen divisiones en el sistema.'
            }))
        );
    }

    /**
     * Valida un requisito y solicita confirmación si no se cumple
     * @param validationFn Función de validación que devuelve un observable con el resultado
     * @returns Observable<boolean> que indica si se debe continuar con la operación
     */
    validateWithConfirmation(validationFn: () => Observable<ValidationResult>): Observable<boolean> {
        return validationFn().pipe(
            switchMap(result => {
                if (!result.isValid) {
                    return new Observable<boolean>(observer => {
                        this.modalService.confirm(
                            result.errorTitle || 'Confirmación requerida',
                            result.errorMessage || '¿Desea continuar?',
                            result.errorDescription || ''
                        ).then(
                            () => {
                                // Si confirma, continuar con la operación
                                if (result.redirectTo) {
                                    this.router.navigateByUrl(result.redirectTo);
                                }
                                observer.next(true);
                                observer.complete();
                            },
                            () => {
                                // Si cancela, no continuar
                                observer.next(false);
                                observer.complete();
                            }
                        );
                    });
                }
                return of(true);
            })
        );
    }
}