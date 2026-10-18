import { z } from "zod";

export const blogSchema = z.object({
    title: z.string().trim().min(1).max(200),
    slug: z.string().trim().min(1).max(220)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    excerpt: z.string().trim().max(600).optional().default(""),
    content: z.string().trim().min(1).max(200000),
    category: z.string().trim().max(100).optional().default(""),
    author: z.string().trim().max(150).optional().default(""),
    tags: z.array(z.string().trim().min(1).max(50)).max(30).optional().default([]),
    coverImage: z.string().max(2000).optional().default(""),
    published: z.boolean().optional().default(true),
    featured: z.boolean().optional().default(false),
    publishedAt: z.string().datetime().optional(),
});

export const blogListQuerySchema = z.object({
    category: z.string().trim().max(100).optional(),
    search: z.string().trim().max(100).optional(),
    featured: z.enum(["true", "false"]).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    offset: z.coerce.number().int().min(0).max(100000).optional().default(0),
});
