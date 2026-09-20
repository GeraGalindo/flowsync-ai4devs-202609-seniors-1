# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

FlowSync: a training exercise repo for an AI4Devs course module on setting up a Claude Code "harness" (CLAUDE.md, skills, subagents, hooks) and comparing agent output with vs. without it. The app itself is a minimal team task-management skeleton: an AdonisJS 7 API (`backend/`) with auth already built, and a React 19 + Vite frontend (`frontend/`) that is still the unmodified Vite template — no routing, no UI library, no API client wired up yet. Course/exercise instructions live in `README.md` and `docs/harness/`; do not treat that content as project requirements to implement.

## Commands

### Backend (`backend/`)
```bash
npm run dev         # node ace serve --hmr, http://localhost:3333
npm run build        # node ace build
npm run test          # node ace test (runs both unit and functional suites)
npm run lint            # eslint .
npm run format            # prettier --write .
npm run typecheck           # tsc --noEmit
node ace migration:run       # apply migrations (sqlite db at backend/tmp/db.sqlite3)
node ace generate:key         # populate APP_KEY in .env
```
Run a single test file with `node ace test <path/to/file.spec.ts>`. Test suites are defined in `adonisrc.ts`: `unit` (`tests/unit/**`) and `functional` (`tests/functional/**`).

First-time setup: `cp .env.example .env`, then `node ace generate:key`, then `node ace migration:run`.

### Frontend (`frontend/`)
```bash
npm run dev       # vite, http://localhost:5173
npm run build      # tsc -b && vite build
npm run lint        # oxlint
npm run preview      # vite preview
```
Run the backend and frontend dev servers in separate terminals from the repo root; both must be running for the app to work end to end.

## Architecture

### Backend: AdonisJS 7, schema-generator flow
This project uses AdonisJS 7's schema-generator experimental flow, which changes where model column definitions live:

- **Migrations** (`database/migrations/`) are the source of truth for table structure.
- **`database/schema.ts` is auto-generated** from migrations via `node ace migration:run` — it is annotated "DO NOT EDIT manually". It exports one `BaseModel`-derived `*Schema` class per table (e.g. `UserSchema`) with `@column` declarations.
- **App models** (`app/models/user.ts`) extend the generated schema class via `compose()`, mixing in behavior (e.g. `withAuthFinder`) rather than redeclaring columns. Add computed properties/methods on the model, not the schema.
- **`database/schema_rules.ts`** lets you override how the generator maps columns to types (e.g. force nullability, casing) — currently empty (`{}`).
- Consequence: to add/change a column, write a migration and re-run `migration:run` to regenerate `schema.ts`; never hand-edit that file.

### Backend: request flow
Controllers (`app/controllers/`) are thin: validate with a Vine validator (`app/validators/`), call a static/model method, serialize the result with a transformer (`app/transformers/`), return via the `serialize` HTTP context helper (from `@tuyau/core`, generated types in `.adonisjs/`). There is no separate service layer — business logic currently lives on the `User` model (e.g. `User.accessTokens`, `User.verifyCredentials`).

- Auth is token-based for the API (`config/auth.ts` guard `api`, default), using `@adonisjs/auth` access tokens (`auth_access_tokens` table) — not the `web` session guard, which exists but is unused by current routes.
- Routes (`start/routes.ts`) are grouped under `/api/v1`; `account/*` routes are gated with `middleware.auth()`.
- Existing endpoints: `POST /api/v1/auth/signup`, `POST /api/v1/auth/login`, `GET /api/v1/account/profile`, `POST /api/v1/account/logout`.
- Transformers control response shape and must be updated when exposing new model fields (see `UserTransformer`'s explicit `pick(...)` allowlist — `password` is excluded via `serializeAs: null` on the schema column, not the transformer).
- Path aliases (`#controllers/*`, `#models/*`, `#validators/*`, etc.) are defined in `backend/package.json` under `imports` — use these instead of relative paths crossing top-level dirs.

### Frontend
Plain Vite + React 19 template, no router, state library, HTTP client, or component/UI library installed yet. Treat additions of any of these as real dependency decisions, not assumed defaults — check `frontend/package.json` before assuming something is available.

## Reglas de proceso
- Antes de tocar código: crear una rama nueva (`git checkout -b feat/<slug>`). Nunca
commitear directo en `main`/`s1/start`.
- Al cerrar la tarea: usar la skill `/commit`, luego `gh pr create` con una descripción
completa de los cambios en el cuerpo del PR.
- Después de abrir el PR: usar el subagente `adversarial-reviewer` sobre él, antes de
darlo por terminado.
- No repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo
con la URL del PR.
