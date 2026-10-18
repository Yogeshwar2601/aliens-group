import { readFile } from "node:fs/promises";
import { Pool } from "pg";

let pool;

export async function connectDB({ initializeSchema = true } = {}) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL is not configured");
    }

    pool ??= new Pool({ connectionString });
    await pool.query("SELECT 1");

    if (initializeSchema) {
        const schema = await readFile(
            new URL("./schema.sql", import.meta.url),
            "utf8"
        );
        await pool.query(schema);
    }

    console.log("PostgreSQL connected successfully");
}

export function getPool() {
    if (!pool) {
        throw new Error("PostgreSQL has not been initialized");
    }

    return pool;
}

export async function closeDB() {
    if (pool) {
        await pool.end();
        pool = undefined;
    }
}
