// /src/schemas/product.schema.ts

/**
 * Schemas Zod 4 del dominio producto.
 * Son la única fuente de verdad de los tipos del dominio:
 * Product, CreateProductDto y UpdateProductDto se infieren
 * desde estos schemas.
 * @module src/schemas/product.schema
 */

import { z } from "zod";

/**
 * Categoría anidada tal como la devuelven los endpoints de
 * producto: los mismos campos que una categoría pero SIN la
 * colección `products`, que estos endpoints no traen. Las
 * claves desconocidas se descartan, de modo que una respuesta
 * que sí la trajera no rompe el parseo.
 *
 * Se declara aquí en lugar de reutilizar `categorySchema`
 * porque la relación categoría → productos → categoría
 * formaría un ciclo de tipos que TypeScript no puede inferir
 * (`categorySchema.products` se tipa como `Product[]`).
 */
const productCategorySchema = z.object({
    id: z.uuid(),
    name: z.string().min(2).max(100),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().max(2000).nullable(),
    isActive: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

/**
 * Verifica que un número no tenga más de dos decimales, en
 * consistencia con `@IsNumber({ maxDecimalPlaces: 2 })` del
 * DTO del backend: es la misma regla del servidor, no una
 * restricción más estricta.
 *
 * @param valor - Número a comprobar
 * @returns true si el valor tiene como máximo dos decimales
 */
const tieneMaxDosDecimales = (valor: number): boolean =>
    // Se compara contra la multiplicación para evitar el error
    // de punto flotante de dividir y contar dígitos.
    Math.abs(Math.round(valor * 100) - valor * 100) < 1e-9;

/**
 * Schema que refleja la entidad Product completa tal como la
 * devuelve el API (GET /products y GET /products/:id).
 *
 * `price` llega como cadena decimal del driver de PostgreSQL
 * ("18.00"); la coerción la acepta como cadena o número y el
 * modelo la expone siempre como número.
 */
export const productSchema = z.object({
    id: z.uuid(),
    name: z.string().min(2).max(150),
    // El backend la guarda como text NULL y admite hasta 2000
    // caracteres, sin mínimo.
    description: z.string().max(2000).nullable(),
    price: z.coerce.number(),
    stock: z.coerce.number().int().min(0),
    isActive: z.boolean(),
    // Un producto pertenece a UNA sola categoría (ManyToOne).
    categoryId: z.uuid(),
    category: productCategorySchema,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

/**
 * Campos comunes a los payloads de creación y de actualización.
 * Se declaran una sola vez para no duplicar límites.
 */
const productPayloadSchema = z.object({
    name: z.string().min(2).max(150),
    // `@IsOptional()` en el DTO: se puede omitir; "" se convierte
    // en null del lado del servidor. Máximo 2000 como el backend.
    description: z.string().max(2000).optional(),
    // El backend recibe un número con `@Min(0)`.
    price: z.coerce.number().min(0),
    // El stock es un entero no negativo.
    stock: z.coerce.number().int().min(0),
    isActive: z.boolean().optional().default(true),
    // `@IsUUID('4')` en el DTO: obligatorio en creación.
    categoryId: z.uuid(),
});

/**
 * Schema del payload aceptado por POST /products.
 * `.strict()` rechaza campos desconocidos y el refinamiento
 * replica el límite de dos decimales del backend.
 */
export const createProductSchema = productPayloadSchema
    .strict()
    .refine((value) => tieneMaxDosDecimales(value.price), {
        message: "El precio admite como máximo dos decimales",
        path: ["price"],
    });

/**
 * Schema del payload aceptado por PATCH /products/:id.
 * Todos los campos son opcionales (el backend solo asigna los
 * que vienen) y el límite de decimales se mantiene.
 */
export const updateProductSchema = productPayloadSchema
    .partial()
    .strict()
    .refine(
        (value) =>
            value.price === undefined || tieneMaxDosDecimales(value.price),
        {
            message: "El precio admite como máximo dos decimales",
            path: ["price"],
        }
    );

/** Entidad Product inferida desde el schema. */
export type Product = z.infer<typeof productSchema>;

/** Payload de creación inferido desde el schema. */
export type CreateProductDto = z.infer<typeof createProductSchema>;

/** Payload de actualización inferido desde el schema. */
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
