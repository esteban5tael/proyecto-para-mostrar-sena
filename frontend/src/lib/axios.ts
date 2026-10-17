// src/lib/axios.ts
import axios, { AxiosError } from "axios";
import { API_URL } from "./constants";
import type { NestErrorResponse,GeneralResponse } from "@/types/general-response.interface";


export const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

// ----- Request -----
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error),
);

// ----- Response -----
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<NestErrorResponse>) => {
        const status = error.response?.status ?? 0;
        const body = error.response?.data;

        // Normalizamos el mensaje: string o array → array de strings
        let message = "Error inesperado";
        let errors: string[] = [];

        if (body?.message) {
            if (Array.isArray(body.message)) {
                errors = body.message;
                message = body.message.join(", ");
            } else {
                message = body.message;
                errors = [body.message];
            }
        } else if (error.message) {
            message = error.message;
            errors = [error.message];
        }

        // 401 → limpiar token
        if (status === 401) {
            localStorage.removeItem("token");
        }

        // Adjuntamos un shape estable al error para la UI
        (error as any).normalized = {
            statusCode: status,
            error: body?.error ?? error.code ?? "Error",
            message,
            errors,
        };

        return Promise.reject(error);
    },
);

export const toFail = <T = never>(
    error: unknown,
): GeneralResponse<T> => {
    const norm = (error as any)?.normalized;
    if (norm) {
        return {
            success: false,
            statusCode: norm.statusCode,
            message: norm.message,
            errors: norm.errors,
        };
    }
    return {
        success: false,
        statusCode: 0,
        message: "Error desconocido",
        errors: [],
    };
};

export default api;
