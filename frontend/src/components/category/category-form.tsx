// /src/components/category/category-form.tsx

/**
 * Formulario compartido para crear y editar categorías.
 * Usa react-hook-form + zodResolver con createCategorySchema
 * en ambos modos. Los toasts y la navegación los maneja la
 * página a través del prop onSubmit — este componente no
 * tiene efectos secundarios.
 * @module src/components/category/category-form
 */

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCategorySchema } from "@/schemas/category.schema";
import type { CreateCategoryDto, UpdateCategoryDto } from "@/types";

import { CategoryFormError } from "./category-form-error";

/** Props del formulario de categoría. */
type CategoryFormProps = {
    /** Modo del formulario: creación o edición */
    mode: "create" | "edit";
    /** Valores iniciales (en edición vienen de la categoría cargada) */
    defaultValues?: Partial<CreateCategoryDto>;
    /** Callback de envío validado; los efectos los decide la página */
    onSubmit: (payload: CreateCategoryDto | UpdateCategoryDto) => Promise<void>;
    /** Estado de envío para deshabilitar el botón */
    isSubmitting: boolean;
    /** Texto personalizado del botón de envío */
    submitLabel?: string;
    /** Si se provee, se renderiza también el botón Cancelar */
    onCancel?: () => void;
};

/**
 * Formulario de categoría con validación onBlur.
 * En modo edit se muestra el checkbox de estado; en create
 * el campo isActive queda oculto y se envía como default
 * del backend.
 */
export function CategoryForm({
    mode,
    defaultValues,
    onSubmit,
    isSubmitting,
    submitLabel,
    onCancel,
}: CategoryFormProps) {
    const form = useForm<CreateCategoryDto>({
        // cast seguro porque zodResolver devuelve Resolver<z.input,
        // z.output> y el form tipa solo la salida (z.output): la
        // única diferencia es isActive opcional en la entrada.
        resolver: zodResolver(
            createCategorySchema
        ) as Resolver<CreateCategoryDto>,
        mode: "onBlur",
        defaultValues: {
            name: "",
            description: "",
            isActive: true,
            ...defaultValues,
        },
    });

    const { errors } = form.formState;

    // useWatch en lugar de form.watch: el hook es compatible con el
    // React Compiler y evita que se omita la memoización del componente.
    const isActive = useWatch({ control: form.control, name: "isActive" });

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div
                className={
                    mode === "edit" ? "grid gap-4 md:grid-cols-2" : "grid gap-4"
                }
            >
                <div className="grid gap-2">
                    <Label htmlFor="category-name">Nombre</Label>
                    <Input
                        id="category-name"
                        placeholder="Ej: Electrónica"
                        {...form.register("name")}
                    />
                    <CategoryFormError message={errors.name?.message} />
                </div>

                {mode === "edit" && (
                    <div className="flex items-center gap-2 self-end pb-2">
                        {/* El checkbox controlado se alimenta de useWatch;
                            setValue actualiza el form al cambiarlo. */}
                        <Checkbox
                            id="category-is-active"
                            checked={isActive}
                            onCheckedChange={(checked) =>
                                form.setValue("isActive", checked)
                            }
                        />
                        <Label htmlFor="category-is-active">Activa</Label>
                    </div>
                )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="category-description">Descripción</Label>
                <Textarea
                    id="category-description"
                    rows={4}
                    placeholder="Breve descripción de la categoría"
                    {...form.register("description")}
                />
                <CategoryFormError message={errors.description?.message} />
            </div>

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? "Guardando..."
                        : (submitLabel ??
                          (mode === "create"
                              ? "Crear categoría"
                              : "Guardar cambios"))}
                </Button>
            </div>
        </form>
    );
}
