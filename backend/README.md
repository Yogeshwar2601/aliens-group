# Backend services

| Service | Folder | Port | API routes |
| --- | --- | ---: | --- |
| API gateway | `api-gateway/` | 5000 | Existing public `/api/*` paths |
| Projects | `project-service/` | 5101 | `/api/projects/*` |
| Blogs | `blog-service/` | 5102 | `/api/blogs/*` |
| Construction updates | `construction-service/` | 5103 | `/api/construction-updates/*` |
| Leads | `lead-service/` | 5104 | `/api/enquiries/*`, `/api/site-visits/*` |
| Database migrations | `database-migrations/` | One-off | Existing shared PostgreSQL schema |

All four domain services are independently installable and deployable. The
gateway can run separately and is configured with the four service URLs. Blog
and construction routes remain distinct services and distinct public API
paths.

## Local development

Copy this folder's `.env.example` to `.env`, then configure the PostgreSQL
connection, AWS settings, and frontend origin. Each backend checks this shared
`backend/.env` first, then its own service-folder `.env` for any missing
variables. This lets all local services use one database connection setting
without copying credentials into every folder.

Initialize the existing database schema once:

```powershell
Set-Location database-migrations
npm install
npm run migrate
```

Start each service in a separate terminal, running `npm install` and `npm start`
from each service folder. Use `npm run dev` for watch mode. Start the gateway
from `api-gateway/` after the services are listening. For local gateway use,
the service URLs should point to `http://localhost:5101` through
`http://localhost:5104`.

## Independent deployments

Each service directory is a standalone Docker build context. Configure its
environment variables in the deployment platform and build its Docker image
from that directory. For example, from the workspace root:

```powershell
docker build -t aliens-project-service ./backend/project-service
```

Deploy `api-gateway/` separately and configure `PROJECTS_SERVICE_URL`,
`BLOGS_SERVICE_URL`, `CONSTRUCTION_SERVICE_URL`, and `LEADS_SERVICE_URL` with
the deployed service addresses. Run `database-migrations/` once before
connecting the services to a new database.

## Render deployment

The root `render.yaml` Blueprint creates the four public API services and
attaches the `aliens-group-backend` environment group. In Render, create a
Blueprint from this repository's `main` branch and apply the configuration.
The APIs use Render's Free plan; each service has a public URL and may spin down
when idle.

After the four services are live, set `HOST=0.0.0.0` and their deployed URLs in
the existing API gateway service:

| Variable | Value |
| --- | --- |
| `PROJECTS_SERVICE_URL` | Project service URL |
| `BLOGS_SERVICE_URL` | Blog service URL |
| `CONSTRUCTION_SERVICE_URL` | Construction service URL |
| `LEADS_SERVICE_URL` | Lead service URL |

The existing gateway must use the same `FRONTEND_URL` as the deployed website.
Set `NEXT_PUBLIC_API_URL` in the frontend deployment to the gateway URL.
Confirm the production database already has the application's schema; otherwise
run `database-migrations/` once against that database before opening the APIs.

## Run the full stack with Docker Compose

Create `backend/.env` from `.env.example`, configure `DATABASE_URL`, AWS
settings, and `FRONTEND_URL`, then run from this folder:

```powershell
docker compose up --build
```

Compose builds a separate image from every service folder and runs the schema
migration before starting the APIs. Only the gateway is required by the
frontend; Compose also publishes the service ports for local development. A
`localhost` database URL inside a container refers to that container, so use a
host reachable from Docker.

## Gateway tests

```powershell
Set-Location api-gateway
npm install
npm test
```

The service folders preserve existing PostgreSQL and S3 behavior. Projects,
blogs, and construction uploads require AWS credentials, region, bucket, and
optional `AWS_S3_PUBLIC_URL` settings. The gateway preserves request bodies
for multipart image/video uploads.
