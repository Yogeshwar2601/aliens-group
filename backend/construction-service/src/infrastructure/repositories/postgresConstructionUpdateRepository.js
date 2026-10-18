import { IConstructionUpdateRepository } from "../../domains/repositories/IConstructionUpdateRepository.js";
import { getPool } from "../../shared/database/connectDB.js";

const constructionUpdateColumns = `
    id,
    project_slug AS "projectSlug",
    project_name AS "projectName",
    title,
    description,
    milestone,
    progress_percent AS "progressPercent",
    update_date AS "updateDate",
    image_url AS "imageUrl",
    gallery,
    video_url AS "videoUrl",
    published,
    created_at AS "createdAt",
    updated_at AS "updatedAt"`;

function buildGalleryConditions(filters) {
    const values = [filters.projectSlug];
    const conditions = ["published = TRUE", "project_slug = $1"];

    if (filters.year) {
        values.push(filters.year);
        conditions.push(`EXTRACT(YEAR FROM update_date) = $${values.length}`);
    }
    if (filters.month) {
        values.push(filters.month);
        conditions.push(`EXTRACT(MONTH FROM update_date) = $${values.length}`);
    }

    return { values, conditions };
}

export class PostgresConstructionUpdateRepository
    extends IConstructionUpdateRepository {
    async create(update) {
        const result = await getPool().query(
            `INSERT INTO construction_updates (
                project_slug, project_name, title, description, milestone,
                progress_percent, update_date, image_url, gallery, video_url,
                published
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, COALESCE($7::date, CURRENT_DATE),
                $8, $9, $10, $11
            )
            RETURNING ${constructionUpdateColumns}`,
            [
                update.projectSlug || null,
                update.projectName,
                update.title,
                update.description,
                update.milestone,
                update.progressPercent,
                update.updateDate || null,
                update.imageUrl,
                update.gallery,
                update.videoUrl,
                update.published,
            ]
        );

        return result.rows[0];
    }

    async findAll(filters = {}) {
        const values = [];
        const conditions = ["published = TRUE"];

        if (filters.projectSlug) {
            values.push(filters.projectSlug);
            conditions.push(`project_slug = $${values.length}`);
        }

        values.push(filters.limit || 20);
        const limitParameter = values.length;
        values.push(filters.offset || 0);
        const offsetParameter = values.length;

        const result = await getPool().query(
            `SELECT ${constructionUpdateColumns}
            FROM construction_updates
            WHERE ${conditions.join(" AND ")}
            ORDER BY update_date DESC, id DESC
            LIMIT $${limitParameter} OFFSET $${offsetParameter}`,
            values
        );

        return result.rows;
    }

    async findGalleryMedia(filters) {
        const { values, conditions } = buildGalleryConditions(filters);
        const mediaQuery = filters.mediaType === "video"
            ? `SELECT id, title, milestone, update_date AS "updateDate", project_name AS "projectName",
                    'video'::text AS "mediaType", video_url AS "mediaUrl"
                FROM construction_updates
                WHERE ${conditions.join(" AND ")} AND video_url <> ''`
            : `SELECT id, title, milestone, update_date AS "updateDate", project_name AS "projectName",
                    'photo'::text AS "mediaType", image_url AS "mediaUrl"
                FROM construction_updates
                WHERE ${conditions.join(" AND ")} AND image_url <> ''
                UNION ALL
                SELECT cu.id, cu.title, cu.milestone, cu.update_date AS "updateDate",
                    cu.project_name AS "projectName", 'photo'::text AS "mediaType",
                    media.url AS "mediaUrl"
                FROM construction_updates cu
                CROSS JOIN LATERAL unnest(cu.gallery) WITH ORDINALITY AS media(url, position)
                WHERE ${conditions.map((condition) => condition.replaceAll(
                    "project_slug",
                    "cu.project_slug"
                ).replaceAll(
                    "published = TRUE",
                    "cu.published = TRUE"
                ).replaceAll(
                    "update_date",
                    "cu.update_date"
                )).join(" AND ")} AND media.url <> ''`;

        values.push(filters.limit);
        const limitParameter = values.length;
        values.push(filters.offset);
        const offsetParameter = values.length;

        const result = await getPool().query(
            `SELECT * FROM (${mediaQuery}) AS construction_media
            ORDER BY "updateDate" DESC, id DESC, "mediaUrl"
            LIMIT $${limitParameter} OFFSET $${offsetParameter}`,
            values
        );

        return result.rows;
    }

    async countGalleryMedia(filters) {
        const { values, conditions } = buildGalleryConditions(filters);
        const mediaQuery = filters.mediaType === "video"
            ? `SELECT id
                FROM construction_updates
                WHERE ${conditions.join(" AND ")} AND video_url <> ''`
            : `SELECT id
                FROM construction_updates
                WHERE ${conditions.join(" AND ")} AND image_url <> ''
                UNION ALL
                SELECT cu.id
                FROM construction_updates cu
                CROSS JOIN LATERAL unnest(cu.gallery) AS media(url)
                WHERE ${conditions.map((condition) => condition.replaceAll(
                    "project_slug",
                    "cu.project_slug"
                ).replaceAll(
                    "published = TRUE",
                    "cu.published = TRUE"
                ).replaceAll(
                    "update_date",
                    "cu.update_date"
                )).join(" AND ")} AND media.url <> ''`;
        const result = await getPool().query(
            `SELECT COUNT(*)::integer AS total FROM (${mediaQuery}) AS construction_media`,
            values
        );

        return result.rows[0].total;
    }

    async findGalleryYears(projectSlug) {
        const result = await getPool().query(
            `SELECT DISTINCT EXTRACT(YEAR FROM update_date)::integer AS year
            FROM construction_updates
            WHERE published = TRUE
                AND project_slug = $1
                AND (image_url <> '' OR cardinality(gallery) > 0 OR video_url <> '')
            ORDER BY year DESC`,
            [projectSlug]
        );

        return result.rows.map(({ year }) => year);
    }

    async findById(id) {
        const result = await getPool().query(
            `SELECT ${constructionUpdateColumns}
            FROM construction_updates
            WHERE id = $1 AND published = TRUE
            LIMIT 1`,
            [id]
        );

        return result.rows[0] || null;
    }
}
