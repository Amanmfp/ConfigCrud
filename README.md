# Schema-driven Admin Dashboard (Django Admin-style)

This repo implements a **generic, schema-driven admin dashboard** that dynamically renders CRUD UIs for any backend-provided model definition (Users, Products, Orders, etc.), including **Many-to-One** and **Many-to-Many** relationships.

## Architecture (high level)

**Schema API → Config layer → Dynamic renderers**

- **Backend (`adminBackend`)**
  - Stores model definitions in Mongo as `SchemaDefinition` (collection: `_schemas`)
  - Builds Mongoose models **dynamically at runtime** from schema (`dynamicModel.service.ts`)
  - Exposes generic CRUD routes:
    - `GET /api/models` (sidebar)
    - `GET /api/schema/:model` (schema)
    - `GET /api/:model` (list with pagination/search/sort)
    - `GET /api/:model/:id` (fetch one record; used by View/Edit pages)
    - `POST /api/:model`, `PUT /api/:model/:id`, `DELETE /api/:model/:id`
  - Exposes schema-builder routes:
    - `GET/POST/PUT/DELETE /api/meta/models...`

- **Frontend (`adminFrontend`)**
  - **API/state layer**: React Query hooks (`useSchema`, `useData`, `useModels`, `useItem`)
  - **Dynamic table system**: `ModelTable` → `Table` uses schema to pick columns + formatting
  - **Dynamic form engine**: `FormRenderer` + `FieldRenderer`
    - `FieldRenderer` picks a field component via `fieldRegistry` (string/number/date/enum/boolean/relation)
    - Zod schema is generated from field definitions (`buildZodSchema`)
  - **Field abstraction**: `RelationField` handles Many-to-One + Many-to-Many with **search + pagination** for large datasets

## Why these choices

- **Schema-driven UI**: Adding a new model/field type is done by changing backend schema (and optionally registering a new field component), not by creating new pages.
- **Separation of concerns**:
  - Hooks own async state/caching
  - Table/Form are generic renderers
  - Field components own only field-level UI + RHF integration
- **Scalability**:
  - Server-side pagination/search/sort for listings (`GET /api/:model?page&limit&search&sortBy&order`)
  - Fetch-by-id for View/Edit (`GET /api/:model/:id`) avoids downloading entire lists
  - Relation option loading is **incremental** (search + load more)

## Run locally

### Backend

```bash
cd adminBackend
npm install
npm run dev
```

Set `MONGO_URI` in your environment if you’re not using the default:

```bash
export MONGO_URI="mongodb://localhost:27017/admin_panel"
```

### Frontend

```bash
cd adminFrontend
npm install
npm run dev
```

Optional API base URL:

```bash
export VITE_API_URL="http://localhost:3000/api"
```

## Key folders (frontend)

- `src/hooks/`: data fetching/caching + mutations
- `src/components/table/`: generic table renderer
- `src/components/form/`: schema-driven form engine
- `src/components/fields/`: field registry + field components
- `src/types/`: schema + field typings

