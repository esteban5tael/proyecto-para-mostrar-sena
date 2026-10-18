// /src/pages/products/product-view.tsx

/**
 * Página de detalle de un producto.
 * Carga por id, maneja 404 con alerta específica, error
 * genérico con reintento y ofrece acciones (volver,
 * editar, desactivar).
 * @module src/pages/products/product-view
 */

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ProductDeleteDialog, ProductDetail } from "@/components/product";
import { handleApiError } from "@/lib/api-error-handler";
import { ApiError, useDeleteProduct, useProduct } from "@/queries";

/**
 * Página de vista de producto con breadcrumb, tarjeta de
 * detalle y diálogo de desactivación.
 */
export const ProductView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: product,
        isLoading,
        isError,
        error,
        refetch,
    } = useProduct(id ?? "");

    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const deleteMutation = useDeleteProduct();

    /**
     * Desactiva el producto y navega al listado. El hook de mutación
     * ya invalidó y esperó el refetch del dominio, por lo que el
     * listado monta sin el producto desactivado.
     */
    const handleDeleteConfirm = async (): Promise<void> => {
        try {
            await deleteMutation.mutateAsync(id ?? "");
            toast.success("Producto desactivado", {
                description: product?.name,
            });
        } catch (err) {
            handleApiError(err, "No se pudo desactivar el producto");
            return;
        }

        setDeleteDialogOpen(false);
        navigate("/products");
    };

    /** Estado de carga: skeleton pulsante imitando la tarjeta. */
    if (isLoading) {
        return (
            <div className="max-w-3xl py-8">
                <div className="h-40 rounded-lg bg-muted animate-pulse" />
            </div>
        );
    }

    /** Estado de error: 404 específico o alerta genérica con reintento. */
    if (isError) {
        if (error instanceof ApiError && error.statusCode === 404) {
            return (
                <div className="grid max-w-3xl gap-4 py-8">
                    <Alert variant="destructive">
                        <AlertDescription>
                            Producto no encontrado
                        </AlertDescription>
                    </Alert>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-fit"
                        onClick={() => navigate("/products")}
                    >
                        Volver
                    </Button>
                </div>
            );
        }

        return (
            <div className="grid max-w-3xl gap-4 py-8">
                <Alert variant="destructive">
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
            </div>
        );
    }

    // Producto aún no disponible tras los guards de carga/error.
    if (!product) return null;

    return (
        <div className="grid max-w-3xl gap-6 py-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink render={<Link to="/products" />}>
                            Productos
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{product.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <ProductDetail product={product} />

            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/products")}
                >
                    Volver
                </Button>
                <Button
                    type="button"
                    onClick={() => navigate(`/products/${id}/edit`)}
                >
                    Editar
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                >
                    Desactivar
                </Button>
            </div>

            <ProductDeleteDialog
                open={isDeleteDialogOpen}
                productName={product.name}
                isPending={deleteMutation.isPending}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};
