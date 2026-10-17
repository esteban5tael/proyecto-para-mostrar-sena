// /src/components/header/header.tsx

/**
 * Componente Header de la aplicación.
 * Renderiza la barra de navegación principal con detección
 * automática de ruta activa.
 * @module src/components/header/header
 */

import { NavLink } from "react-router";
import { cn } from "cn";

/**
 * Enlaces de navegación principales de la aplicación.
 */
const navLinks = [
  {
    label: "Inicio",
    href: "/",
  },
  {
    label: "Productos",
    href: "/products",
  },
  {
    label: "Categorías",
    href: "/categories",
  },
] as const;

/**
 * Componente Header que muestra la navegación global.
 * Resalta automáticamente el enlace correspondiente a la ruta activa.
 */
export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Navegación principal"
      >
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className="text-base font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Exhibition System
          </NavLink>

          <ul className="flex items-center gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  end={link.href === "/"}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
