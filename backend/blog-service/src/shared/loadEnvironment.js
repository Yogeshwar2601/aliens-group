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
