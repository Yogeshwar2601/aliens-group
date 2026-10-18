import { z } from "zod";

export const constructionUpdateSchema = z.object({
    projectSlug: z.string().trim().max(160).optional().default(""),
    projectName: z.string().trim().min(1).max(150),
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(10000).optional().default(""),
    milestone: z.string().trim().max(150).optional().default(""),
    progressPercent: z.number().int().min(0).max(100).nullable().optional().default(null),
    updateDate: z.iso.date().optional(),
    imageUrl: z.string().max(2000).optional().default(""),
    gallery: z.array(z.string().max(2000)).max(100).optional().default([]),
    videoUrl: z.string().max(2000).optional().default(""),
    published: z.boolean().optional().default(true),
});

export const constructionUpdateListQuerySchema = z.object({
    projectSlug: z.string().trim().max(160).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    offset: z.coerce.number().int().min(0).max(100000).optional().default(0),
});

export const constructionGalleryQuerySchema = z.object({
    projectSlug: z.string().trim().min(1).max(160),
    mediaType: z.enum(["photo", "video"]).optional().default("photo"),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().default(9),
    offset: z.coerce.number().int().min(0).max(100000).optional().default(0),
});
