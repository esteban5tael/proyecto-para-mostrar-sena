// /src/types/category.interface.ts

import type { Product } from "./product.interface";

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
