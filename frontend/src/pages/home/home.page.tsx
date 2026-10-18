// /src/pages/home/home.page.tsx

/**
 * Página de inicio (ruta `/`).
 * Presenta la arquitectura del proyecto como material
 * educativo: hero, capas, flujo de una petición y
 * estructura del repositorio. Las secciones se animan al
 * entrar en pantalla con `motion`, respetando la
 * preferencia de movimiento reducido del sistema.
 * @module src/pages/home/home.page
 */

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
    ArchitectureLayers,
    HomeHero,
    ProjectStructure,
    RequestFlow,
} from "@/components/home";

/** Props del contenedor animado de sección. */
type AnimatedSectionProps = {
    /** Contenido de la sección a animar */
    children: ReactNode;
};

/**
 * Envuelve una sección con una entrada sutil (fade + leve
 * desplazamiento) al entrar en el viewport, animando una
 * sola vez. Si el sistema declara `prefers-reduced-motion`
 * se renderiza sin animación alguna.
 */
function AnimatedSection({ children }: AnimatedSectionProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <section>{children}</section>;
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {children}
        </motion.section>
    );
}

/**
 * Home de arquitectura: las secciones se renderizan en
 * orden y el contenido es estático (no consume el API).
 */
export const HomePage = () => {
    return (
        <div className="mx-auto grid w-full max-w-4xl gap-4 py-6">
            <AnimatedSection>
                <HomeHero />
            </AnimatedSection>
            <AnimatedSection>
                <ArchitectureLayers />
            </AnimatedSection>
            <AnimatedSection>
                <RequestFlow />
            </AnimatedSection>
            <AnimatedSection>
                <ProjectStructure />
            </AnimatedSection>
        </div>
    );
};
