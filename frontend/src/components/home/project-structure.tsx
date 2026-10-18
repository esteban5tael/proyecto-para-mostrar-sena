// /src/components/home/project-structure.tsx

/**
 * Sección de estructura del repositorio.
 * Muestra el árbol real de carpetas (backend, frontend y
 * openspec) con una nota por directorio, contrastado con
 * el contenido actual del repo.
 * @module src/components/home/project-structure
 */

/** Árbol real de carpetas del proyecto. */
const tree = `exhibition-system/
├── backend/                  # NestJS 12 + TypeORM (ESM estricto)
│   ├── src/
│   │   ├── main.ts           # Bootstrap: prefijo /api/v1, ValidationPipe, Swagger
│   │   ├── app.module.ts     # TypeORM → PostgreSQL y módulos de la app
│   │   ├── categories/       # controller · service · dto · entities
│   │   ├── products/         # controller · service · dto · entities
│   │   └── seeders/          # POST /api/v1/seeders (5 categorías × 5 productos)
│   └── public/               # Estáticos servidos por ServeStaticModule
├── frontend/                 # Vite 8 + React 19 (SPA)
│   └── src/
│       ├── pages/            # home · products · categories · not-found
│       ├── components/       # ui · header · category · product · home
│       ├── queries/          # TanStack Query: category · product
│       ├── schemas/          # Zod: fuente de verdad de los tipos
│       ├── services/         # Servicios por dominio
│       ├── lib/              # Instancia de axios y manejo de errores
│       ├── layouts/          # Layout raíz (Header + Outlet)
│       └── routes.tsx        # Rutas anidadas bajo el Layout
└── openspec/                 # Workflow spec-driven
    ├── specs/                # Specs principales por capability
    └── changes/              # Cambios en planning y archivo`;

/**
 * Renderiza la sección de estructura: el árbol de carpetas
 * real del repo y la idea detrás de cada raíz.
 */
export function ProjectStructure() {
    return (
        <section
            aria-labelledby="estructura-heading"
            className="grid gap-4 py-8"
        >
            <h2
                id="estructura-heading"
                className="font-semibold tracking-tight text-2xl"
            >
                Estructura del repositorio
            </h2>
            <p className="max-w-2xl text-muted-foreground">
                Tres carpetas en la raíz, un proyecto por pieza. Cada una
                tiene su propio <code className="text-sm">package.json</code>{" "}
                y se desarrolla por separado con pnpm.
            </p>

            <pre className="overflow-x-auto rounded-lg border border-border p-4 text-xs leading-relaxed">
                <code>{tree}</code>
            </pre>

            <div className="grid gap-3 sm:grid-cols-3">
                <div className="grid gap-1">
                    <h3 className="text-sm font-medium">backend/</h3>
                    <p className="text-sm text-muted-foreground">
                        La API y las reglas de negocio. Sin migraciones: el
                        schema se auto-genera al arrancar con TypeORM.
                    </p>
                </div>
                <div className="grid gap-1">
                    <h3 className="text-sm font-medium">frontend/</h3>
                    <p className="text-sm text-muted-foreground">
                        La SPA que ve el usuario. No importa nada de
                        backend directamente: habla solo por HTTP con{" "}
                        <code className="text-xs">/api/v1</code>.
                    </p>
                </div>
                <div className="grid gap-1">
                    <h3 className="text-sm font-medium">openspec/</h3>
                    <p className="text-sm text-muted-foreground">
                        El workflow de planeación spec-driven: los specs
                        viven en <code className="text-xs">specs/</code> y
                        los cambios en curso en{" "}
                        <code className="text-xs">changes/</code>.
                    </p>
                </div>
            </div>
        </section>
    );
}
