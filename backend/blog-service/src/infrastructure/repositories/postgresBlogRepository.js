import { IBlogRepository } from "../../domains/repositories/IBlogRepository.js";
import { getPool } from "../../shared/database/connectDB.js";

const blogColumns = `
    id,
    title,
    slug,
    excerpt,
    content,
    category,
    author,
    tags,
    cover_image AS "coverImage",
    published,
    featured,
    published_at AS "publishedAt",
    created_at AS "createdAt",
    updated_at AS "updatedAt"`;

export class PostgresBlogRepository extends IBlogRepository {
    async create(blog) {
        const result = await getPool().query(
            `INSERT INTO blogs (
                title, slug, excerpt, content, category, author, tags,
                cover_image, published, featured, published_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, COALESCE($11, NOW()))
            RETURNING ${blogColumns}`,
            [
                blog.title,
                blog.slug,
                blog.excerpt,
                blog.content,
                blog.category,
                blog.author,
                blog.tags,
                blog.coverImage,
                blog.published,
                blog.featured,
                blog.publishedAt || null,
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
        if (filters.search) {
            values.push(`%${filters.search}%`);
            conditions.push(
                `(title ILIKE $${values.length} OR excerpt ILIKE $${values.length} OR content ILIKE $${values.length})`
            );
        }

        values.push(filters.limit || 20);
        const limitParameter = values.length;
        values.push(filters.offset || 0);
        const offsetParameter = values.length;

        const result = await getPool().query(
            `SELECT ${blogColumns}
            FROM blogs
            WHERE ${conditions.join(" AND ")}
            ORDER BY published_at DESC, id DESC
            LIMIT $${limitParameter} OFFSET $${offsetParameter}`,
            values
        );

        return result.rows;
    }

    async findBySlug(slug) {
        const result = await getPool().query(
            `SELECT ${blogColumns}
            FROM blogs
            WHERE slug = $1 AND published = TRUE
            LIMIT 1`,
            [slug]
        );

        return result.rows[0] || null;
    }
}
