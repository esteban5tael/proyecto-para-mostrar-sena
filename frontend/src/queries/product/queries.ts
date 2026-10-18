// /src/queries/product/queries.ts

/**
 * Hooks de consulta (lectura) del dominio producto.
 * Los queryFn lanzan ApiError cuando la respuesta del API
 * no tiene éxito, para que React Query gestione el error
 * como un error real (misma semántica que categorías).
 * @module src/queries/product/queries
 */

import {
    useQuery,
    type QueryKey,
    type UseQueryOptions,
    type UseQueryResult,
} from "@tanstack/react-query";

import {
    getAllProducts,
    getProductById,
} from "@/services/product.service";
import type { Product } from "@/schemas/product.schema";
import { ApiError } from "@/queries/api-error";

import { productKeys } from "./keys";

/**
 * Opciones configurables para los hooks de consulta de
 * productos. `queryKey` y `queryFn` quedan reservados
 * al hook, por eso se omiten del tipo.
 */
export type ProductQueryOptions<
    TQueryFnData = Product[],
    TData = TQueryFnData,
> = Omit<
    UseQueryOptions<TQueryFnData, Error, TData, QueryKey>,
    "queryKey" | "queryFn"
>;

/**
 * Hook para obtener todos los productos activos del catálogo.
 * El backend no ofrece paginación ni filtros: el filtrado por
 * nombre y categoría se hace en cliente.
 *
 * @param options - Opciones adicionales de useQuery (select, etc.)
 * @returns Resultado de la query con Product[] o Error
 *
 * @example
 * const { data: products, isLoading } = useProducts();
 */
export function useProducts(
    options?: ProductQueryOptions
): UseQueryResult<Product[], Error> {
    return useQuery<Product[], Error, Product[], QueryKey>({
        queryKey: productKeys.lists(),
        queryFn: async () => {
            const res = await getAllProducts();
            if (!res.success) {
                throw new ApiError(res.statusCode, res.message, res.errors);
            }
            return res.data;
        },
        ...options,
    });
}

/**
 * Hook para obtener un producto por su id.
 * La query queda deshabilitada si el id está vacío.
 *
 * @param id - Identificador único del producto
 * @param options - Opciones adicionales de useQuery
 * @returns Resultado de la query con Product o Error
 *
 * @example
 * const { data: product } = useProduct(id, { enabled: Boolean(id) });
 */
export function useProduct(
    id: string,
    options?: ProductQueryOptions<Product>
): UseQueryResult<Product, Error> {
    const { enabled = true, ...rest } = options ?? {};

    return useQuery<Product, Error, Product, QueryKey>({
        queryKey: productKeys.detail(id),
        queryFn: async () => {
            const res = await getProductById(id);
            if (!res.success) {
                throw new ApiError(res.statusCode, res.message, res.errors);
            }
            return res.data;
        },
        ...rest,
        enabled: Boolean(id) && enabled,
    });
}
