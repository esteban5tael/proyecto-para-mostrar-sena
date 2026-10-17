// /src/queries/query-client.ts

/**
 * Instancia singleton de QueryClient de TanStack Query v5.
 * Define los defaults de la aplicación: datos frescos por
 * 5 minutos, caché 10 minutos y un reintento por query.
 * @module src/queries/query-client
 */

import { QueryClient } from "@tanstack/react-query";

/** Cliente de queries compartido por toda la aplicación. */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        },
        mutations: {
            retry: 0,
        },
    },
});
