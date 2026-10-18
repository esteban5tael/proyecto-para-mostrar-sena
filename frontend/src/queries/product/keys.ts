// /src/queries/product/keys.ts

/**
 * Factory de query keys del dominio producto.
 * Todas las keys derivan de `productKeys.all` para poder
 * invalidar el dominio completo con una sola llamada.
 * @module src/queries/product/keys
 */

/**
 * Query keys tipadas del dominio producto.
 * Usar siempre estas constantes — nunca strings inline.
 */
export const productKeys = {
    /** Raíz del dominio: ["products"] */
    all: ["products"] as const,
    /** Colección de listados: ["products", "list"] */
    lists: () => [...productKeys.all, "list"] as const,
    /** Listado con filtros: ["products", "list", filters] */
    list: (filters?: Record<string, unknown>) =>
        [...productKeys.lists(), filters ?? {}] as const,
    /** Colección de detalles: ["products", "detail"] */
    details: () => [...productKeys.all, "detail"] as const,
    /** Detalle por id: ["products", "detail", id] */
    detail: (id: string) => [...productKeys.details(), id] as const,
} as const;
