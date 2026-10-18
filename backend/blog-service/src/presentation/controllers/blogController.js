import { CreateBlog } from "../../application/usecases/createBlog.js";
import { GetBlogs } from "../../application/usecases/getBlogs.js";
import { PostgresBlogRepository } from "../../infrastructure/repositories/postgresBlogRepository.js";
import {
    deleteUploadedImages,
    uploadImages,
} from "../../shared/storage/s3Storage.js";
import {
    blogListQuerySchema,
    blogSchema,
} from "../validators/blogValidator.js";

const repository = new PostgresBlogRepository();
const createBlogUseCase = new CreateBlog(repository);
const getBlogsUseCase = new GetBlogs(repository);

export async function listBlogs(req, res, next) {
    try {
        const validation = blogListQuerySchema.safeParse(req.query);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog filters",
                errors: validation.error.flatten().fieldErrors,
            });
        }

        const { featured, ...filters } = validation.data;
        if (featured !== undefined) filters.featured = featured === "true";

        const blogs = await getBlogsUseCase.execute(filters);

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs,
        });
    } catch (error) {
        next(error);
    }
}

export async function getBlogBySlug(req, res, next) {
    try {
        const blog = await repository.findBySlug(req.params.slug);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        next(error);
    }
}

export async function createBlog(req, res, next) {
    try {
        const validation = blogSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog details",
                errors: validation.error.flatten().fieldErrors,
            });
        }

        const uploaded = await uploadImages(req.files, "blogs");

        try {
            const blog = await createBlogUseCase.execute({
                ...validation.data,
                coverImage:
                    uploaded.fields.coverImage?.[0] ||
                    validation.data.coverImage,
            });

            res.status(201).json({
                success: true,
                data: blog,
            });
        } catch (error) {
            await deleteUploadedImages(uploaded.keys);
            throw error;
        }
    } catch (error) {
        next(error);
    }
}
