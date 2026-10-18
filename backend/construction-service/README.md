# Construction backend

Standalone Construction Updates API service. It serves
`/api/construction-updates/*` on port `5103`.

Configure `DATABASE_URL` and the AWS S3 variables from `.env.example`, install
dependencies with `npm install`, and run `npm start`. The database schema must
be initialized using `database-migrations/` before the service starts.

Build its independent container from the workspace root with:

```powershell
docker build -t aliens-construction-service ./backend/construction-service
```
