// src/types/general-response.interface.ts

/**
 * Shape de error estándar de NestJS (HttpException / ValidationPipe).
 */
export interface NestErrorResponse {
  statusCode: number;
  error: string;          // "Bad Request", "Not Found", "Unauthorized", etc.
  message: string | string[]; // string simple o array (class-validator)
}

/**
 * Respuesta genérica unificada para usar en la UI.
 * - Success: los datos planos que devuelve tu API
 * - Error: el error normalizado de NestJS
 */
export type GeneralResponse<T> =
  | { success: true; data: T }
  | { success: false; statusCode: number; message: string; errors: string[] };

/**
 * Helper para construir un éxito
 */
export const ok = <T>(data: T): GeneralResponse<T> => ({
  success: true,
  data,
});

/**
 * Helper para construir un error desde una excepción de axios/NestJS
 */
export const fail = <T = never>(
  statusCode: number,
  message: string | string[],
  errors: string[] = []
): GeneralResponse<T> => ({
  success: false,
  statusCode,
  message: Array.isArray(message) ? message.join(", ") : message,
  errors,
});