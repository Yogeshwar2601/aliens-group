import "./shared/loadEnvironment.js";
import enquiryRoutes from "./presentation/routes/enquiryRoutes.js";
import siteVisitRoutes from "./presentation/routes/siteVisitRoutes.js";
import { startMicroservice } from "./shared/service-runtime/startMicroservice.js";
import express from "express";

const leadsRouter = express.Router();
leadsRouter.use("/enquiries", enquiryRoutes);
leadsRouter.use("/site-visits", siteVisitRoutes);

startMicroservice({
    name: "Leads",
    routePath: "/api",
    router: leadsRouter,
    port: process.env.LEADS_SERVICE_PORT || 5104,
});
