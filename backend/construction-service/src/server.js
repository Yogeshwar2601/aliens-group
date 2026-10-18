import "./shared/loadEnvironment.js";
import constructionUpdateRoutes from "./presentation/routes/constructionUpdateRoutes.js";
import { startMicroservice } from "./shared/service-runtime/startMicroservice.js";

startMicroservice({
    name: "Construction updates",
    routePath: "/api/construction-updates",
    router: constructionUpdateRoutes,
    port: process.env.CONSTRUCTION_SERVICE_PORT || 5103,
});
