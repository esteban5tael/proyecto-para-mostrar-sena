// /src/components/home/request-flow.tsx

/**
 * Sección del flujo de una petición de extremo a extremo.
 * Describe la secuencia real que recorre un dato: desde la
 * UI en el navegador hasta PostgreSQL y de vuelta a la caché,
 * nombrando los componentes que lo implementan en el repo.
 * @module src/components/home/request-flow
 */

/** Un paso del recorrido de la petición. */
type FlowStep = {
    /** Número del paso en la secuencia */
    number: number;
    /** Nombre del paso */
    title: string;
    /** Componente real del repo que lo implementa */
    component: string;
    /** Qué ocurre en este paso */
    description: string;
};

/** Secuencia real de una petición, verificada contra el código. */
const steps: FlowStep[] = [
    {
        number: 1,
        title: "La UI pide datos",
        component: "src/pages/products/products-list.tsx",
        description:
            "Una página se monta y su hook de TanStack Query dispara la carga del listado.",
    },
    {
        number: 2,
        title: "TanStack Query decide",
        component: "src/queries/product/queries.ts",
        description:
            "Si la caché tiene datos vigentes los devuelve al instante; si no, ejecuta la función de fetch con la query key correspondiente.",
    },
    {
        number: 3,
        title: "axios envía la petición",
        component: "src/lib/axios.ts",
        description:
            "La instancia con baseURL http://localhost:5555/api/v1 arma la petición HTTP y su interceptor normaliza cualquier error del servidor.",
    },
    {
        number: 4,
        title: "NestJS valida y despacha",
        component: "backend/src/products/products.controller.ts",
        description:
            "El controller recibe la ruta bajo /api/v1; el ValidationPipe global valida el DTO y rechaza campos no declarados (whitelist + forbidNonWhitelisted).",
    },
    {
        number: 5,
        title: "TypeORM consulta PostgreSQL",
        component: "backend/src/products/products.service.ts",
        description:
            "El service traduce la petición en una consulta TypeORM y PostgreSQL (puerto 5432) devuelve las filas.",
    },
    {
        number: 6,
        title: "La respuesta vuelve a la UI",
        component: "src/queries/product/queries.ts",
        description:
            "El JSON regresa por /api/v1, TanStack Query lo cachea bajo su key y la página se re-renderiza con los datos frescos. Los errores se normalizan y se muestran con sonner.",
    },
];

/**
 * Renderiza la sección de flujo: los seis pasos en orden,
 * cada uno con su componente real del repositorio.
 */
export function RequestFlow() {
    return (
        <section aria-labelledby="flujo-heading" className="grid gap-4 py-8">
            <h2
                id="flujo-heading"
                className="font-semibold tracking-tight text-2xl"
            >
                El viaje de una petición
            </h2>
            <p className="max-w-2xl text-muted-foreground">
                Este es el recorrido completo que hace, por ejemplo, el
                listado de productos cuando abres{" "}
                <code className="text-sm">/products</code>. Cada paso vive
                en un archivo concreto del repo.
            </p>

            <ol className="grid gap-3">
                {steps.map((step) => (
                    <li
                        key={step.number}
                        className="grid gap-1 rounded-lg border border-border p-4 sm:grid-cols-[auto_1fr] sm:gap-4"
                    >
                        <span
                            aria-hidden="true"
                            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-medium text-primary"
                        >
                            {step.number}
                        </span>
                        <div className="grid gap-1">
                            <h3 className="font-medium">{step.title}</h3>
                            <p className="text-sm">{step.description}</p>
                            <code className="text-xs text-muted-foreground">
                                {step.component}
                            </code>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}
