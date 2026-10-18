import "./shared/loadEnvironment.js";
import blogRoutes from "./presentation/routes/blogRoutes.js";
import { startMicroservice } from "./shared/service-runtime/startMicroservice.js";

startMicroservice({
    name: "Blogs",
    routePath: "/api/blogs",
    router: blogRoutes,
    port: process.env.BLOGS_SERVICE_PORT || 5102,
});
