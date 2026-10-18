import "./shared/loadEnvironment.js";
import projectRoutes from "./presentation/routes/projectRoutes.js";
import { startMicroservice } from "./shared/service-runtime/startMicroservice.js";

startMicroservice({
    name: "Projects",
    routePath: "/api/projects",
    router: projectRoutes,
    port: process.env.PROJECTS_SERVICE_PORT || 5101,
});
