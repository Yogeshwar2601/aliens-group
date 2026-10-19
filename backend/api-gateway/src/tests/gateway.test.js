import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "node:http";

const services = new Map();
const gatewayServer = createServer();
let gatewayUrl;

function listen(server) {
    return new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", () => {
            server.off("error", reject);
            resolve(`http://127.0.0.1:${server.address().port}`);
        });
    });
}

function close(server) {
    return new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
    });
}

before(async () => {
    for (const name of ["projects", "blogs", "construction", "leads"]) {
        const server = createServer(async (req, res) => {
            if (req.url === "/health") {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true }));
                return;
            }

            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const body = Buffer.concat(chunks);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    service: name,
                    method: req.method,
                    url: req.url,
                    contentType: req.headers["content-type"],
                    body: body.toString("base64"),
                })
            );
        });
        const target = await listen(server);
        services.set(name, server);
        process.env[`${name.toUpperCase()}_SERVICE_URL`] = target;
    }

    const { default: app } = await import("../app.js");
    gatewayServer.on("request", app);
    gatewayUrl = await listen(gatewayServer);
});

after(async () => {
    await Promise.all([
        close(gatewayServer),
        ...[...services.values()].map(close),
    ]);
});

test("proxies project routes and keeps query strings", async () => {
    const response = await fetch(
        `${gatewayUrl}/api/projects/categories?category=Residential`
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.service, "projects");
    assert.equal(body.url, "/api/projects/categories?category=Residential");
});

test("proxies blog routes", async () => {
    const response = await fetch(`${gatewayUrl}/api/blogs/example-post`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.service, "blogs");
    assert.equal(body.url, "/api/blogs/example-post");
});

test("streams construction uploads without consuming their body", async () => {
    const payload = Buffer.from([0, 1, 2, 3, 255, 128]);
    const response = await fetch(
        `${gatewayUrl}/api/construction-updates`,
        {
            method: "POST",
            headers: { "Content-Type": "application/octet-stream" },
            body: payload,
        }
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.service, "construction");
    assert.equal(body.method, "POST");
    assert.equal(body.body, payload.toString("base64"));
});

test("routes both enquiry and site visit endpoints to leads", async () => {
    for (const path of ["/api/enquiries", "/api/site-visits"]) {
        const response = await fetch(`${gatewayUrl}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName: "Test" }),
        });
        const body = await response.json();

        assert.equal(response.status, 200);
        assert.equal(body.service, "leads");
        assert.equal(body.url, path);
    }
});

test("gateway health reports all downstream services", async () => {
    const response = await fetch(`${gatewayUrl}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.gateway, "healthy");
    assert.deepEqual(body.services, {
        projects: "healthy",
        blogs: "healthy",
        construction: "healthy",
        leads: "healthy",
    });
});

test("allows browser requests from the production and Vercel websites", async () => {
    for (const origin of [
        "https://aliensgroup.in",
        "https://aliens-groups-juayqv4nv-yogeshwars-projects-79f9a555.vercel.app",
    ]) {
        const response = await fetch(`${gatewayUrl}/api/projects/categories`, {
            method: "OPTIONS",
            headers: {
                Origin: origin,
                "Access-Control-Request-Method": "GET",
            },
        });

        assert.equal(response.status, 204);
        assert.equal(response.headers.get("access-control-allow-origin"), origin);
    }
});

test("returns a JSON 404 for routes not handled by the gateway", async () => {
    const response = await fetch(`${gatewayUrl}/api/not-a-service`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.success, false);
});
