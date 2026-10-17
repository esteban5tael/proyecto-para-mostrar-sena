// /src/components/category/category-card.tsx

/**
 * Tarjeta de una categoría para el listado.
 * Muestra resumen (nombre, estado, slug, conteo de
 * productos) y las acciones Ver / Editar / Desactivar.
 * @module src/components/category/category-card
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Category } from "@/types";

/** Props de la tarjeta de categoría. */
type CategoryCardProps = {
    /** Categoría a representar */
    category: Category;
    /** Navega al detalle de la categoría */
    onView: (id: string) => void;
    /** Navega a la edición de la categoría */
    onEdit: (id: string) => void;
    /** Abre el diálogo de desactivación con esta categoría */
    onDelete: (category: Category) => void;
    /** true mientras la mutación de borrado está en curso sobre esta categoría */
    isDeleting?: boolean;
};

/**
 * Tarjeta compacta del listado de categorías.
 * El botón Desactivar queda deshabilitado si la categoría
 * ya está inactiva o si se está eliminando en este momento.
 */
export function CategoryCard({
    category,
    onView,
    onEdit,
    onDelete,
    isDeleting = false,
}: CategoryCardProps) {
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">{category.name}</CardTitle>
                <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Activa" : "Inactiva"}
                </Badge>
            </CardHeader>
            <CardContent className="grid gap-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                    <code>{category.slug}</code>
                    <span className="text-muted-foreground">
                        · {category.products.length} productos
                    </span>
                </div>
            </CardContent>
            <CardFooter className="gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onView(category.id)}
                >
                    Ver
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(category.id)}
                >
                    Editar
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={!category.isActive || isDeleting}
                    onClick={() => onDelete(category)}
                >
                    Desactivar
                </Button>
            </CardFooter>
        </Card>
    );
}
