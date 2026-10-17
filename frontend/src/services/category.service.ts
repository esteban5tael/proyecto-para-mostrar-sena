// /src/services/category.service.ts

/**
 * Capa de servicios del recurso categorías.
 * Cada función valida la respuesta del API con el schema
 * de Zod antes de devolver un GeneralResponse exitoso;
 * los errores se normalizan con el helper toFail.
 * @module src/services/category.service
 */

import api, { toFail } from "@/lib/axios";
import { categorySchema } from "@/schemas/category.schema";
import type {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "@/schemas/category.schema";
import type { GeneralResponse } from "@/types/general-response.interface";
import { fail, ok } from "@/types/general-response.interface";

const BASE = "/categories";

/**
 * Convierte los issues de validación de Zod en mensajes
 * legibles para la UI, incluyendo el campo afectado.
 *
 * @param issues - Issues crudos de ZodError
 * @returns Array de mensajes "campo: mensaje"
 */
const mapIssues = (
    issues: ReadonlyArray<{ readonly path: PropertyKey[]; message: string }>
): string[] =>
    issues.map((issue) => {
        const campo = issue.path.join(".");
        return campo ? `${campo}: ${issue.message}` : issue.message;
    });

/**
 * Obtiene todas las categorías del API.
 *
 * @returns GeneralResponse con Category[] o error normalizado
 */
export const getAllCategories = async (): Promise<
    GeneralResponse<Category[]>
> => {
    try {
        const { data } = await api.get<Category[]>(BASE);
        const parsed = categorySchema.array().safeParse(data);
        if (!parsed.success) {
            return fail(
                500,
                "Respuesta del servidor no válida",
                mapIssues(parsed.error.issues)
            );
        }
        return ok(parsed.data);
    } catch (e) {
        return toFail<Category[]>(e);
    }
};

/**
 * Obtiene una categoría por su id.
 *
 * @param id - Identificador único de la categoría
 * @returns GeneralResponse con Category o error normalizado
 */
export const getCategoryById = async (
    id: string
): Promise<GeneralResponse<Category>> => {
    try {
        const { data } = await api.get<Category>(`${BASE}/${id}`);
        const parsed = categorySchema.safeParse(data);
        if (!parsed.success) {
            return fail(
                500,
                "Respuesta del servidor no válida",
                mapIssues(parsed.error.issues)
            );
        }
        return ok(parsed.data);
    } catch (e) {
        return toFail<Category>(e);
    }
};

/**
 * Obtiene una categoría por su slug.
 *
 * @param slug - Slug kebab-case de la categoría
 * @returns GeneralResponse con Category o error normalizado
 */
export const getCategoryBySlug = async (
    slug: string
): Promise<GeneralResponse<Category>> => {
    try {
        const { data } = await api.get<Category>(`${BASE}/slug/${slug}`);
        const parsed = categorySchema.safeParse(data);
        if (!parsed.success) {
            return fail(
                500,
                "Respuesta del servidor no válida",
                mapIssues(parsed.error.issues)
            );
        }
        return ok(parsed.data);
    } catch (e) {
        return toFail<Category>(e);
    }
};

/**
 * Crea una categoría en el API.
 * El slug lo genera el backend; no se envía en el payload.
 *
 * @param payload - Datos validados de la categoría a crear
 * @returns GeneralResponse con la Category creada o error normalizado
 */
export const createCategory = async (
    payload: CreateCategoryDto
): Promise<GeneralResponse<Category>> => {
    try {
        const { data } = await api.post<Category>(BASE, payload);
        const parsed = categorySchema.safeParse(data);
        if (!parsed.success) {
            return fail(
                500,
                "Respuesta del servidor no válida",
                mapIssues(parsed.error.issues)
            );
        }
        return ok(parsed.data);
    } catch (e) {
        return toFail<Category>(e);
    }
};

/**
 * Actualiza parcialmente una categoría existente.
 * El slug no es editable en el backend.
 *
 * @param id - Identificador de la categoría a actualizar
 * @param payload - Campos a actualizar (parcial)
 * @returns GeneralResponse con la Category actualizada o error normalizado
 */
export const updateCategory = async (
    id: string,
    payload: UpdateCategoryDto
): Promise<GeneralResponse<Category>> => {
    try {
        const { data } = await api.patch<Category>(`${BASE}/${id}`, payload);
        const parsed = categorySchema.safeParse(data);
        if (!parsed.success) {
            return fail(
                500,
                "Respuesta del servidor no válida",
                mapIssues(parsed.error.issues)
            );
        }
        return ok(parsed.data);
    } catch (e) {
        return toFail<Category>(e);
    }
};

/**
 * Elimina una categoría (soft-delete en el backend:
 * marca isActive = false internamente).
 *
 * @param id - Identificador de la categoría a eliminar
 * @returns GeneralResponse con data null o error normalizado
 */
export const deleteCategory = async (
    id: string
): Promise<GeneralResponse<null>> => {
    try {
        // El backend hace soft-delete (isActive = false)
        // internamente y responde { message } o vacío.
        await api.delete(`${BASE}/${id}`);
        return ok(null);
    } catch (e) {
        return toFail<null>(e);
    }
};
