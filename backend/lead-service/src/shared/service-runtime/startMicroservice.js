import "../loadEnvironment.js";
import { connectDB } from "../database/connectDB.js";
import { createMicroservice } from "./createMicroservice.js";

export async function startMicroservice({ name, routePath, router, port }) {
    try {
        await connectDB({ initializeSchema: false });
        const app = createMicroservice({ name, routePath, router });
        const host = process.env.SERVICE_HOST || "127.0.0.1";
        const server = app.listen(port, host, () => {
            console.log(`${name} service listening on port ${port}`);
        });

        const shutdown = () => {
            server.close(() => process.exit(0));
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
    } catch (error) {
        console.error(`Failed to start ${name} service:`, error.message);
        process.exit(1);
    }
}
