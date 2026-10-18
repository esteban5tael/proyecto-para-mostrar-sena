// /src/components/product/product-form.tsx

/**
 * Formulario compartido para crear y editar productos.
 * Usa react-hook-form + zodResolver con createProductSchema
 * en ambos modos. Es presentacional: recibe las categorías
 * por prop y no decide de dónde salen. Los toasts y la
 * navegación los maneja la página a través del prop onSubmit
 * — este componente no tiene efectos secundarios.
 * @module src/components/product/product-form
 */

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createProductSchema } from "@/schemas/product.schema";
import type { CreateProductDto, UpdateProductDto } from "@/types";

import { ProductFormError } from "./product-form-error";

/** Referencia mínima de categoría que consume el selector. */
export interface CategoryOption {
    /** Identificador de la categoría */
    id: string;
    /** Nombre visible de la categoría */
    name: string;
}

/** Props del formulario de producto. */
type ProductFormProps = {
    /** Modo del formulario: creación o edición */
    mode: "create" | "edit";
    /** Categorías activas para el selector */
    categories: CategoryOption[];
    /** Valores iniciales (en edición vienen del producto cargado) */
    defaultValues?: Partial<CreateProductDto>;
    /** Callback de envío validado; los efectos los decide la página */
    onSubmit: (payload: CreateProductDto | UpdateProductDto) => Promise<void>;
    /** Estado de envío para deshabilitar el botón */
    isSubmitting: boolean;
    /** Texto personalizado del botón de envío */
    submitLabel?: string;
    /** Si se provee, se renderiza también el botón Cancelar */
    onCancel?: () => void;
};

/**
 * Formulario de producto con validación onBlur.
 * Precio y stock se registran con valueAsNumber: el modelo
 * trabaja con números y el schema replica la regla del
 * servidor (precio ≥ 0 con máximo dos decimales; stock entero
 * no negativo). En modo edit se muestra el checkbox de estado.
 */
export function ProductForm({
    mode,
    categories,
    defaultValues,
    onSubmit,
    isSubmitting,
    submitLabel,
    onCancel,
}: ProductFormProps) {
    const form = useForm<CreateProductDto>({
        // cast seguro porque zodResolver devuelve Resolver<z.input,
        // z.output> y el form tipa solo la salida (z.output): la
        // única diferencia es isActive opcional en la entrada.
        resolver: zodResolver(
            createProductSchema
        ) as Resolver<CreateProductDto>,
        mode: "onBlur",
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            stock: 0,
            isActive: true,
            categoryId: "",
            ...defaultValues,
        },
    });

    const { errors } = form.formState;

    // useWatch en lugar de form.watch: el hook es compatible con el
    // React Compiler y evita que se omita la memoización del componente.
    const isActive = useWatch({ control: form.control, name: "isActive" });
    const categoryId = useWatch({
        control: form.control,
        name: "categoryId",
    });

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="product-name">Nombre</Label>
                    <Input
                        id="product-name"
                        placeholder="Ej: Gorra Ajustable"
                        {...form.register("name")}
                    />
                    <ProductFormError message={errors.name?.message} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="product-price">Precio</Label>
                    <Input
                        id="product-price"
                        type="number"
                        step="0.01"
                        min={0}
                        placeholder="Ej: 199.99"
                        {...form.register("price", { valueAsNumber: true })}
                    />
                    <ProductFormError message={errors.price?.message} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="product-stock">Stock</Label>
                    <Input
                        id="product-stock"
                        type="number"
                        step="1"
                        min={0}
                        placeholder="Ej: 25"
                        {...form.register("stock", { valueAsNumber: true })}
                    />
                    <ProductFormError message={errors.stock?.message} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="product-category">Categoría</Label>
                    <Select
                        value={categoryId}
                        onValueChange={(value) => {
                            // El selector no dispara onBlur de react-hook-form,
                            // por eso se pide la validación al cambiarlo.
                            if (value !== null) {
                                form.setValue("categoryId", value, {
                                    shouldValidate: true,
                                });
                            }
                        }}
                    >
                        <SelectTrigger
                            id="product-category"
                            className="w-full"
                        >
                            <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <ProductFormError message={errors.categoryId?.message} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="product-description">Descripción</Label>
                <Textarea
                    id="product-description"
                    rows={4}
                    placeholder="Breve descripción del producto"
                    {...form.register("description")}
                />
                <ProductFormError message={errors.description?.message} />
            </div>

            {mode === "edit" && (
                <div className="flex items-center gap-2">
                    {/* El checkbox controlado se alimenta de useWatch;
                        setValue actualiza el form al cambiarlo. */}
                    <Checkbox
                        id="product-is-active"
                        checked={isActive}
                        onCheckedChange={(checked) =>
                            form.setValue("isActive", checked)
                        }
                    />
                    <Label htmlFor="product-is-active">Activo</Label>
                </div>
            )}

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
                              ? "Crear producto"
                              : "Guardar cambios"))}
                </Button>
            </div>
        </form>
    );
}
