# AGENTS.md

## Estructura del repo

- Dos proyectos pnpm **independientes** (sin package.json raíz): `backend/` (NestJS 12 + TypeORM + PostgreSQL) y `frontend/` (Vite 8 + React 19 + React Router 8). Ejecuta todos los comandos **dentro de cada carpeta**.
- `backend/pnpm-workspace.yaml` **no** define workspaces: solo aprueba el build de `@scarf/scarf` (configuración de pnpm). El repo no tiene monorepo tooling.
- pnpm es el único gestor de paquetes permitido.
- `README.md` (raíz): guía conceptual general en español (BD, Backend, Frontend, cómo se comunican, ORM) para compañeros del SENA. Enlaza, no duplica, el detalle de `backend/README.md` y `frontend/README.md`.
- `openspec/` contiene el workflow spec-driven: specs en `openspec/specs/`, cambios en `openspec/changes/`. Usar los comandos/skills `opsx-*` de `.opencode/` (ambos directorios están en `.gitignore`).
- `.archify/` es salida generada (diagrama HTML/JSON de la skill archify), no es código del proyecto.
- No hay CI (`.github/` no existe) ni test de frontend.

## Backend (NestJS) — correr en `backend/`

- Entrypoint `src/main.ts`; un módulo por dominio en `src/{categories,products,seeders}/` (controller + service + `dto/` + `entities/`).
- `pnpm dev` (watch) · `pnpm lint` (oxlint type-aware) · `pnpm test` (vitest, unit `*.spec.ts` colocados junto al código — **hoy no existe ningún `*.spec.ts`**, la suite unitaria pasa vacía) · `pnpm test:e2e` (config `vitest.config.e2e.ts`, busca `*.e2e-spec.ts` — aún no existen) · `pnpm format` (prettier: singleQuote, trailingComma all).
- Test unitario de un solo archivo: `pnpm test -- src/<ruta>/<archivo>.spec.ts`.
- **Puerto**: el frontend hardcodea `http://localhost:5555/api/v1` en `frontend/src/lib/constants.ts`. `backend/.env.template` ya trae `PORT=5555`; si `PORT` falta del `.env`, `main.ts` cae en el fallback `3000` y el frontend no conecta.
- **ESM estricto** (`type: module`, `moduleResolution: nodenext`): los imports relativos llevan extensión `.js` aunque el archivo sea `.ts` (`import { X } from './x.service.js'`).
- **Sin migraciones**: TypeORM corre con `synchronize: true` y `autoLoadEntities: true` — el schema se auto-genera al arrancar.
- `ValidationPipe` global con `whitelist + forbidNonWhitelisted`: un campo extra en un DTO rechaza toda la request.
- Prefijo global `/api/v1` (env `API_PREFIX`); Swagger en `/api/v1/docs`.
- `POST /api/v1/seeders` resetea y siembra la BD (5 categorías × 5 productos). Solo desarrollo.
- `ServeStaticModule` sirve `backend/public/` en la raíz del server.
- `pnpm lint` (y `pnpm format`) referencia un dir `test/` que no existe; funciona igual (solo warnings hoy). Regla activa: `no-floating-promises`; `no-explicit-any` está desactivada.

## Frontend (Vite + React) — correr en `frontend/`

- Entrypoint `src/main.tsx`; rutas declaradas en `src/routes.tsx` anidadas bajo `Layout` (`src/layouts/_layout.tsx`); páginas en `src/pages/{home,products,categories,not-found}/`.
- `pnpm dev` · `pnpm build` (`tsc -b && vite build` — **es el único typecheck**, no hay script `typecheck` ni tests) · `pnpm lint` (eslint).
- React Compiler habilitado vía preset Babel en `vite.config.ts` (lento en dev/build, es esperado).
- **Aliases**: `@` → `src` y `cn` → `src/lib/utils`. Los componentes shadcn importan `{ cn } from "cn"` — es el alias, no el paquete npm `cn` de dependencies.
- shadcn style `base-luma` sobre **@base-ui/react** (no Radix), iconos `@remixicon/react`, Tailwind CSS v4 vía plugin `@tailwindcss/vite` (sin config file).
- **Capa de datos en dos niveles**: `src/services/*.service.ts` hace las llamadas axios con `api`/`toFail` de `src/lib/axios.ts`; `src/queries/{category,product}/` (barrel + `keys.ts` + hooks) envuelve eso con TanStack Query. El interceptor de axios normaliza errores (`.normalized`) y `toFail()` los convierte en `GeneralResponse` — usar ese flujo en servicios/queries nuevos.
- Formularios: react-hook-form + zod (v4), schemas en `src/schemas/`.

## Convenciones

- Commits en español con convención convencional: `feat(categories): agrega CRUD completo en frontend`.
- JSDoc y comentarios de código en español.
