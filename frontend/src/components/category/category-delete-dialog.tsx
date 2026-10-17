// /src/components/category/category-delete-dialog.tsx

/**
 * Diálogo de confirmación para desactivar (soft-delete)
 * una categoría. Controlado desde la página: el cierre
 * exitoso lo decide onSuccess de la mutación.
 * @module src/components/category/category-delete-dialog
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
type CategoryDeleteDialogProps = {
    /** Estado controlado de apertura */
    open: boolean;
    /** Nombre de la categoría a mostrar en la descripción */
    categoryName?: string;
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
export function CategoryDeleteDialog({
    open,
    categoryName,
    isPending = false,
    onOpenChange,
    onConfirm,
}: CategoryDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Desactivar categoría?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción marcará "{categoryName}" como inactiva. No se
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
