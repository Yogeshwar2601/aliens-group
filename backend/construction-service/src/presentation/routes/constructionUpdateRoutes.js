import { Router } from "express";
import {
    createConstructionUpdate,
    getConstructionUpdateById,
    listConstructionGallery,
    listConstructionUpdates,
} from "../controllers/constructionUpdateController.js";
import {
    constructionMediaUpload,
    normalizeMultipartFields,
} from "../../shared/middleware/imageUpload.js";

const router = Router();

router.get("/", listConstructionUpdates);
router.get("/gallery", listConstructionGallery);
router.get("/:id", getConstructionUpdateById);
router.post(
    "/",
    constructionMediaUpload([
        { name: "image", maxCount: 1 },
        { name: "gallery", maxCount: 20 },
        { name: "video", maxCount: 1 },
    ]),
    normalizeMultipartFields,
    createConstructionUpdate
);

export default router;
