import { Blog } from "../../domains/entities/blog.js";

export class CreateBlog {
    constructor(blogRepository) {
        this.blogRepository = blogRepository;
    }

    async execute(data) {
        return this.blogRepository.create(new Blog(data));
    }
}
