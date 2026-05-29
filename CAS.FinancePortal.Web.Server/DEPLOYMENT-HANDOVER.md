# Deployment handover — local vs live

This API project is currently configured for **local development**, not production.

## What is temporary (local only)

| Setting | Current value | Live action |
|--------|----------------|-------------|
| `ConnectionStrings:DefaultConnection` | `(localdb)\MSSQLLocalDB` → `ChecklistDb` | Set to production SQL Server + catalog |
| `ConnectionStrings:SuperApplicationConnection` | Same LocalDB | Set to production SQL (or shared auth DB) |
| CORS (`Program.cs`) | `localhost` origins only | Add production portal URL(s) |
| Controllers | Some `[AllowAnonymous]` + dev employee id `9` on localhost | Use real JWT + `employee_id` claim |
| React client | `VITE_API_URL` → `https://localhost:7002` | Point to live API (see `.env.example`) |

## Go-live checklist

1. **Database** — Update connection strings in `appsettings.Production.json` or environment variables on the server.
2. **Migrations** — `dotnet ef database update --context CurrentApplicationDbContext` against the live database.
3. **API host** — Deploy this project; confirm HTTPS URL matches what the client will call.
4. **Client** — Copy `cas.adminportal.web.client/.env.example` to `.env`; set `VITE_API_URL` and auth URLs to production values; rebuild.
5. **Auth** — Identity server: `https://172.16.254.4/cas/services/identity_server` (see `Program.cs`).
6. **Verify** — Save a checklist, confirm rows appear in live `Monitoring` / `Checklist` tables; compare UTC in SSMS vs local time in the UI.

## Time storage note

Checklist `CreatedAt` / `UpdatedAt` and `Monitoring.CreatedAtUtc` are stored as **Philippines local wall clock** (Asia/Manila, UTC+8) via `PhilippinesTime` in `Core/PhilippinesTime.cs`. SSMS and the Monitoring UI should show the same PH time. Older rows saved before this change may still be UTC and can look offset by 8 hours until re-saved.
