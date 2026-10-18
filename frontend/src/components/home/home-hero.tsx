// /src/components/home/home-hero.tsx

/**
 * Hero de la página de inicio.
 * Presenta el proyecto como material educativo y ofrece
 * accesos rápidos a las secciones de la aplicación y a la
 * documentación Swagger del API.
 * @module src/components/home/home-hero
 */

import { Link } from "react-router";
import { cn } from "cn";
import {
    RiArrowRightLine,
    RiBookOpenLine,
    RiExternalLinkLine,
} from "@remixicon/react";

/** URL de la documentación interactiva del API. */
const SWAGGER_URL = "http://localhost:5555/api/v1/docs";

/** Accesos rápidos mostrados en el hero. */
const quickLinks = [
    { label: "Productos", href: "/products", external: false },
    { label: "Categorías", href: "/categories", external: false },
    {
        label: "Swagger (API)",
        href: SWAGGER_URL,
        external: true,
    },
] as const;

/**
 * Renderiza el encabezado de la home: título del proyecto,
 * bajada educativa y accesos rápidos (rutas internas y Swagger).
 */
export function HomeHero() {
    return (
        <section className="grid gap-6 pb-8">
            <div className="grid gap-3">
                <p className="text-sm font-medium tracking-wide text-primary">
                    Proyecto educativo · Fullstack mínimo
                </p>
                <h1 className="font-semibold tracking-tight text-4xl sm:text-5xl">
                    Exhibition System
                </h1>
                <p className="max-w-2xl text-muted-foreground">
                    Una aplicación mínima de extremo a extremo construida
                    con tres piezas: una SPA de React, una API REST en
                    NestJS y una base de datos PostgreSQL. Esta página
                    explica cómo encajan entre sí, para que puedas seguir
                    el código con el mapa en la mano.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {quickLinks.map((link) => {
                    const className = cn(
                        "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    );

                    if (link.external) {
                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                className={className}
                            >
                                {link.label}
                                <RiExternalLinkLine
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </a>
                        );
                    }

                    return (
                        <Link key={link.href} to={link.href} className={className}>
                            {link.label}
                            <RiArrowRightLine
                                aria-hidden="true"
                                className="size-4"
                            />
                        </Link>
                    );
                })}
            </div>

            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <RiBookOpenLine aria-hidden="true" className="size-4" />
                Desplázate para recorrer la arquitectura, capa por capa.
            </p>
        </section>
    );
}
