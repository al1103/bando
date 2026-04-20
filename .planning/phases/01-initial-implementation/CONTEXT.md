# Phase 1 Context: Real Estate Management API

## Objectives
Implement a robust REST API for property management with role-based access control (RBAC) and PostGIS integration.

## Acceptance Criteria
- [x] JWT Authentication for all protected routes.
- [x] Role-based access: `USER` and `ADMIN`.
- [x] Property status management: `PENDING`, `APPROVED`, `REJECTED`.
- [x] Ownership check: Users can only modify their own properties.
- [x] Public access: Only `APPROVED` and non-expired properties are visible.
- [x] Location search: `nearby` search within a radius using PostGIS.
- [x] Favorites: Users can manage their list of favorite properties.

## Decisions
- Use **Prisma 6** for schema management (for simplicity in direct DATABASE_URL usage).
- Use **raw SQL** for PostGIS operations to handle `Unsupported` types.
- Use **UUIDs** for all identifiers.
- Store location as **Geography(Point, 4326)**.
