// /src/layouts/_layout.tsx

/**
 * Layout general de la aplicación.
 * Envuelve todas las rutas hijas y renderiza su contenido
 * a través del Outlet de React Router.
 * @module src/layouts/_layout
 */

import { Outlet } from "react-router";

/**
 * Layout raíz compartido por todas las páginas.
 * Aquí vivirán la navegación, el footer y cualquier
 * elemento persistente del shell de la aplicación.
 */
export const Layout = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
};
