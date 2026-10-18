// /src/components/home/architecture-layers.tsx

/**
 * Sección de las tres capas de la arquitectura.
 * Describe frontend, backend y base de datos con sus
 * tecnologías y datos reales del repo (puertos, prefijo
 * del API, módulos y modo de schema).
 * @module src/components/home/architecture-layers
 */

import { cn } from "cn";
import {
    RiDatabase2Line,
    RiNodejsLine,
    RiReactjsLine,
} from "@remixicon/react";

/** Definición de una capa de la arquitectura. */
type Layer = {
    /** Nombre de la capa */
    name: string;
    /** Tecnología principal */
    tech: string;
    /** Icono de remixicon que la identifica */
    icon: typeof RiReactjsLine;
    /** Rol de la capa en el sistema */
    role: string;
    /** Datos técnicos reales de la capa */
    facts: string[];
};

/** Las tres capas reales del proyecto, con hechos verificados en el código. */
const layers: Layer[] = [
    {
        name: "Frontend",
        tech: "React 19 + Vite 8",
        icon: RiReactjsLine,
        role: "SPA que renderiza la UI, consume el API y maneja los formularios.",
        facts: [
            "React Router 8 con rutas anidadas bajo un Layout",
            "TanStack Query 5 para caché y refetch de datos",
            "Zod 4 + react-hook-form en los formularios",
            "Tailwind CSS v4 (dev server en el puerto 5173)",
        ],
    },
    {
        name: "Backend",
        tech: "NestJS 12 + TypeORM",
        icon: RiNodejsLine,
        role: "API REST que valida, aplica reglas de negocio y persiste en la BD.",
        facts: [
            "Puerto 5555 con prefijo global /api/v1",
            "ValidationPipe global: whitelist + forbidNonWhitelisted",
            "Documentación Swagger en /api/v1/docs",
            "Módulos: categories, products y seeders",
        ],
    },
    {
        name: "Base de datos",
        tech: "PostgreSQL",
        icon: RiDatabase2Line,
        role: "Almacena categorías y productos, con integridad referencial por FK.",
        facts: [
            "Puerto 5432, base de datos exhibition_system",
            "Schema autogenerado: synchronize: true (sin migraciones)",
            "Relación Many-to-One: muchos productos por categoría",
            "POST /api/v1/seeders siembra 5 categorías × 5 productos",
        ],
    },
];

/**
 * Renderiza la sección de las tres capas: una tarjeta por
 * capa con su tecnología, rol y datos técnicos reales.
 */
export function ArchitectureLayers() {
    return (
        <section aria-labelledby="capas-heading" className="grid gap-4 py-8">
            <h2
                id="capas-heading"
                className="font-semibold tracking-tight text-2xl"
            >
                Las tres capas
            </h2>
            <p className="max-w-2xl text-muted-foreground">
                Toda la aplicación es una conversación entre estas tres
                piezas. Cada una vive en su propia carpeta y hace una sola
                cosa bien.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {layers.map((layer) => (
                    <article
                        key={layer.name}
                        className="grid gap-3 rounded-lg border border-border p-4"
                    >
                        <div className="flex items-center gap-2">
                            <layer.icon
                                aria-hidden="true"
                                className={cn("size-5 text-primary")}
                            />
                            <h3 className="font-medium">{layer.name}</h3>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                            {layer.tech}
                        </p>
                        <p className="text-sm">{layer.role}</p>
                        <ul className="grid gap-1.5 text-sm text-muted-foreground">
                            {layer.facts.map((fact) => (
                                <li key={fact} className="flex gap-2">
                                    <span aria-hidden="true">·</span>
                                    {fact}
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    );
}
