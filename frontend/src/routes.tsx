// /src/routes.tsx

/**
 * Definición de rutas de la aplicación.
 * Todas las páginas cuelgan del Layout general mediante
 * rutas anidadas, incluyendo las rutas con parámetro :id.
 * @module src/routes
 */

import { Routes, Route } from "react-router";

import { Layout } from "./layouts/_layout";

import { HomePage } from "./pages/home/home.page";
import { ProductsList } from "./pages/products/products-list";
import { ProductCreate } from "./pages/products/product-create";
import { ProductView } from "./pages/products/product-view";
import { ProductEdit } from "./pages/products/product-edit";
import { CategoriesList } from "./pages/categories/categories-list";
import { CategoryCreate } from "./pages/categories/category-create";
import { CategoryView } from "./pages/categories/category-view";
import { CategoryEdit } from "./pages/categories/category-edit";
import { NotFound } from "./pages/not-found/not-found";

/**
 * Árbol de rutas declarativo de la SPA.
 * El Layout envuelve todas las páginas como ruta padre.
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta raíz — todas las páginas cuelgan del Layout general */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />

        {/* Rutas de productos */}
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/create" element={<ProductCreate />} />
        <Route path="/products/:id" element={<ProductView />} />
        <Route path="/products/:id/edit" element={<ProductEdit />} />

        {/* Rutas de categorías */}
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories/create" element={<CategoryCreate />} />
        <Route path="/categories/:id" element={<CategoryView />} />
        <Route path="/categories/:id/edit" element={<CategoryEdit />} />

        {/* Ruta comodín — página 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
