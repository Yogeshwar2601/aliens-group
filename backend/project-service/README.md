# Projects backend

Standalone Projects API service. It serves `/api/projects/*` on port `5101`.

Configure `DATABASE_URL` and the AWS S3 variables from `.env.example`, install
dependencies with `npm install`, and run `npm start`. The database schema must
be initialized using `database-migrations/` before the service starts.

Build its independent container from the workspace root with:

```powershell
docker build -t aliens-project-service ./backend/project-service
```
