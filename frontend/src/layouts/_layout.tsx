// /src/layouts/_layout.tsx

/**
 * Layout general de la aplicación.
 * Envuelve todas las rutas hijas y renderiza su contenido
 * a través del Outlet de React Router.
 * @module src/layouts/_layout
 */

import { Outlet } from "react-router";
import { Header } from "@/components/header";

/**
 * Layout raíz compartido por todas las páginas.
 * Aquí vivirán la navegación, el footer y cualquier
 * elemento persistente del shell de la aplicación.
 */
export const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
