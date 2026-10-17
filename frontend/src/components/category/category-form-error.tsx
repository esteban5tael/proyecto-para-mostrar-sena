// /src/components/category/category-form-error.tsx

/**
 * Indicador de error reutilizable para campos del formulario
 * de categoría. Renderiza null si no hay mensaje.
 * @module src/components/category/category-form-error
 */

/** Props del indicador de error de campo. */
type CategoryFormErrorProps = {
    /** Mensaje de validación; si es undefined no se renderiza nada */
    message?: string;
};

/**
 * Muestra el mensaje de validación de un campo del formulario
 * con estilo de error (rojo, pulsante).
 */
export function CategoryFormError({ message }: CategoryFormErrorProps) {
    if (!message) return null;

    return (
        <span className="text-sm text-red-500 mt-1 block animate-pulse">
            | {message} *
        </span>
    );
}
