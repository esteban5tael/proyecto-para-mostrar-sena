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
  description: z.string().min(10).max(500),
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
    description: z.string().min(10).max(500),
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
