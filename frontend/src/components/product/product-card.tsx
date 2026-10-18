// /src/components/product/product-card.tsx

/**
 * Tarjeta de un producto para el listado.
 * Muestra resumen (nombre, categoría, precio y stock) y las
 * acciones Ver / Editar / Desactivar.
 * @module src/components/product/product-card
 */

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

/** Props de la tarjeta de producto. */
type ProductCardProps = {
    /** Producto a representar */
    product: Product;
    /** Navega al detalle del producto */
    onView: (id: string) => void;
    /** Navega a la edición del producto */
    onEdit: (id: string) => void;
    /** Abre el diálogo de desactivación con este producto */
    onDelete: (product: Product) => void;
    /** true mientras la mutación de borrado está en curso sobre este producto */
    isDeleting?: boolean;
};

/**
 * Tarjeta del listado de productos.
 * El precio se formatea con dos decimales; el stock se muestra
 * como entero, coherente con la columna `int` del backend.
 */
export function ProductCard({
    product,
    onView,
    onEdit,
    onDelete,
    isDeleting = false,
}: ProductCardProps) {
    return (
        <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
                <CardTitle className="text-base">{product.name}</CardTitle>
                <span className="text-sm font-semibold">
                    {formatPrice(product.price)}
                </span>
            </CardHeader>
            <CardContent className="grid gap-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description ?? "Sin descripción"}
                </p>
                <div className="flex items-center gap-2 text-sm">
                    <span>{product.category.name}</span>
                    <span className="text-muted-foreground">
                        · {product.stock} en stock
                    </span>
                </div>
            </CardContent>
            <CardFooter className="gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onView(product.id)}
                >
                    Ver
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product.id)}
                >
                    Editar
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => onDelete(product)}
                >
                    Desactivar
                </Button>
            </CardFooter>
        </Card>
    );
}
