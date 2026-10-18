import { Router } from "express";
import { submitSiteVisit } from "../controllers/siteVisitController.js";

const router = Router();

router.post("/", submitSiteVisit);

export default router;
