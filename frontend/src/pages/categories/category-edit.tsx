// /src/pages/categories/category-edit.tsx

/**
 * Página de edición de categorías.
 * Carga la categoría por id, precarga el formulario
 * compartido en modo edit y maneja toast + navegación en
 * los callbacks de la mutación de actualización.
 * @module src/pages/categories/category-edit
 */

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
import { CategoryForm } from "@/components/category";
import { handleApiError } from "@/lib/api-error-handler";
import { ApiError, useCategory, useUpdateCategory } from "@/queries";
import type { CreateCategoryDto, UpdateCategoryDto } from "@/types";

/**
 * Página "Editar categoría": precarga los datos actuales
 * y envía el payload parcial vía useUpdateCategory.
 */
export const CategoryEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: category,
        isLoading,
        isError,
        error,
        refetch,
    } = useCategory(id ?? "");

    const updateMutation = useUpdateCategory();

    /**
     * Guarda los cambios y navega al detalle. El hook de mutación ya
     * invalidó y esperó el refetch del dominio, por lo que el detalle
     * montado tras la redirección muestra los datos nuevos.
     * @param payload - Payload del formulario (nombre, descripción, isActive)
     */
    const handleFormSubmit = async (
        payload: CreateCategoryDto | UpdateCategoryDto
    ): Promise<void> => {
        const { name, description, isActive } = payload;

        try {
            const updated = await updateMutation.mutateAsync({
                id: id ?? "",
                payload: { name, description, isActive },
            });
            toast.success("Cambios guardados", {
                description: updated.name,
            });
        } catch (err) {
            handleApiError(err, "No se pudieron guardar los cambios");
            return;
        }

        navigate(`/categories/${id}`);
    };

    /** Estado de carga: skeleton pulsante imitando el formulario. */
    if (isLoading) {
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

    // Categoría aún no disponible tras los guards de carga/error.
    if (!category) return null;

    return (
        <div className="grid max-w-2xl gap-6 py-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink render={<Link to="/categories" />}>
                            Categorías
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            render={<Link to={`/categories/${id}`} />}
                        >
                            {category.name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Editar</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-2xl font-bold">Editar categoría</h1>

            <CategoryForm
                mode="edit"
                defaultValues={{
                    name: category.name,
                    // El backend puede devolver description null; el
                    // formulario usa "" para evitar un valor controlado nulo.
                    description: category.description ?? "",
                    isActive: category.isActive,
                }}
                isSubmitting={updateMutation.isPending}
                onSubmit={handleFormSubmit}
                onCancel={() => navigate(`/categories/${id}`)}
                submitLabel="Guardar cambios"
            />
        </div>
    );
};
