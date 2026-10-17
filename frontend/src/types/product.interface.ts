// /src/types/product.interface.ts

export interface Product {
    id:          string;
    name:        string;
    description: string;
    price:       string;
    stock:       number;
    isActive:    boolean;
    categoryId:  string;
    createdAt:   Date;
    updatedAt:   Date;
}