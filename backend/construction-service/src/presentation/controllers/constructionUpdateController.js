import { CreateConstructionUpdate } from "../../application/usecases/createConstructionUpdate.js";
import { GetConstructionUpdates } from "../../application/usecases/getConstructionUpdates.js";
import { PostgresConstructionUpdateRepository } from "../../infrastructure/repositories/postgresConstructionUpdateRepository.js";
import {
    deleteUploadedImages,
    uploadConstructionMedia,
} from "../../shared/storage/s3Storage.js";
import {
    constructionGalleryQuerySchema,
    constructionUpdateListQuerySchema,
    constructionUpdateSchema,
} from "../validators/constructionUpdateValidator.js";

const repository = new PostgresConstructionUpdateRepository();
const createUpdateUseCase = new CreateConstructionUpdate(repository);
const getUpdatesUseCase = new GetConstructionUpdates(repository);

export async function listConstructionUpdates(req, res, next) {
    try {
        const validation = constructionUpdateListQuerySchema.safeParse(req.query);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid construction update filters",
                errors: validation.error.flatten().fieldErrors,
            });
        }

        const updates = await getUpdatesUseCase.execute(validation.data);

        res.status(200).json({
            success: true,
            count: updates.length,
            data: updates,
        });
    } catch (error) {
        next(error);
    }
}

export async function listConstructionGallery(req, res, next) {
    try {
        const validation = constructionGalleryQuerySchema.safeParse(req.query);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid construction gallery filters",
                errors: validation.error.flatten().fieldErrors,
            });
        }

        const filters = validation.data;
        const [data, total, years] = await Promise.all([
            repository.findGalleryMedia(filters),
            repository.countGalleryMedia(filters),
            repository.findGalleryYears(filters.projectSlug),
        ]);

        res.status(200).json({
            success: true,
            count: data.length,
            total,
            years,
            data,
        });
    } catch (error) {
        next(error);
    }
}

export async function getConstructionUpdateById(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid construction update ID",
            });
        }

        const update = await repository.findById(id);

        if (!update) {
            return res.status(404).json({
                success: false,
                message: "Construction update not found",
            });
        }

        res.status(200).json({ success: true, data: update });
    } catch (error) {
        next(error);
    }
}

export async function createConstructionUpdate(req, res, next) {
    try {
        const validation = constructionUpdateSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid construction update details",
                errors: validation.error.flatten().fieldErrors,
            });
        }

        const uploaded = await uploadConstructionMedia(req.files);

        try {
            const update = await createUpdateUseCase.execute({
                ...validation.data,
                imageUrl:
                    uploaded.fields.image?.[0] || validation.data.imageUrl,
                gallery: [
                    ...validation.data.gallery,
                    ...(uploaded.fields.gallery || []),
                ],
                videoUrl:
                    uploaded.fields.video?.[0] || validation.data.videoUrl,
            });

            res.status(201).json({
                success: true,
                data: update,
            });
        } catch (error) {
            await deleteUploadedImages(uploaded.keys);
            throw error;
        }
    } catch (error) {
        next(error);
    }
}
