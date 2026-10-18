// /src/services/product.service.ts

/**
 * Capa de servicios del recurso productos.
 * Cada función valida la respuesta del API con el schema
 * de Zod antes de devolver un GeneralResponse exitoso;
 * los errores se normalizan con el helper toFail.
 * @module src/services/product.service
 */

import api, { toFail } from "@/lib/axios";
import { productSchema } from "@/schemas/product.schema";
import type {
    Product,
    CreateProductDto,
    UpdateProductDto,
} from "@/schemas/product.schema";
import { z } from "zod";
import type { GeneralResponse } from "@/types/general-response.interface";
import { fail, ok } from "@/types/general-response.interface";

const BASE = "/products";

/**
 * Schema del cuerpo que devuelve DELETE /products/:id.
 * A diferencia de categorías (204 sin cuerpo), el backend
 * responde 200 con `{ id, deleted: true }`.
 */
const deleteProductResponseSchema = z.object({
    id: z.uuid(),
    deleted: z.literal(true),
});

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
 * Obtiene todos los productos activos del API.
 * Solo se devuelven productos activos cuya categoría también
 * esté activa; no hay paginación ni filtros del servidor.
 *
 * @returns GeneralResponse con Product[] o error normalizado
 */
export const getAllProducts = async (): Promise<
    GeneralResponse<Product[]>
> => {
    try {
        const { data } = await api.get<Product[]>(BASE);
        const parsed = productSchema.array().safeParse(data);
        if (!parsed.success) {
            return fail(
                500,
                "Respuesta del servidor no válida",
                mapIssues(parsed.error.issues)
            );
        }
        return ok(parsed.data);
    } catch (e) {
        return toFail<Product[]>(e);
    }
};

/**
 * Obtiene un producto por su id.
 *
 * @param id - Identificador único del producto
 * @returns GeneralResponse con Product o error normalizado
 */
export const getProductById = async (
    id: string
): Promise<GeneralResponse<Product>> => {
    try {
        const { data } = await api.get<Product>(`${BASE}/${id}`);
        const parsed = productSchema.safeParse(data);
        if (!parsed.success) {
            return fail(
                500,
                "Respuesta del servidor no válida",
                mapIssues(parsed.error.issues)
            );
        }
        return ok(parsed.data);
    } catch (e) {
        return toFail<Product>(e);
    }
};

/**
 * Crea un producto en el API.
 * El backend responde con el producto completo, incluida la
 * categoría ya resuelta.
 *
 * @param payload - Datos validados del producto a crear
 * @returns GeneralResponse con el Product creado o error normalizado
 */
export const createProduct = async (
    payload: CreateProductDto
): Promise<GeneralResponse<Product>> => {
    try {
        const { data } = await api.post<Product>(BASE, payload);
        const parsed = productSchema.safeParse(data);
        if (!parsed.success) {
            return fail(
                500,
                "Respuesta del servidor no válida",
                mapIssues(parsed.error.issues)
            );
        }
        return ok(parsed.data);
    } catch (e) {
        return toFail<Product>(e);
    }
};

/**
 * Actualiza parcialmente un producto existente.
 * El backend solo asigna los campos que vienen en el payload.
 *
 * @param id - Identificador del producto a actualizar
 * @param payload - Campos a actualizar (parcial)
 * @returns GeneralResponse con el Product actualizado o error normalizado
 */
export const updateProduct = async (
    id: string,
    payload: UpdateProductDto
): Promise<GeneralResponse<Product>> => {
    try {
        const { data } = await api.patch<Product>(`${BASE}/${id}`, payload);
        const parsed = productSchema.safeParse(data);
        if (!parsed.success) {
            return fail(
                500,
                "Respuesta del servidor no válida",
                mapIssues(parsed.error.issues)
            );
        }
        return ok(parsed.data);
    } catch (e) {
        return toFail<Product>(e);
    }
};

/**
 * Desactiva un producto (soft-delete en el backend: marca
 * isActive = false; el producto sigue existiendo pero deja
 * de aparecer en las consultas).
 *
 * El backend responde 200 con `{ id, deleted: true }`, a
 * diferencia del 204 de categorías; el cuerpo se valida para
 * detectar cambios de contrato, y la mutación no necesita el
 * dato, por eso se devuelve null.
 *
 * @param id - Identificador del producto a desactivar
 * @returns GeneralResponse con data null o error normalizado
 */
export const deleteProduct = async (
    id: string
): Promise<GeneralResponse<null>> => {
    try {
        const { data } = await api.delete(`${BASE}/${id}`);
        const parsed = deleteProductResponseSchema.safeParse(data);
        if (!parsed.success) {
            return fail(
                500,
                "Respuesta del servidor no válida",
                mapIssues(parsed.error.issues)
            );
        }
        return ok(null);
    } catch (e) {
        return toFail<null>(e);
    }
};
