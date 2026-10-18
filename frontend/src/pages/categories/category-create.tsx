// /src/pages/categories/category-create.tsx

/**
 * Página de creación de categorías.
 * Renderiza el formulario compartido en modo create y
 * maneja los efectos (toast + navegación) en los callbacks
 * de la mutación.
 * @module src/pages/categories/category-create
 */

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
import { CategoryForm } from "@/components/category";
import { handleApiError } from "@/lib/api-error-handler";
import { useCreateCategory } from "@/queries";
import type { Category } from "@/schemas/category.schema";
import type { CreateCategoryDto, UpdateCategoryDto } from "@/types";

/**
 * Página "Nueva categoría": formulario en blanco con
 * validación Zod onBlur y envío vía useCreateCategory.
 */
export const CategoryCreate = () => {
    const navigate = useNavigate();

    const createMutation = useCreateCategory();

    /**
     * Crea la categoría y navega al detalle. El hook de mutación ya
     * invalidó y esperó el refetch del dominio, por lo que la pantalla
     * de destino monta con datos frescos sin invalidación adicional.
     * @param payload - Payload del formulario validado
     */
    const handleFormSubmit = async (
        payload: CreateCategoryDto | UpdateCategoryDto
    ): Promise<void> => {
        // cast seguro porque el tipo inferido de z.infer exige isActive
        // en salida, pero el backend lo crea en true por defecto y no
        // debe viajar en el payload de creación.
        const { name, description } = payload as CreateCategoryDto;

        let created: Category;
        try {
            created = await createMutation.mutateAsync({
                name,
                description,
            } as CreateCategoryDto);
            toast.success("Categoría creada", {
                description: created.name,
            });
        } catch (err) {
            handleApiError(err, "No se pudo crear la categoría");
            return;
        }

        navigate(`/categories/${created.id}`);
    };

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
                        <BreadcrumbPage>Nueva</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-2xl font-bold">Nueva categoría</h1>

            <CategoryForm
                mode="create"
                isSubmitting={createMutation.isPending}
                onSubmit={handleFormSubmit}
                onCancel={() => navigate("/categories")}
                submitLabel="Crear categoría"
            />
        </div>
    );
};
