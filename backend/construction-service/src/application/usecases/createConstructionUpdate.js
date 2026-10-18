import { ConstructionUpdate } from "../../domains/entities/constructionUpdate.js";

export class CreateConstructionUpdate {
    constructor(constructionUpdateRepository) {
        this.constructionUpdateRepository = constructionUpdateRepository;
    }

    async execute(data) {
        return this.constructionUpdateRepository.create(
            new ConstructionUpdate(data)
        );
    }
}
