// /src/components/category/category-products-list.tsx

/**
 * Listado de productos de una categoría (tarjeta de detalle).
 * Muestra el total como encabezado, una fila por producto con
 * nombre y cantidad (stock), o un mensaje vacío si no hay
 * productos activos.
 * @module src/components/category/category-products-list
 */

import type { Product } from "@/types";

/** Props del listado de productos. */
type CategoryProductsListProps = {
    /** Productos activos de la categoría, en el orden del API */
    products: Product[];
};

/**
 * Renderiza el listado de productos de la categoría con su total.
 * El orden de las filas es el que entrega el API (este componente
 * no ordena); con el array vacío se muestra el estado vacío y no
 * se renderiza ninguna fila.
 */
export function CategoryProductsList({
    products,
}: CategoryProductsListProps) {
    if (products.length === 0) {
        return (
            <div className="grid gap-1">
                <p className="text-sm font-medium">Productos (0)</p>
                <p className="text-sm text-muted-foreground">
                    Esta categoría no tiene productos.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-2">
            <p className="text-sm font-medium">
                Productos ({products.length})
            </p>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left text-muted-foreground">
                        <th className="py-2 font-normal">Producto</th>
                        <th className="py-2 pl-3 font-normal text-right">
                            Cantidad
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr
                            key={product.id}
                            className="border-b last:border-b-0"
                        >
                            <td className="py-2 pr-3">{product.name}</td>
                            <td className="py-2 pl-3 text-right">
                                {product.stock}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
