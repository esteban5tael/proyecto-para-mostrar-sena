// /src/queries/api-error.ts

/**
 * Error tipado compartido por todos los dominios de queries.
 * Transporta el statusCode de NestJS y el array de errores
 * normalizados, para que la UI pueda mostrarlos (por ejemplo,
 * en un toast con join("\n")). Una sola clase por aplicación
 * para que `instanceof` funcione en cualquier dominio.
 * @module src/queries/api-error
 */

/**
 * Error que transporta el código HTTP y los errores de
 * validación devueltos por el API.
 */
export class ApiError extends Error {
    /** Código HTTP del error (0 si es de red) */
    readonly statusCode: number;
    /** Array de errores individuales (validación) */
    readonly errors: string[];

    /**
     * @param statusCode - Código HTTP del error (0 si es de red)
     * @param message - Mensaje normalizado del error
     * @param errors - Array de errores individuales (validación)
     */
    constructor(statusCode: number, message: string, errors: string[] = []) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errors = errors;
    }
}
