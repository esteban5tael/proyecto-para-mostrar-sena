// /src/components/product/product-detail.tsx

/**
 * Tarjeta de detalle de un producto (modo vista).
 * Muestra los campos como lista de definiciones; las
 * acciones pertenecen a la página, no a este componente.
 * @module src/components/product/product-detail
 */

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

/** Props de la tarjeta de detalle. */
type ProductDetailProps = {
    /** Producto cargado a mostrar */
    product: Product;
};

/**
 * Renderiza el detalle completo de un producto: categoría,
 * precio, stock, estado y fechas formateadas en locale es-CO.
 */
export function ProductDetail({ product }: ProductDetailProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>
                    {product.description ?? "Sin descripción"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <dl className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Categoría
                        </dt>
                        <dd>{product.category.name}</dd>
                    </div>

                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Precio
                        </dt>
                        <dd className="font-semibold">
                            {formatPrice(product.price)}
                        </dd>
                    </div>

                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Stock
                        </dt>
                        <dd>{product.stock}</dd>
                    </div>

                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Estado
                        </dt>
                        <dd>
                            <Badge
                                variant={
                                    product.isActive ? "default" : "secondary"
                                }
                            >
                                {product.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                        </dd>
                    </div>

                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Creado
                        </dt>
                        <dd className="text-sm">
                            {product.createdAt.toLocaleString("es-CO", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </dd>
                    </div>

                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Actualizado
                        </dt>
                        <dd className="text-sm">
                            {product.updatedAt.toLocaleString("es-CO", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </dd>
                    </div>
                </dl>
            </CardContent>
        </Card>
    );
}
