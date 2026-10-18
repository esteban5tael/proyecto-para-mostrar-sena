import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un precio con dos decimales en locale es-CO.
 * El modelo expone `price` como número; el backend lo serializa
 * como decimal, así que el formateo se resuelve en la UI.
 *
 * @param valor - Precio a formatear
 * @returns Cadena con separadores de miles y dos decimales
 *
 * @example
 * formatPrice(1234.5) // "1.234,50"
 */
export function formatPrice(valor: number): string {
  return valor.toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
