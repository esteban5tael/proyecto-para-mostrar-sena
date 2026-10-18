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
import { ApiError } from "@/queries/api-error";

import { categoryKeys } from "./keys";

// Re-export para conservar la API pública del dominio categoría:
// los consumidores siguen importando ApiError desde "@/queries".
export { ApiError };

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
