import { Router } from "express";
import {
    listProjects,
    listProjectCategories,
    getProjectBySlug,
    createProject,
} from "../controllers/projectController.js";
import {
    imageUpload,
    normalizeMultipartFields,
} from "../../shared/middleware/imageUpload.js";

const router = Router();

router.get("/", listProjects);
router.get("/categories", listProjectCategories);
router.get("/:slug", getProjectBySlug);
router.post(
    "/",
    imageUpload([
        { name: "image", maxCount: 1 },
        { name: "gallery", maxCount: 20 },
    ]),
    normalizeMultipartFields,
    createProject
);

export default router;
