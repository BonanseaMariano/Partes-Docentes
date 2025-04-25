export interface ArticuloLicencia {
    /**
     * ID del artículo de licencia, generado automáticamente
     */
    id?: number;

    /**
     * Artículo de licencia, es único y no nulo
     */
    articulo: string;

    /**
     * Descripción del artículo de licencia
     */
    descripcion?: string;
}