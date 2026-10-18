# AGENTS.md

## Estructura del repo

- Dos proyectos pnpm **independentes** (sin package.json raíz ni workspace): `backend/` (NestJS 12 + TypeORM + PostgreSQL) y `frontend/` (Vite 8 + React 19 + React Router 8). Ejecuta todos los comandos **dentro de cada carpeta**.
- pnpm es el único gestor de paquetes permitido.
- `openspec/` contiene el workflow spec-driven: specs en `openspec/specs/`, cambios en `openspec/changes/`. Usar los comandos/skills `opsx-*` de `.opencode/`.
- No hay CI (`.github/` no existe) ni test de frontend.

## Backend (NestJS) — correr en `backend/`

- `pnpm dev` (watch) · `pnpm lint` (oxlint type-aware) · `pnpm test` (vitest, unit `*.spec.ts` colocados junto al código) · `pnpm test:e2e` (config `vitest.config.e2e.ts`, busca `*.e2e-spec.ts` — aún no existen) · `pnpm format` (prettier: singleQuote, trailingComma all).
- **Puerto**: `backend/.env` usa `PORT=5555` porque el frontend hardcodea `http://localhost:5555/api/v1` en `frontend/src/lib/constants.ts`. `backend/.env.template` dice `PORT=3000` (stale) — copiar el `.env` exige cambiarlo a 5555 o el frontend no conecta.
- **ESM estricto** (`type: module`, `moduleResolution: nodenext`): los imports relativos llevan extensión `.js` aunque el archivo sea `.ts` (`import { X } from './x.service.js'`).
- **Sin migraciones**: TypeORM corre con `synchronize: true` y `autoLoadEntities: true` — el schema se auto-genera al arrancar.
- `ValidationPipe` global con `whitelist + forbidNonWhitelisted`: un campo extra en un DTO rechaza toda la request.
- Prefijo global `/api/v1` (env `API_PREFIX`); Swagger en `/api/v1/docs`.
- `POST /api/v1/seeders` resetea y siembra la BD (5 categorías × 5 productos). Solo desarrollo.
- `ServeStaticModule` sirve `backend/public/` en la raíz del server.
- `pnpm lint` referencia un dir `test/` que no existe; funciona igual (solo warnings hoy). Regla activa: `no-floating-promises`; `no-explicit-any` está desactivada.

## Frontend (Vite + React) — correr en `frontend/`

- `pnpm dev` · `pnpm build` (`tsc -b && vite build` — **es el único typecheck**, no hay script `typecheck` ni tests) · `pnpm lint` (eslint).
- React Compiler habilitado vía preset Babel en `vite.config.ts` (lento en dev/build, es esperado).
- **Aliases**: `@` → `src` y `cn` → `src/lib/utils`. Los componentes shadcn importan `{ cn } from "cn"` — es el alias, no el paquete npm `cn` de dependencies.
- shadcn style `base-luma` sobre **@base-ui/react** (no Radix), iconos `@remixicon/react`, Tailwind CSS v4 vía plugin `@tailwindcss/vite` (sin config file).
- Capa de datos: TanStack Query en `src/queries/{category,product}/` (`queries.ts`, `mutations.ts`, `index.ts`). El axios instance con interceptor en `src/lib/axios.ts` normaliza errores (`.normalized`) y `toFail()` los convierte en `GeneralResponse` — usar ese flujo en queries/mutations nuevas.
- Formularios: react-hook-form + zod, schemas en `src/schemas/`. Páginas en `src/pages/*`; rutas declaradas en `src/routes.tsx` anidadas bajo `Layout`.

## Convenciones

- Commits en español con convención convencional: `feat(categories): agrega CRUD completo en frontend`.
- JSDoc y comentarios de código en español.
