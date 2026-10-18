// /src/layouts/_layout.tsx

/**
 * Layout general de la aplicación.
 * Envuelve todas las rutas hijas y renderiza su contenido
 * a través del Outlet de React Router, animado con
 * `AnimatePresence mode="wait"` para que al cambiar de
 * ruta la página salga con un fundido breve antes de que
 * entre la siguiente, sin superponerlas.
 * @module src/layouts/_layout
 */

import { Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Header } from "@/components/header";
import { pageVariants } from "@/lib/motion";

/**
 * Layout raíz compartido por todas las páginas.
 * El contenido se identifica por el pathname: navegar a
 * la misma ruta no vuelve a animar la página.
 */
export const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
