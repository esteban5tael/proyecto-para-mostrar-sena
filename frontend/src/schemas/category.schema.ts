// /src/schemas/category.schema.ts

/**
 * Schemas Zod 4 del dominio categoría.
 * Son la única fuente de verdad de los tipos del dominio:
 * Category, CreateCategoryDto y UpdateCategoryDto se
 * infieren desde estos schemas.
 * @module src/schemas/category.schema
 */

import { z } from "zod";
import type { Product } from "@/types/product.interface";

/**
 * Schema que refleja la entidad Category completa tal como
 * la devuelve el API (GET /categories y sus variantes).
 *
 * Nota: `products` se tipa como Product[] sin validación
 * interna de Zod en esta iteración; la validación del
 * array queda diferida a una iteración futura.
 */
export const categorySchema = z.object({
  id: z.uuid(),
  name: z.string().min(2).max(100),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  // El backend la guarda como text NULL y admite hasta 2000
  // caracteres, sin mínimo: el schema no impone más que el servidor.
  description: z.string().max(2000).nullable(),
  isActive: z.boolean(),
  // Product[] pasa "tal cual", sin validación interna
  products: z.array(z.custom<Product>(() => true)),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * Schema del payload aceptado por POST /categories.
 * `slug` no se incluye porque lo genera el backend;
 * `.strict()` rechaza campos desconocidos.
 */
export const createCategorySchema = z
  .object({
    name: z.string().min(2).max(100),
    // `@IsOptional()` en el DTO: se puede omitir; "" se convierte
    // en null del lado del servidor. Máximo 2000 como el backend.
    description: z.string().max(2000).optional(),
    isActive: z.boolean().optional().default(true),
  })
  .strict();

/**
 * Schema del payload aceptado por PATCH /categories/:id.
 * Todos los campos son opcionales y `slug` queda
 * prohibido (el backend no permite editarlos).
 */
export const updateCategorySchema = createCategorySchema
  .partial()
  .strict();

/** Entidad Category inferida desde el schema. */
export type Category = z.infer<typeof categorySchema>;

/** Payload de creación inferido desde el schema. */
export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

/** Payload de actualización inferido desde el schema. */
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
