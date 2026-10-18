// /src/components/category/category-detail.tsx

/**
 * Tarjeta de detalle de una categoría (modo vista).
 * Muestra los campos como lista de definiciones; las
 * acciones pertenecen a la página, no a este componente.
 * @module src/components/category/category-detail
 */

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Category } from "@/types";
import { CategoryProductsList } from "./category-products-list";

/** Props de la tarjeta de detalle. */
type CategoryDetailProps = {
    /** Categoría cargada a mostrar */
    category: Category;
};

/**
 * Renderiza el detalle completo de una categoría: slug, estado, fechas
 * formateadas en locale es-CO y el listado de sus productos con
 * nombre y cantidad.
 */
export function CategoryDetail({ category }: CategoryDetailProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <dl className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">Slug</dt>
                        <dd>
                            <code className="text-sm">{category.slug}</code>
                        </dd>
                    </div>

                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Estado
                        </dt>
                        <dd>
                            <Badge
                                variant={
                                    category.isActive ? "default" : "secondary"
                                }
                            >
                                {category.isActive ? "Activa" : "Inactiva"}
                            </Badge>
                        </dd>
                    </div>

                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Creada
                        </dt>
                        <dd className="text-sm">
                            {category.createdAt.toLocaleString("es-CO", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </dd>
                    </div>

                    <div className="grid gap-1">
                        <dt className="text-sm text-muted-foreground">
                            Actualizada
                        </dt>
                        <dd className="text-sm">
                            {category.updatedAt.toLocaleString("es-CO", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </dd>
                    </div>
                </dl>

                <div className="mt-4">
                    <CategoryProductsList products={category.products} />
                </div>
            </CardContent>
        </Card>
    );
}
