import { projectSchema } from "../validators/projectValidator.js";
import { PostgresProjectRepository } from "../../infrastructure/repositories/postgresProjectRepository.js";
import { CreateProject } from "../../application/usecases/createProject.js";
import { GetProjects } from "../../application/usecases/getProjects.js";
import {
    deleteUploadedImages,
    uploadImages,
} from "../../shared/storage/s3Storage.js";

const repository = new PostgresProjectRepository();
const createProjectUseCase = new CreateProject(repository);
const getProjects = new GetProjects(repository);

export async function listProjects(req, res, next) {
    try {
        const { category, featured, status } = req.query;

        const filters = {};

        if (category) {
            const validation = projectSchema.shape.category.safeParse(category);
            if (!validation.success) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid project category",
                });
            }

            filters.category = category;
        }

        if (featured === "true") filters.featured = true;
        if (featured === "false") filters.featured = false;
        if (status !== undefined) {
            if (!["Ongoing", "Upcoming"].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid project status",
                });
            }

            filters.status = status;
        }

        const projects = await getProjects.execute(filters);

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error) {
        next(error);
    }
}

export async function listProjectCategories(req, res, next) {
    try {
        const categories = await repository.findHomepageCategories();

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
}

export async function getProjectBySlug(req, res, next) {
    try {
        const project = await repository.findBySlug(req.params.slug);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
}

export async function createProject(req, res, next) {
    try {
        const validation = projectSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid project details",
                errors: validation.error.flatten().fieldErrors,
            });
        }

        const uploaded = await uploadImages(req.files, "projects");

        try {
            const project = await createProjectUseCase.execute({
                ...validation.data,
                image: uploaded.fields.image?.[0] || validation.data.image,
                gallery: [
                    ...validation.data.gallery,
                    ...(uploaded.fields.gallery || []),
                ],
            });

            res.status(201).json({
                success: true,
                data: project,
            });
        } catch (error) {
            await deleteUploadedImages(uploaded.keys);
            throw error;
        }
    } catch (error) {
        next(error);
    }
}
