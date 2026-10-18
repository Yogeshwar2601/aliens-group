import express from "express";
import helmet from "helmet";
import morgan from "morgan";

export function createMicroservice({ name, routePath, router }) {
    const app = express();

    app.disable("x-powered-by");
    app.use(helmet());
    app.use(express.json({ limit: "1mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan("dev"));

    app.get("/health", (req, res) => {
        res.status(200).json({ success: true, service: name });
    });

    app.use(routePath, router);

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: "Route not found",
        });
    });

    app.use((error, req, res, next) => {
        console.error(`[${name}]`, error);

        if (res.headersSent) {
            next(error);
            return;
        }

        res.status(error.status || 500).json({
            success: false,
            message:
                process.env.NODE_ENV === "production"
                    ? "Internal server error"
                    : error.message,
        });
    });

    return app;
}
