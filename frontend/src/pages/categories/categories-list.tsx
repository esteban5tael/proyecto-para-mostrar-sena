// /src/pages/categories/categories-list.tsx

/**
 * Página de listado de categorías.
 * Maneja carga (skeleton), error (alerta + reintento),
 * estado vacío y el grid de tarjetas con diálogo de
 * desactivación.
 * @module src/pages/categories/categories-list
 */

import { useState } from "react";
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
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    CategoryCard,
    CategoryDeleteDialog,
} from "@/components/category";
import { handleApiError } from "@/lib/api-error-handler";
import { useCategories, useDeleteCategory } from "@/queries";
import type { Category } from "@/types";

/**
 * Página principal del módulo de categorías: listado
 * responsivo con acciones de ver, editar y desactivar.
 */
export const CategoriesList = () => {
    const navigate = useNavigate();
    const {
        data: categories,
        isLoading,
        isError,
        error,
        refetch,
    } = useCategories();

    const [deletingCategory, setDeletingCategory] = useState<Category | null>(
        null
    );
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const deleteMutation = useDeleteCategory({
        onSuccess: () => {
            toast.success("Categoría desactivada", {
                description: deletingCategory?.name,
            });
            setDeleteDialogOpen(false);
            setDeletingCategory(null);
        },
        onError: (err) =>
            handleApiError(err, "No se pudo desactivar la categoría"),
    });

    /** Abre el diálogo de desactivación para la categoría elegida. */
    const handleDeleteClick = (category: Category) => {
        setDeletingCategory(category);
        setDeleteDialogOpen(true);
    };

    /** Confirma la desactivación de la categoría en curso. */
    const handleDeleteConfirm = () => {
        if (deletingCategory) {
            deleteMutation.mutate(deletingCategory.id);
        }
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

    /** Estado vacío: card centrada con invitación a crear. */
    if (!categories || categories.length === 0) {
        return (
            <div className="flex justify-center py-16">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="grid gap-4 py-8">
                        <p className="text-muted-foreground">
                            Aún no hay categorías
                        </p>
                        <Button
                            type="button"
                            className="mx-auto"
                            onClick={() => navigate("/categories/create")}
                        >
                            Nueva categoría
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
                        <BreadcrumbPage>Categorías</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <header className="flex flex-wrap items-center justify-between gap-4">
                <div className="grid gap-1">
                    <h1 className="text-2xl font-bold">Categorías</h1>
                    <p className="text-sm text-muted-foreground">
                        {categories.length === 1
                            ? "1 categoría registrada"
                            : `${categories.length} categorías registradas`}
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={() => navigate("/categories/create")}
                >
                    Nueva categoría
                </Button>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        onView={(id) => navigate(`/categories/${id}`)}
                        onEdit={(id) => navigate(`/categories/${id}/edit`)}
                        onDelete={handleDeleteClick}
                        isDeleting={
                            deleteMutation.isPending &&
                            deletingCategory?.id === category.id
                        }
                    />
                ))}
            </div>

            <CategoryDeleteDialog
                open={isDeleteDialogOpen}
                categoryName={deletingCategory?.name}
                isPending={deleteMutation.isPending}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};
