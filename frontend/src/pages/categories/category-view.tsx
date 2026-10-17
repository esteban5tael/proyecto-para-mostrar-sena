// /src/pages/categories/category-view.tsx

/**
 * Página de detalle de una categoría.
 * Carga por id, maneja 404 con alerta específica, error
 * genérico con reintento y ofrece acciones (volver,
 * editar, desactivar).
 * @module src/pages/categories/category-view
 */

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
import { CategoryDeleteDialog, CategoryDetail } from "@/components/category";
import { handleApiError } from "@/lib/api-error-handler";
import {
    ApiError,
    categoryKeys,
    useCategory,
    useDeleteCategory,
} from "@/queries";

/**
 * Página de vista de categoría con breadcrumb, tarjeta de
 * detalle y diálogo de desactivación.
 */
export const CategoryView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: category,
        isLoading,
        isError,
        error,
        refetch,
    } = useCategory(id ?? "");

    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const deleteMutation = useDeleteCategory();

    const queryClient = useQueryClient();

    /**
     * Desactiva la categoría y espera a invalidar el dominio antes de
     * navegar, para que el listado montado refetchee el estado nuevo.
     */
    const handleDeleteConfirm = async (): Promise<void> => {
        try {
            await deleteMutation.mutateAsync(id ?? "");
            toast.success("Categoría desactivada", {
                description: category?.name,
            });
        } catch (err) {
            handleApiError(err, "No se pudo desactivar la categoría");
            return;
        }

        await queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        setDeleteDialogOpen(false);
        navigate("/categories");
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
                            Categoría no encontrada
                        </AlertDescription>
                    </Alert>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-fit"
                        onClick={() => navigate("/categories")}
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

    // Categoría aún no disponible tras los guards de carga/error.
    if (!category) return null;

    return (
        <div className="grid max-w-3xl gap-6 py-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink render={<Link to="/categories" />}>
                            Categorías
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{category.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <CategoryDetail category={category} />

            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/categories")}
                >
                    Volver
                </Button>
                <Button
                    type="button"
                    onClick={() => navigate(`/categories/${id}/edit`)}
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

            <CategoryDeleteDialog
                open={isDeleteDialogOpen}
                categoryName={category.name}
                isPending={deleteMutation.isPending}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};
