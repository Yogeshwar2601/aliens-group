export class GetBlogs {
    constructor(blogRepository) {
        this.blogRepository = blogRepository;
    }

    async execute(filters) {
        return this.blogRepository.findAll(filters);
    }
}
