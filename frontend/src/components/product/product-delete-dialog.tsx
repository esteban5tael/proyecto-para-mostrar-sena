// /src/components/product/product-delete-dialog.tsx

/**
 * Diálogo de confirmación para desactivar (soft-delete)
 * un producto. Controlado desde la página: el cierre
 * exitoso lo decide onSuccess de la mutación.
 * @module src/components/product/product-delete-dialog
 */

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/** Props del diálogo de desactivación. */
type ProductDeleteDialogProps = {
    /** Estado controlado de apertura */
    open: boolean;
    /** Nombre del producto a mostrar en la descripción */
    productName?: string;
    /** true mientras la mutación de desactivación está en curso */
    isPending?: boolean;
    /** Cambia el estado de apertura del diálogo */
    onOpenChange: (open: boolean) => void;
    /** Ejecuta la mutación de desactivación */
    onConfirm: () => void;
};

/**
 * Confirmación destructiva de desactivación. Aclara al
 * usuario que es un soft-delete (isActive = false) y no
 * una eliminación física.
 */
export function ProductDeleteDialog({
    open,
    productName,
    isPending = false,
    onOpenChange,
    onConfirm,
}: ProductDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Desactivar producto?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción marcará "{productName}" como inactivo. No se
                        elimina físicamente.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={isPending}
                        onClick={onConfirm}
                    >
                        {isPending ? "Desactivando..." : "Desactivar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
