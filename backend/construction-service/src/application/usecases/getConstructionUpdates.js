export class GetConstructionUpdates {
    constructor(constructionUpdateRepository) {
        this.constructionUpdateRepository = constructionUpdateRepository;
    }

    async execute(filters) {
        return this.constructionUpdateRepository.findAll(filters);
    }
}
