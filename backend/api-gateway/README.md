# API gateway

Standalone Express API gateway on port `5000`. It proxies the frontend's
existing `/api/...` endpoints to the independently deployed Projects, Blogs,
Construction, and Leads backends.

Set `FRONTEND_URL` and the four service URL variables in `.env.example`, then
run `npm install` and `npm start`. Use `npm test` to run the gateway proxy
tests.

Build its independent container from the workspace root with:

```powershell
docker build -t aliens-api-gateway ./backend/api-gateway
```
