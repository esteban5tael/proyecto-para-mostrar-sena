// /src/lib/api-error-handler.ts

/**
 * Helper centralizado para traducir errores de ApiError en
 * toasts de sonner. Lo consumen las páginas desde sus
 * callbacks onError de mutations y queries.
 * @module src/lib/api-error-handler
 */

import { toast } from "sonner";
import { ApiError } from "@/queries";

/**
 * Muestra un toast de error según el tipo de error recibido.
 *
 * Casos que cubre:
 * 1. ApiError con más de un error de validación (NestJS
 *    devuelve message como array en los 400 de validación):
 *    toast "Errores de validación" con el array unido por
 *    saltos de línea.
 * 2. ApiError con un solo error: toast con el título
 *    genérico (fallback) y el mensaje normalizado.
 * 3. Error desconocido (red, timeout, etc.): toast con el
 *    fallback y "Error inesperado".
 *
 * @param err - Error capturado en el callback onError
 * @param fallback - Título genérico del toast para la página
 */
export function handleApiError(err: unknown, fallback: string): void {
  if (err instanceof ApiError && err.errors.length > 1) {
    toast.error("Errores de validación", {
      description: err.errors.join("\n"),
    });
    return;
  }
  if (err instanceof ApiError) {
    toast.error(fallback, { description: err.message });
    return;
  }
  toast.error(fallback, { description: "Error inesperado" });
}
