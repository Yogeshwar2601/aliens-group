
import { IProjectRepository } from "../../domains/repositories/IProjectRepository.js";
import { HOMEPAGE_PROJECT_CATEGORIES } from "../../domains/entities/projectCategories.js";
import { getPool } from "../../shared/database/connectDB.js";

const projectColumns = `
    id AS "_id",
    name,
    slug,
    category,
    location,
    status,
    description,
    area_range AS "areaRange",
    community_type AS "communityType",
    highlights,
    unit_types AS "unitTypes",
    design_features AS "designFeatures",
    growth_axis AS "growthAxis",
    layouts,
    amenity_details AS "amenityDetails",
    nearby_places AS "nearbyPlaces",
    map_url AS "mapUrl",
    image,
    gallery,
    brochure_url AS "brochureUrl",
    amenities,
    featured,
    published,
    created_at AS "createdAt",
    updated_at AS "updatedAt"`;

export class PostgresProjectRepository extends IProjectRepository {
    async create(project) {
        const result = await getPool().query(
            `INSERT INTO projects (
                name, slug, category, location, status, description, area_range,
                community_type, highlights, unit_types, design_features,
                growth_axis, layouts, amenity_details,
                nearby_places, map_url, image, gallery, brochure_url, amenities,
                featured, published
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb,
                $11::jsonb, $12::jsonb, $13::jsonb, $14, $15::jsonb,
                $16::jsonb, $17, $18, $19, $20, $21, $22
            )
            RETURNING ${projectColumns}`,
            [
                project.name,
                project.slug,
                project.category,
                project.location,
                project.status || "Ongoing",
                project.description || "",
                project.areaRange || "",
                project.communityType || "",
                JSON.stringify(project.highlights || []),
                JSON.stringify(project.unitTypes || []),
                JSON.stringify(project.designFeatures || []),
                JSON.stringify(project.growthAxis || []),
                project.layouts || [],
                JSON.stringify(project.amenityDetails || []),
                JSON.stringify(project.nearbyPlaces || []),
                project.mapUrl || "",
                project.image || "",
                project.gallery || [],
                project.brochureUrl || "",
                project.amenities || [],
                project.featured || false,
                project.published ?? true,
            ]
        );

        return result.rows[0];
    }

    async findAll(filters = {}) {
        const values = [];
        const conditions = ["published = TRUE"];

        if (filters.category) {
            values.push(filters.category);
            conditions.push(`category = $${values.length}`);
        }
        if (filters.featured !== undefined) {
            values.push(filters.featured);
            conditions.push(`featured = $${values.length}`);
        }
        if (filters.status) {
            values.push(filters.status);
            conditions.push(`status = $${values.length}`);
        }

        const result = await getPool().query(
            `SELECT ${projectColumns}
            FROM projects
            WHERE ${conditions.join(" AND ")}
            ORDER BY created_at DESC`,
            values
        );

        return result.rows;
    }

    async findHomepageCategories() {
        const result = await getPool().query(
            `SELECT category, COUNT(*)::integer AS count
            FROM projects
            WHERE published = TRUE AND category = ANY($1::text[])
            GROUP BY category`,
            [HOMEPAGE_PROJECT_CATEGORIES]
        );
        const counts = new Map(
            result.rows.map(({ category, count }) => [category, count])
        );

        return HOMEPAGE_PROJECT_CATEGORIES.map((name) => ({
            name,
            count: counts.get(name) || 0,
        }));
    }

    async findBySlug(slug) {
        const result = await getPool().query(
            `SELECT ${projectColumns}
            FROM projects
            WHERE slug = $1 AND published = TRUE
            LIMIT 1`,
            [slug]
        );

        return result.rows[0] || null;
    }
}
