import { Router } from "express";
import {
    createBlog,
    getBlogBySlug,
    listBlogs,
} from "../controllers/blogController.js";
import {
    imageUpload,
    normalizeMultipartFields,
} from "../../shared/middleware/imageUpload.js";

const router = Router();

router.get("/", listBlogs);
router.get("/:slug", getBlogBySlug);
router.post(
    "/",
    imageUpload([{ name: "coverImage", maxCount: 1 }]),
    normalizeMultipartFields,
    createBlog
);

export default router;
