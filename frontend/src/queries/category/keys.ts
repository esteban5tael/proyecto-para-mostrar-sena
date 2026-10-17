// /src/queries/category/keys.ts

/**
 * Factory de query keys del dominio categoría.
 * Todas las keys derivan de `categoryKeys.all` para poder
 * invalidar el dominio completo con una sola llamada.
 * @module src/queries/category/keys
 */

/**
 * Query keys tipadas del dominio categoría.
 * Usar siempre estas constantes — nunca strings inline.
 */
export const categoryKeys = {
    /** Raíz del dominio: ["categories"] */
    all: ["categories"] as const,
    /** Colección de listados: ["categories", "list"] */
    lists: () => [...categoryKeys.all, "list"] as const,
    /** Listado con filtros: ["categories", "list", filters] */
    list: (filters?: Record<string, unknown>) =>
        [...categoryKeys.lists(), filters ?? {}] as const,
    /** Colección de detalles: ["categories", "detail"] */
    details: () => [...categoryKeys.all, "detail"] as const,
    /** Detalle por id: ["categories", "detail", id] */
    detail: (id: string) => [...categoryKeys.details(), id] as const,
    /** Detalle por slug: ["categories", "slug", slug] */
    bySlug: (slug: string) => [...categoryKeys.all, "slug", slug] as const,
} as const;
