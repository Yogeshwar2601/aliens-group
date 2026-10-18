export class GetProjects {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }

    async execute(filters) {
        return this.projectRepository.findAll(filters);
    }
}
