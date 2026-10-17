// /src/queries/category/queries.ts

/**
 * Hooks de consulta (lectura) del dominio categoría.
 * Los queryFn lanzan ApiError cuando la respuesta del API
 * no tiene éxito, para que React Query gestione el error
 * como un error real (semántica option A).
 * @module src/queries/category/queries
 */

import {
    useQuery,
    type QueryKey,
    type UseQueryOptions,
    type UseQueryResult,
} from "@tanstack/react-query";

import {
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
} from "@/services/category.service";
import type { Category } from "@/schemas/category.schema";

import { categoryKeys } from "./keys";

/**
 * Error tipado que transporta el statusCode de NestJS y el
 * array de errores normalizados, para que la UI pueda
 * mostrarlos (por ejemplo, en un toast con join("\n")).
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

/**
 * Opciones configurables para los hooks de consulta de
 * categorías. `queryKey` y `queryFn` quedan reservados
 * al hook, por eso se omiten del tipo.
 */
export type CategoryQueryOptions<
    TQueryFnData = Category[],
    TData = TQueryFnData,
> = Omit<
    UseQueryOptions<TQueryFnData, Error, TData, QueryKey>,
    "queryKey" | "queryFn"
>;

/**
 * Hook para obtener todas las categorías.
 *
 * @param options - Opciones adicionales de useQuery (enabled, select, etc.)
 * @returns Resultado de la query con Category[] o Error
 *
 * @example
 * const { data: categories, isLoading, isError } = useCategories();
 */
export function useCategories(
    options?: CategoryQueryOptions
): UseQueryResult<Category[], Error> {
    return useQuery<Category[], Error, Category[], QueryKey>({
        queryKey: categoryKeys.lists(),
        queryFn: async () => {
            const res = await getAllCategories();
            if (!res.success) {
                throw new ApiError(res.statusCode, res.message, res.errors);
            }
            return res.data;
        },
        ...options,
    });
}

/**
 * Hook para obtener una categoría por su id.
 * La query queda deshabilitada si el id está vacío.
 *
 * @param id - Identificador único de la categoría
 * @param options - Opciones adicionales de useQuery
 * @returns Resultado de la query con Category o Error
 *
 * @example
 * const { data: category } = useCategory(id, { enabled: Boolean(id) });
 */
export function useCategory(
    id: string,
    options?: CategoryQueryOptions<Category>
): UseQueryResult<Category, Error> {
    const { enabled = true, ...rest } = options ?? {};

    return useQuery<Category, Error, Category, QueryKey>({
        queryKey: categoryKeys.detail(id),
        queryFn: async () => {
            const res = await getCategoryById(id);
            if (!res.success) {
                throw new ApiError(res.statusCode, res.message, res.errors);
            }
            return res.data;
        },
        ...rest,
        enabled: Boolean(id) && enabled,
    });
}

/**
 * Hook para obtener una categoría por su slug.
 * La query queda deshabilitada si el slug está vacío.
 *
 * @param slug - Slug kebab-case de la categoría
 * @param options - Opciones adicionales de useQuery
 * @returns Resultado de la query con Category o Error
 *
 * @example
 * const { data: category } = useCategoryBySlug(slug);
 */
export function useCategoryBySlug(
    slug: string,
    options?: CategoryQueryOptions<Category>
): UseQueryResult<Category, Error> {
    const { enabled = true, ...rest } = options ?? {};

    return useQuery<Category, Error, Category, QueryKey>({
        queryKey: categoryKeys.bySlug(slug),
        queryFn: async () => {
            const res = await getCategoryBySlug(slug);
            if (!res.success) {
                throw new ApiError(res.statusCode, res.message, res.errors);
            }
            return res.data;
        },
        ...rest,
        enabled: Boolean(slug) && enabled,
    });
}
