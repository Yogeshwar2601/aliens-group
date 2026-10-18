import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { closeDB, connectDB } from "./connectDB.js";

const environmentFiles = [
    resolve(process.cwd(), "../.env"),
    resolve(process.cwd(), ".env"),
].filter(existsSync);

if (environmentFiles.length > 0) {
    dotenv.config({ path: environmentFiles });
}

try {
    await connectDB();
    console.log("Database schema is up to date");
} catch (error) {
    console.error("Database migration failed:", error.message);
    process.exitCode = 1;
} finally {
    await closeDB();
}
