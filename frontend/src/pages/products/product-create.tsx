// /src/pages/products/product-create.tsx

/**
 * Página de creación de productos.
 * Carga las categorías activas para el selector del
 * formulario, muestra el estado vacío cuando no hay ninguna
 * y maneja los efectos (toast + navegación al detalle) en los
 * callbacks de la mutación.
 * @module src/pages/products/product-create
 */

import { useMemo } from "react";
import { Link, useNavigate } from "react-router";
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
import { Card, CardContent } from "@/components/ui/card";
import { ProductForm } from "@/components/product";
import { handleApiError } from "@/lib/api-error-handler";
import { useCategories, useCreateProduct } from "@/queries";
import type { Product } from "@/schemas/product.schema";
import type { CreateProductDto, UpdateProductDto } from "@/types";

/**
 * Página "Nuevo producto": formulario con las categorías
 * activas y envío vía useCreateProduct.
 */
export const ProductCreate = () => {
    const navigate = useNavigate();

    const {
        data: categories,
        isLoading,
        isError,
        error,
        refetch,
    } = useCategories();

    const createMutation = useCreateProduct();

    /**
     * Solo las categorías activas se ofrecen: el backend responde
     * 400 ("La categoría enviada no existe o está desactivada")
     * si el producto apunta a una categoría inactiva.
     */
    const categoriasActivas = useMemo(
        () => (categories ?? []).filter((category) => category.isActive),
        [categories]
    );

    /**
     * Crea el producto y navega a su detalle. El hook de mutación ya
     * invalidó y esperó el refetch del dominio, por lo que la
     * pantalla de destino monta con datos frescos.
     * @param payload - Payload del formulario validado
     */
    const handleFormSubmit = async (
        payload: CreateProductDto | UpdateProductDto
    ): Promise<void> => {
        let created: Product;
        try {
            created = await createMutation.mutateAsync(
                payload as CreateProductDto
            );
            toast.success("Producto creado", {
                description: created.name,
            });
        } catch (err) {
            handleApiError(err, "No se pudo crear el producto");
            return;
        }

        navigate(`/products/${created.id}`);
    };

    /** Estado de carga: skeleton pulsante imitando el formulario. */
    if (isLoading) {
        return (
            <div className="max-w-2xl py-8">
                <div className="h-64 rounded-lg bg-muted animate-pulse" />
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
     * Sin categorías activas no hay a qué asignar el producto:
     * se invita a crear la primera en su lugar.
     */
    if (categoriasActivas.length === 0) {
        return (
            <div className="flex justify-center py-16">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="grid gap-4 py-8">
                        <p className="text-muted-foreground">
                            Necesitas al menos una categoría activa para crear
                            un producto
                        </p>
                        <Button
                            className="mx-auto"
                            render={
                                <Link to="/categories/create" />
                            }
                        >
                            Nueva categoría
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid max-w-2xl gap-6 py-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink render={<Link to="/products" />}>
                            Productos
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Nuevo</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-2xl font-bold">Nuevo producto</h1>

            <ProductForm
                mode="create"
                categories={categoriasActivas}
                isSubmitting={createMutation.isPending}
                onSubmit={handleFormSubmit}
                onCancel={() => navigate("/products")}
                submitLabel="Crear producto"
            />
        </div>
    );
};
