export enum Estado {
    VALIDO = 'VALIDO',
    INVALIDO = 'INVALIDO'
}

/**
 * Traducciones para mostrar los estados en español
 */
export const EstadoLabels: Record<Estado, string> = {
    [Estado.VALIDO]: 'Válido',
    [Estado.INVALIDO]: 'Inválido'
}