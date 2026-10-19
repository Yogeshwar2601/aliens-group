import axios from "axios";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiRoot =
    configuredApiUrl ||
    (process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : "https://aliens-group.onrender.com");

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

const renderGateway = new URL(normalizedApiRoot).hostname.endsWith(
    ".onrender.com"
);
const retryDelays = [2_000, 4_000, 8_000, 16_000, 20_000];

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;
        const method = config?.method?.toLowerCase();
        const status = error.response?.status;
        const retryCount = config?._renderRetryCount || 0;
        const canRetry =
            renderGateway &&
            ["get", "head", "options"].includes(method) &&
            !config?.signal?.aborted &&
            !axios.isCancel(error) &&
            (status === undefined || status >= 500) &&
            retryCount < retryDelays.length;

        if (!canRetry) {
            throw error;
        }

        config._renderRetryCount = retryCount + 1;
        await new Promise((resolve) =>
            setTimeout(resolve, retryDelays[retryCount])
        );

        return api.request(config);
    }
);

export default api;
