// /src/types/product.interface.ts

/**
 * Re-export de los tipos del dominio producto.
 * La fuente de verdad es src/schemas/product.schema.ts;
 * este archivo se mantiene por compatibilidad con los
 * imports existentes.
 * @module src/types/product.interface
 */

export type {
    Product,
    CreateProductDto,
    UpdateProductDto,
} from "@/schemas/product.schema";
