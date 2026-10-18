export class Blog {
    constructor({
        title,
        slug,
        excerpt = "",
        content,
        category = "",
        author = "",
        tags = [],
        coverImage = "",
        published = true,
        featured = false,
        publishedAt,
    }) {
        this.title = title;
        this.slug = slug;
        this.excerpt = excerpt;
        this.content = content;
        this.category = category;
        this.author = author;
        this.tags = tags;
        this.coverImage = coverImage;
        this.published = published;
        this.featured = featured;
        this.publishedAt = publishedAt;
    }
}
