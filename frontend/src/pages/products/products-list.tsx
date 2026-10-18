// /src/pages/products/products-list.tsx

/**
 * Página de listado de productos.
 * Maneja carga (skeleton), error (alerta + reintento),
 * estado vacío del catálogo y el grid de tarjetas con
 * búsqueda por nombre y filtro por categoría aplicados en
 * cliente (useState + useMemo), además del diálogo de
 * desactivación.
 * @module src/pages/products/products-list
 */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ProductCard,
    ProductDeleteDialog,
} from "@/components/product";
import { handleApiError } from "@/lib/api-error-handler";
import { useCategories, useDeleteProduct, useProducts } from "@/queries";
import type { Product } from "@/types";

/** Identificador del selector que significa "sin filtro de categoría". */
const TODAS_LAS_CATEGORIAS = "all";

/**
 * Página principal del módulo de productos: listado
 * responsivo con acciones de ver, editar y desactivar.
 */
export const ProductsList = () => {
    const navigate = useNavigate();
    const {
        data: products,
        isLoading,
        isError,
        error,
        refetch,
    } = useProducts();
    const { data: categories } = useCategories();

    const [deletingProduct, setDeletingProduct] = useState<Product | null>(
        null
    );
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Estado local del filtrado: el backend no ofrece paginación
    // ni filtros, así que se aplican sobre la respuesta completa.
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] =
        useState(TODAS_LAS_CATEGORIAS);

    const deleteMutation = useDeleteProduct({
        onSuccess: () => {
            toast.success("Producto desactivado", {
                description: deletingProduct?.name,
            });
            setDeleteDialogOpen(false);
            setDeletingProduct(null);
        },
        onError: (err) =>
            handleApiError(err, "No se pudo desactivar el producto"),
    });

    /** Solo las categorías activas se ofrecen como filtro. */
    const categoriasActivas = useMemo(
        () => (categories ?? []).filter((category) => category.isActive),
        [categories]
    );

    /** Productos que cumplen el nombre y la categoría seleccionados. */
    const productosFiltrados = useMemo(() => {
        const termino = search.trim().toLowerCase();

        return (products ?? []).filter((product) => {
            const coincideNombre =
                termino === "" ||
                product.name.toLowerCase().includes(termino);
            const coincideCategoria =
                categoryFilter === TODAS_LAS_CATEGORIAS ||
                product.categoryId === categoryFilter;

            return coincideNombre && coincideCategoria;
        });
    }, [products, search, categoryFilter]);

    /** Abre el diálogo de desactivación para el producto elegido. */
    const handleDeleteClick = (product: Product) => {
        setDeletingProduct(product);
        setDeleteDialogOpen(true);
    };

    /** Confirma la desactivación del producto en curso. */
    const handleDeleteConfirm = () => {
        if (deletingProduct) {
            deleteMutation.mutate(deletingProduct.id);
        }
    };

    /** Restablece la búsqueda y el filtro de categoría. */
    const handleClearFilters = () => {
        setSearch("");
        setCategoryFilter(TODAS_LAS_CATEGORIAS);
    };

    /** Estado de carga: skeleton imitando el layout de las tarjetas. */
    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-40 rounded-lg bg-muted animate-pulse"
                    />
                ))}
            </div>
        );
    }

    /** Estado de error: alerta con el mensaje y reintento. */
    if (isError) {
        return (
            <Alert variant="destructive" className="max-w-2xl">
                <AlertDescription className="flex flex-col gap-3">
                    <span>{error.message}</span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => refetch()}
                    >
                        Reintentar
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    /**
     * Estado vacío del catálogo: card centrada con invitación a
     * crear el primer producto, sin buscador ni filtro de
     * categoría (no hay nada sobre lo que filtrar).
     */
    if (!products || products.length === 0) {
        return (
            <div className="flex justify-center py-16">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="grid gap-4 py-8">
                        <p className="text-muted-foreground">
                            Aún no hay productos
                        </p>
                        <Button
                            type="button"
                            className="mx-auto"
                            onClick={() => navigate("/products/create")}
                        >
                            Nuevo producto
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid gap-6 py-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Productos</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <header className="flex flex-wrap items-center justify-between gap-4">
                <div className="grid gap-1">
                    <h1 className="text-2xl font-bold">Productos</h1>
                    <p className="text-sm text-muted-foreground">
                        {products.length === 1
                            ? "1 producto registrado"
                            : `${products.length} productos registrados`}
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={() => navigate("/products/create")}
                >
                    Nuevo producto
                </Button>
            </header>

            <div className="grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
                <div className="grid gap-2">
                    <Label htmlFor="product-search">Buscar por nombre</Label>
                    <Input
                        id="product-search"
                        placeholder="Ej: Gorra"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="product-category-filter">
                        Categoría
                    </Label>
                    <Select
                        value={categoryFilter}
                        onValueChange={(value) => {
                            if (value !== null) setCategoryFilter(value);
                        }}
                    >
                        <SelectTrigger
                            id="product-category-filter"
                            className="w-full"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TODAS_LAS_CATEGORIAS}>
                                Todas las categorías
                            </SelectItem>
                            {categoriasActivas.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {productosFiltrados.length === 0 ? (
                <div className="flex justify-center py-16">
                    <Card className="w-full max-w-md text-center">
                        <CardContent className="grid gap-4 py-8">
                            <p className="text-muted-foreground">
                                Ningún producto coincide con los filtros
                                actuales
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className="mx-auto"
                                onClick={handleClearFilters}
                            >
                                Limpiar filtros
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {productosFiltrados.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onView={(id) => navigate(`/products/${id}`)}
                            onEdit={(id) => navigate(`/products/${id}/edit`)}
                            onDelete={handleDeleteClick}
                            isDeleting={
                                deleteMutation.isPending &&
                                deletingProduct?.id === product.id
                            }
                        />
                    ))}
                </div>
            )}

            <ProductDeleteDialog
                open={isDeleteDialogOpen}
                productName={deletingProduct?.name}
                isPending={deleteMutation.isPending}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};
