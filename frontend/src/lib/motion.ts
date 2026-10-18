// /src/lib/motion.ts

/**
 * Tokens y variantes de animación compartidos por toda la
 * aplicación.
 * Centraliza easing, duraciones y desplazamientos para que
 * todo el movimiento de la UI conserve el mismo carácter
 * sobrio. El easing es el mismo cubic-bezier que ya usan
 * los toasts de sonner.
 * @module src/lib/motion
 */

import type {
    TargetAndTransition,
    Variants,
} from "motion/react";

/**
 * Easing compartido por todas las animaciones de la app:
 * la curva cubic-bezier(0.22, 1, 0.36, 1) de los toasts.
 */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Duración de las salidas (fundido de retirada), en segundos. */
const DURATION_EXIT = 0.15;

/** Duración de las entradas (fundido de aparición), en segundos. */
const DURATION_ENTER = 0.25;

/** Duración de las micro-interacciones de puntero, en segundos. */
const DURATION_HOVER = 0.2;

/** Desplazamiento vertical de la transición de página, en px. */
const PAGE_DISTANCE = 8;

/** Desplazamiento vertical de entrada de una tarjeta, en px. */
const ITEM_DISTANCE = 8;

/** Elevación de la tarjeta bajo el puntero (negativo = arriba), en px. */
const HOVER_LIFT = -2;

/** Paso base del escalonado por elemento, en segundos. */
const STAGGER_STEP = 0.04;

/** Tope del retardo escalonado, en segundos. */
const STAGGER_CAP = 0.3;

/**
 * Retardo escalonado acotado por posición.
 * Sin este tope, un listado de 20 tarjetas dejaría la
 * última esperando más de un segundo; el tope garantiza
 * que cualquier listado sea visible entero en menos de
 * 0,5 s.
 *
 * @param index - Posición del elemento dentro del listado
 * @returns Retardo en segundos, nunca mayor que el tope
 *
 * @example
 * staggerDelay(2); // 0.08
 * staggerDelay(15); // 0.3 (tope)
 */
function staggerDelay(index: number): number {
    return Math.min(index * STAGGER_STEP, STAGGER_CAP);
}

/**
 * Variantes de la transición entre páginas.
 * Entrada con fundido y desplazamiento vertical de 8 px
 * hacia arriba; salida con fundido más breve (150 ms) y
 * desplazamiento de 4 px.
 */
export const pageVariants: Variants = {
    initial: { opacity: 0, y: PAGE_DISTANCE },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION_ENTER, ease: EASE },
    },
    exit: {
        opacity: 0,
        y: -PAGE_DISTANCE / 2,
        transition: { duration: DURATION_EXIT, ease: EASE },
    },
};

/**
 * Variantes de una tarjeta dentro de un listado.
 * La variante `animate` recibe el índice mediante `custom`
 * para aplicar el retardo escalonado acotado.
 */
export const listItemVariants: Variants = {
    initial: { opacity: 0, y: ITEM_DISTANCE },
    animate: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: DURATION_ENTER,
            ease: EASE,
            delay: staggerDelay(index),
        },
    }),
    exit: {
        opacity: 0,
        transition: { duration: DURATION_EXIT, ease: EASE },
    },
};

/**
 * Elevación de la tarjeta bajo el puntero.
 * Se aplica como objeto de `whileHover` sobre el wrapper
 * motion de cada tarjeta del listado.
 */
export const cardHover: TargetAndTransition = {
    y: HOVER_LIFT,
    transition: { duration: DURATION_HOVER, ease: EASE },
};
