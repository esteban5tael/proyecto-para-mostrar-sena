// /src/queries/category/mutations.ts

/**
 * Hooks de mutación (escritura) del dominio categoría.
 * Lógica de datos pura: sin toasts ni navegación dentro de
 * los hooks — esa responsabilidad es de la página
 * consumidora. Tras cada éxito se invalida categoryKeys.all.
 * @module src/queries/category/mutations
 */

import {
    useMutation,
    useQueryClient,
    type UseMutationOptions,
    type UseMutationResult,
} from "@tanstack/react-query";

import {
    createCategory,
    deleteCategory,
    updateCategory,
} from "@/services/category.service";
import type {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "@/schemas/category.schema";

import { ApiError } from "./queries";
import { categoryKeys } from "./keys";

/**
 * Variables de la mutación de actualización de categoría.
 */
export interface UpdateCategoryVariables {
    /** Identificador de la categoría a actualizar */
    id: string;
    /** Campos a actualizar (payload parcial) */
    payload: UpdateCategoryDto;
}

/**
 * Hook para crear una categoría.
 * Invalida todo el dominio categoría tras el éxito.
 * El consumidor debe manejar redirección y toast:
 *
 * @param options - Opciones de useMutation (onSuccess, onError, etc.)
 * @returns Resultado de la mutación con Category o ApiError
 *
 * @example
 * const navigate = useNavigate();
 * const { mutate, isPending } = useCreateCategory({
 *   onSuccess: (category) => {
 *     toast.success("Categoría creada", { description: category.name });
 *     navigate("/categories");
 *   },
 *   onError: (error) => {
 *     if (error instanceof ApiError && error.errors.length > 1) {
 *       toast.error("Errores de validación", {
 *         description: error.errors.join("\n"),
 *       });
 *     } else {
 *       toast.error("Error al crear categoría", { description: error.message });
 *     }
 *   },
 * });
 */
export function useCreateCategory(
    options?: UseMutationOptions<Category, ApiError, CreateCategoryDto>
): UseMutationResult<Category, ApiError, CreateCategoryDto> {
    const queryClient = useQueryClient();

    return useMutation<Category, ApiError, CreateCategoryDto>({
        mutationFn: async (payload) => {
            const res = await createCategory(payload);
            if (!res.success) {
                throw new ApiError(res.statusCode, res.message, res.errors);
            }
            return res.data;
        },
        // La invalidación corre primero; el callback del
        // consumidor se ejecuta después.
        onSuccess: (data, variables, onMutateResult, context) => {
            void queryClient.invalidateQueries({ queryKey: categoryKeys.all });
            options?.onSuccess?.(data, variables, onMutateResult, context);
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
 * Hook para actualizar una categoría existente.
 * Invalida todo el dominio categoría tras el éxito.
 * El consumidor debe manejar redirección y toast:
 *
 * @param options - Opciones de useMutation (onSuccess, onError, etc.)
 * @returns Resultado de la mutación con Category o ApiError
 *
 * @example
 * const navigate = useNavigate();
 * const { mutate, isPending } = useUpdateCategory({
 *   onSuccess: (category) => {
 *     toast.success("Categoría actualizada", { description: category.name });
 *     navigate(`/categories/${category.id}`);
 *   },
 *   onError: (error) => {
 *     if (error instanceof ApiError && error.errors.length > 1) {
 *       toast.error("Errores de validación", {
 *         description: error.errors.join("\n"),
 *       });
 *     } else {
 *       toast.error("Error al actualizar categoría", {
 *         description: error.message,
 *       });
 *     }
 *   },
 * });
 */
export function useUpdateCategory(
    options?: UseMutationOptions<Category, ApiError, UpdateCategoryVariables>
): UseMutationResult<Category, ApiError, UpdateCategoryVariables> {
    const queryClient = useQueryClient();

    return useMutation<Category, ApiError, UpdateCategoryVariables>({
        mutationFn: async ({ id, payload }) => {
            const res = await updateCategory(id, payload);
            if (!res.success) {
                throw new ApiError(res.statusCode, res.message, res.errors);
            }
            return res.data;
        },
        onSuccess: (data, variables, onMutateResult, context) => {
            void queryClient.invalidateQueries({ queryKey: categoryKeys.all });
            options?.onSuccess?.(data, variables, onMutateResult, context);
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
 * Hook para eliminar (soft-delete) una categoría.
 * El backend marca isActive = false; la invalidación
 * refresca el listado sin tocar la caché manualmente.
 * El consumidor debe manejar navegación y toast:
 *
 * @param options - Opciones de useMutation (onSuccess, onError, etc.)
 * @returns Resultado de la mutación con void o ApiError
 *
 * @example
 * const navigate = useNavigate();
 * const { mutate, isPending } = useDeleteCategory({
 *   onSuccess: () => {
 *     toast.success("Categoría eliminada");
 *     navigate("/categories");
 *   },
 *   onError: (error) => {
 *     if (error instanceof ApiError && error.errors.length > 1) {
 *       toast.error("Errores de validación", {
 *         description: error.errors.join("\n"),
 *       });
 *     } else {
 *       toast.error("Error al eliminar categoría", { description: error.message });
 *     }
 *   },
 * });
 */
export function useDeleteCategory(
    options?: UseMutationOptions<void, ApiError, string>
): UseMutationResult<void, ApiError, string> {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: async (id) => {
            const res = await deleteCategory(id);
            if (!res.success) {
                throw new ApiError(res.statusCode, res.message, res.errors);
            }
        },
        onSuccess: (data, variables, onMutateResult, context) => {
            void queryClient.invalidateQueries({ queryKey: categoryKeys.all });
            options?.onSuccess?.(data, variables, onMutateResult, context);
        },
        onError: (error, variables, onMutateResult, context) => {
            options?.onError?.(error, variables, onMutateResult, context);
        },
        onSettled: (data, error, variables, onMutateResult, context) => {
            options?.onSettled?.(data, error, variables, onMutateResult, context);
        },
    });
}
