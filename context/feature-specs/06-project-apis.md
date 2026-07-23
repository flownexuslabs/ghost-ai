The database schema is ready. Build the backend project API routes only.

## Routes

Create REST endpoints for:

- `GET /api/projects` , list current user’s projects
- `POST /api/projects` , create project
- `PATCH /api/projects/[projectId]` , rename project
- `DELETE /api/projects/[projectId]` , delete project

## Rules

Use the authenticated Clerk user ID as `ownerId`.

When creating:

- default missing project name to `Untitled Project`
- use the schema’s existing ID strategy (cuid), do not add sequential IDs
- exception: an optional client-supplied `id` is accepted and used as `Project.id` instead of the generated cuid, so the project id can double as the Liveblocks room id (see 07-wire-editor-home.md); falls back to the schema default if omitted or invalid

Security:

- unauthenticated requests return `401`
- only the project owner can rename or delete
- non-owner mutations return `403`

Keep this backend-only. Do not wire the UI yet.

## Check When Done

- routes exist for list/create/rename/delete
- owner checks are enforced for rename/delete
- `401` and `403` responses are handled correctly
- `npm run build` passes
