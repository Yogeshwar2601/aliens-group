import { z } from "zod";
import { PROJECT_CATEGORIES } from "../../domains/entities/projectCategories.js";

export const projectSchema = z.object({
    name: z.string().trim().min(1).max(150),
    slug: z.string().trim().min(1).max(160)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.enum(PROJECT_CATEGORIES),
    location: z.string().trim().min(1).max(200),
    status: z.enum(["Ongoing", "Upcoming"]).optional().default("Ongoing"),
    description: z.string().max(5000).optional().default(""),
    areaRange: z.string().max(150).optional().default(""),
    communityType: z.string().trim().max(150).optional().default(""),
    highlights: z.array(z.object({
        label: z.string().trim().max(100),
        value: z.string().trim().max(150),
    })).optional().default([]),
    unitTypes: z.array(z.object({
        name: z.string().trim().max(100),
        area: z.string().trim().max(100),
    })).optional().default([]),
    designFeatures: z.array(z.object({
        name: z.string().trim().max(150),
        description: z.string().trim().max(1000),
    })).optional().default([]),
    growthAxis: z.array(z.object({
        name: z.string().trim().max(150),
        distance: z.string().trim().max(100),
    })).optional().default([]),
    layouts: z.array(z.string().trim().max(150)).optional().default([]),
    amenityDetails: z.array(z.object({
        name: z.string().trim().max(150),
        description: z.string().trim().max(1000),
    })).optional().default([]),
    nearbyPlaces: z.array(z.object({
        name: z.string().trim().max(150),
        distance: z.string().trim().max(100),
    })).optional().default([]),
    mapUrl: z.string().max(1000).optional().default(""),
    image: z.string().max(1000).optional().default(""),
    gallery: z.array(z.string().max(1000)).optional().default([]),
    brochureUrl: z.string().max(1000).optional().default(""),
    amenities: z.array(z.string().max(100)).optional().default([]),
    featured: z.boolean().optional().default(false),
    published: z.boolean().optional().default(true),
});
