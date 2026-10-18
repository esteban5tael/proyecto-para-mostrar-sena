// /src/components/product/product-form-error.tsx

/**
 * Indicador de error reutilizable para campos del formulario
 * de producto. Renderiza null si no hay mensaje.
 * @module src/components/product/product-form-error
 */

/** Props del indicador de error de campo. */
type ProductFormErrorProps = {
    /** Mensaje de validación; si es undefined no se renderiza nada */
    message?: string;
};

/**
 * Muestra el mensaje de validación de un campo del formulario
 * con estilo de error (rojo, pulsante).
 */
export function ProductFormError({ message }: ProductFormErrorProps) {
    if (!message) return null;

    return (
        <span className="text-sm text-red-500 mt-1 block animate-pulse">
            | {message} *
        </span>
    );
}
