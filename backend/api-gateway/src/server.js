import app from "./app.js";

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "127.0.0.1";

const server = app.listen(PORT, HOST, () => {
    console.log(`API gateway running on http://localhost:${PORT}`);
});

function shutdown() {
    server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);