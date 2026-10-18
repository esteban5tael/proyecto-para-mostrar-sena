// /src/queries/product/mutations.ts

/**
 * Hooks de mutación (escritura) del dominio producto.
 * Lógica de datos pura: sin toasts ni navegación dentro de
 * los hooks — esa responsabilidad es de la página
 * consumidora. Tras cada éxito se invalidan productKeys.all
 * y categoryKeys.all.
 * @module src/queries/product/mutations
 */

import {
    useMutation,
    useQueryClient,
    type UseMutationOptions,
    type UseMutationResult,
} from "@tanstack/react-query";

import {
    createProduct,
    deleteProduct,
    updateProduct,
} from "@/services/product.service";
import type {
    Product,
    CreateProductDto,
    UpdateProductDto,
} from "@/schemas/product.schema";

import { ApiError } from "@/queries/api-error";

import { categoryKeys } from "../category/keys";
import { productKeys } from "./keys";

/**
 * Variables de la mutación de actualización de producto.
 */
export interface UpdateProductVariables {
    /** Identificador del producto a actualizar */
    id: string;
    /** Campos a actualizar (payload parcial) */
    payload: UpdateProductDto;
}

/**
 * Invalida el dominio producto y el dominio categoría.
 *
 * Categorías también se marca obsoleto porque el detalle de
 * una categoría expone su colección de productos: crear,
 * editar o desactivar un producto cambia ese dato.
 *
 * @param queryClient - Instancia del QueryClient activa
 */
const invalidarDominios = async (
    queryClient: ReturnType<typeof useQueryClient>
): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: productKeys.all });
    await queryClient.invalidateQueries({ queryKey: categoryKeys.all });
};

/**
 * Hook para crear un producto.
 * Invalida los dominios producto y categoría tras el éxito.
 * El consumidor debe manejar redirección y toast:
 *
 * @param options - Opciones de useMutation (onSuccess, onError, etc.)
 * @returns Resultado de la mutación con Product o ApiError
 *
 * @example
 * const navigate = useNavigate();
 * const { mutate, isPending } = useCreateProduct({
 *   onSuccess: (product) => {
 *     toast.success("Producto creado", { description: product.name });
 *     navigate(`/products/${product.id}`);
 *   },
 * });
 */
export function useCreateProduct(
    options?: UseMutationOptions<Product, ApiError, CreateProductDto>
): UseMutationResult<Product, ApiError, CreateProductDto> {
    const queryClient = useQueryClient();

    return useMutation<Product, ApiError, CreateProductDto>({
        mutationFn: async (payload) => {
            const res = await createProduct(payload);
            if (!res.success) {
                throw new ApiError(res.statusCode, res.message, res.errors);
            }
            return res.data;
        },
        // La invalidación corre primero y se espera; así mutateAsync
        // resuelve solo cuando el refetch de queries activas terminó.
        // El callback del consumidor se ejecuta después.
        onSuccess: async (data, variables, onMutateResult, context) => {
            await invalidarDominios(queryClient);
            await options?.onSuccess?.(data, variables, onMutateResult, context);
        },
        onError: (error, variables, onMutateResult, context) => {
            options?.onError?.(error, variables, onMutateResult, context);
        },
        onSettled: (data, error, variables, onMutateResult, context) => {
            options?.onSettled?.(data, error, variables, onMutateResult, context);
        },
    });
}

/**
 * Hook para actualizar un producto existente.
 * Invalida los dominios producto y categoría tras el éxito.
 * El consumidor debe manejar redirección y toast:
 *
 * @param options - Opciones de useMutation (onSuccess, onError, etc.)
 * @returns Resultado de la mutación con Product o ApiError
 *
 * @example
 * const navigate = useNavigate();
 * const { mutate, isPending } = useUpdateProduct({
 *   onSuccess: (product) => {
 *     toast.success("Producto actualizado", { description: product.name });
 *     navigate(`/products/${product.id}`);
 *   },
 * });
 */
export function useUpdateProduct(
    options?: UseMutationOptions<Product, ApiError, UpdateProductVariables>
): UseMutationResult<Product, ApiError, UpdateProductVariables> {
    const queryClient = useQueryClient();

    return useMutation<Product, ApiError, UpdateProductVariables>({
        mutationFn: async ({ id, payload }) => {
            const res = await updateProduct(id, payload);
            if (!res.success) {
                throw new ApiError(res.statusCode, res.message, res.errors);
            }
            return res.data;
        },
        onSuccess: async (data, variables, onMutateResult, context) => {
            await invalidarDominios(queryClient);
            await options?.onSuccess?.(data, variables, onMutateResult, context);
        },
        onError: (error, variables, onMutateResult, context) => {
            options?.onError?.(error, variables, onMutateResult, context);
        },
        onSettled: (data, error, variables, onMutateResult, context) => {
            options?.onSettled?.(data, error, variables, onMutateResult, context);
        },
    });
}

/**
 * Hook para desactivar (soft-delete) un producto.
 * El backend marca isActive = false y responde `{ id, deleted }`;
 * la invalidación refresca el listado y el detalle de la
 * categoría sin tocar la caché manualmente.
 * El consumidor debe manejar navegación y toast:
 *
 * @param options - Opciones de useMutation (onSuccess, onError, etc.)
 * @returns Resultado de la mutación con void o ApiError
 *
 * @example
 * const navigate = useNavigate();
 * const { mutate, isPending } = useDeleteProduct({
 *   onSuccess: () => {
 *     toast.success("Producto desactivado");
 *     navigate("/products");
 *   },
 * });
 */
export function useDeleteProduct(
    options?: UseMutationOptions<void, ApiError, string>
): UseMutationResult<void, ApiError, string> {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: async (id) => {
            const res = await deleteProduct(id);
            if (!res.success) {
                throw new ApiError(res.statusCode, res.message, res.errors);
            }
        },
        onSuccess: async (data, variables, onMutateResult, context) => {
            await invalidarDominios(queryClient);
            await options?.onSuccess?.(data, variables, onMutateResult, context);
        },
        onError: (error, variables, onMutateResult, context) => {
            options?.onError?.(error, variables, onMutateResult, context);
        },
        onSettled: (data, error, variables, onMutateResult, context) => {
            options?.onSettled?.(data, error, variables, onMutateResult, context);
        },
    });
}
