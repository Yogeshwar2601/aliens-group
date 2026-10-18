# Aliens Group

The website and API backends are organized separately:

```text
aliens-group/
├── frontend/                 Existing Next.js website
├── backend/
│   ├── api-gateway/          Public API proxy
│   ├── project-service/      Projects API
│   ├── blog-service/         Blogs API
│   ├── construction-service/ Construction updates API
│   ├── lead-service/         Enquiries and site visits API
│   ├── database-migrations/  One-off PostgreSQL schema migration
│   └── docker-compose.yml    Optional local orchestration
└── README.md
```

Each backend service has its own package manifest, lockfile, Dockerfile, source
tree, and `.env.example`. Build and deploy services from their own folders.
Shared database, upload, and HTTP runtime helpers are copied into the services
that use them, so a deployment does not depend on another service's source.

The API gateway keeps the existing frontend API paths. It routes projects,
blogs, construction updates, and leads requests to their independently
deployable services.

See [backend/README.md](./backend/README.md) for startup and deployment
instructions.
