# Database migrations

Standalone one-off schema initializer. Configure `DATABASE_URL`, install
dependencies, and run `npm run migrate` before deploying the backends to a new
database. It uses the existing PostgreSQL schema and does not move or delete
application data.

The Compose file in `backend/` runs this migration container once before
starting the API services.
