import { Project } from "../../domains/entities/project.js";

export class CreateProject {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(data) {
        const project = new Project(data);
        return this.projectRepository.create(project);
    }
}
