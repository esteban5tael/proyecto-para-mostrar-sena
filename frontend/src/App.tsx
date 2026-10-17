// /src/App.tsx

/**
 * Punto de montaje del router de la aplicación.
 * El BrowserRouter envuelve el árbol de rutas definido en src/routes.
 * @module src/App
 */

import { BrowserRouter } from "react-router";

import { AppRoutes } from "./routes";

/**
 * Componente raíz que monta el BrowserRouter y renderiza
 * el árbol de rutas de la aplicación.
 */
export const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
