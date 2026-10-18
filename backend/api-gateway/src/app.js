import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const environmentFiles = [
    resolve(process.cwd(), "../.env"),
    resolve(process.cwd(), ".env"),
].filter(existsSync);

if (environmentFiles.length > 0) {
    dotenv.config({ path: environmentFiles });
}

export const serviceTargets = {
    projects: process.env.PROJECTS_SERVICE_URL || "http://localhost:5101",
    blogs: process.env.BLOGS_SERVICE_URL || "http://localhost:5102",
    construction: process.env.CONSTRUCTION_SERVICE_URL || "http://localhost:5103",
    leads: process.env.LEADS_SERVICE_URL || "http://localhost:5104",
};

const serviceRoutes = [
    { name: "projects", prefix: "/api/projects" },
    { name: "blogs", prefix: "/api/blogs" },
    { name: "construction", prefix: "/api/construction-updates" },
    { name: "leads", prefix: "/api/enquiries" },
    { name: "leads", prefix: "/api/site-visits" },
];

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
    })
);
app.use(morgan("dev"));
app.use(
    "/api",
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 200,
        standardHeaders: "draft-7",
        legacyHeaders: false,
    })
);

for (const { name, prefix } of serviceRoutes) {
    const target = serviceTargets[name];

    app.use(
        createProxyMiddleware({
            target,
            pathFilter: (pathname) =>
                pathname === prefix || pathname.startsWith(`${prefix}/`),
            changeOrigin: true,
            proxyTimeout: 120_000,
            timeout: 120_000,
            on: {
                error(error, req, res) {
                    console.error(
                        `Gateway proxy error for ${prefix}: ${error.message}`
                    );

                    if (res.headersSent) {
                        res.destroy(error);
                        return;
                    }

                    res.writeHead(503, { "Content-Type": "application/json" });
                    res.end(
                        JSON.stringify({
                            success: false,
                            message: "The requested service is temporarily unavailable",
                        })
                    );
                },
            },
        })
    );
}

app.get("/api/health", async (req, res) => {
    const checks = await Promise.all(
        Object.entries(serviceTargets).map(async ([name, target]) => {
            try {
                const response = await fetch(
                    `${target.replace(/\/+$/, "")}/health`,
                    { signal: AbortSignal.timeout(1500) }
                );
                return [name, response.ok ? "healthy" : "unhealthy"];
            } catch {
                return [name, "unavailable"];
            }
        })
    );
    const services = Object.fromEntries(checks);
    const healthy = Object.values(services).every(
        (status) => status === "healthy"
    );

    res.status(healthy ? 200 : 503).json({
        success: healthy,
        gateway: "healthy",
        services,
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

export default app;
