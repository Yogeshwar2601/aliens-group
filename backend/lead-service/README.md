# Leads backend

Standalone Leads API service. It serves `/api/enquiries/*` and
`/api/site-visits/*` on port `5104`.

Configure `DATABASE_URL` from `.env.example`, install dependencies with
`npm install`, and run `npm start`. The database schema must be initialized
using `database-migrations/` before the service starts.

Build its independent container from the workspace root with:

```powershell
docker build -t aliens-lead-service ./backend/lead-service
```
