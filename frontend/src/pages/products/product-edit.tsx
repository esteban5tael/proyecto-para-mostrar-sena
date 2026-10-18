// /src/pages/products/product-edit.tsx

/**
 * Página de edición de productos.
 * Carga el producto por id y las categorías activas, precarga
 * el formulario compartido en modo edit (incluido categoryId)
 * y maneja toast + navegación en los callbacks de la mutación
 * de actualización.
 * @module src/pages/products/product-edit
 */

import { useMemo } from "react";
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
import { ProductForm } from "@/components/product";
import { handleApiError } from "@/lib/api-error-handler";
import {
    ApiError,
    useCategories,
    useProduct,
    useUpdateProduct,
} from "@/queries";
import type { CreateProductDto, UpdateProductDto } from "@/types";

/**
 * Página "Editar producto": precarga los datos actuales
 * y envía el payload vía useUpdateProduct.
 */
export const ProductEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: product,
        isLoading,
        isError,
        error,
        refetch,
    } = useProduct(id ?? "");

    const {
        data: categories,
        isLoading: isLoadingCategories,
        isError: isErrorCategories,
        refetch: refetchCategories,
    } = useCategories();

    const updateMutation = useUpdateProduct();

    /** Solo las categorías activas se ofrecen en el selector. */
    const categoriasActivas = useMemo(
        () => (categories ?? []).filter((category) => category.isActive),
        [categories]
    );

    /**
     * Guarda los cambios y navega al listado. El hook de mutación ya
     * invalidó y esperó el refetch del dominio, por lo que el listado
     * muestra los valores actualizados sin refetch manual.
     * @param payload - Payload del formulario validado
     */
    const handleFormSubmit = async (
        payload: CreateProductDto | UpdateProductDto
    ): Promise<void> => {
        try {
            const updated = await updateMutation.mutateAsync({
                id: id ?? "",
                payload,
            });
            toast.success("Cambios guardados", {
                description: updated.name,
            });
        } catch (err) {
            handleApiError(err, "No se pudieron guardar los cambios");
            return;
        }

        navigate("/products");
    };

    /** Estado de carga: skeleton pulsante imitando el formulario. */
    if (isLoading || isLoadingCategories) {
        return (
            <div className="max-w-2xl py-8">
                <div className="h-64 rounded-lg bg-muted animate-pulse" />
            </div>
        );
    }

    /** Estado de error: 404 específico o alerta genérica con reintento. */
    if (isError) {
        if (error instanceof ApiError && error.statusCode === 404) {
            return (
                <div className="grid max-w-2xl gap-4 py-8">
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
            <div className="grid max-w-2xl gap-4 py-8">
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

    /**
     * El selector necesita las categorías: si su carga falló se
     * muestra su propio error con reintento, porque editar sin
     * poder elegir categoría dejaría el formulario incompleto.
     */
    if (isErrorCategories) {
        return (
            <Alert variant="destructive" className="max-w-2xl">
                <AlertDescription className="flex flex-col gap-3">
                    <span>No se pudieron cargar las categorías</span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => refetchCategories()}
                    >
                        Reintentar
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    // Producto aún no disponible tras los guards de carga/error.
    if (!product) return null;

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
                        <BreadcrumbLink
                            render={<Link to={`/products/${id}`} />}
                        >
                            {product.name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Editar</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-2xl font-bold">Editar producto</h1>

            <ProductForm
                mode="edit"
                categories={categoriasActivas}
                defaultValues={{
                    name: product.name,
                    // El backend puede devolver description null; el
                    // formulario usa "" para evitar un valor controlado nulo.
                    description: product.description ?? "",
                    price: product.price,
                    stock: product.stock,
                    categoryId: product.categoryId,
                    isActive: product.isActive,
                }}
                isSubmitting={updateMutation.isPending}
                onSubmit={handleFormSubmit}
                onCancel={() => navigate(`/products/${id}`)}
                submitLabel="Guardar cambios"
            />
        </div>
    );
};
