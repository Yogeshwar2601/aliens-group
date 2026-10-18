
import axios from "axios";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiRoot =
    configuredApiUrl ||
    (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "");

if (!apiRoot) {
    throw new Error("NEXT_PUBLIC_API_URL must be configured for production.");
}

const normalizedApiRoot = apiRoot.replace(/\/+$/, "");
const apiBaseUrl = normalizedApiRoot.endsWith("/api")
    ? normalizedApiRoot
    : `${normalizedApiRoot}/api`;

const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
