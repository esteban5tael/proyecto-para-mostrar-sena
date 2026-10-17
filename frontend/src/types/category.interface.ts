// /src/types/category.interface.ts

/**
 * Re-export de los tipos del dominio categoría.
 * La fuente de verdad es src/schemas/category.schema.ts;
 * este archivo se mantiene por compatibilidad con los
 * imports existentes.
 * @module src/types/category.interface
 */

export type {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "@/schemas/category.schema";
