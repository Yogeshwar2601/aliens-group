import { SiteVisit } from "../../domains/entities/siteVisit.js";

export class CreateSiteVisit {
    constructor(siteVisitRepository) {
        this.siteVisitRepository = siteVisitRepository;
    }

    async execute(data) {
        const siteVisit = new SiteVisit(data);
        return this.siteVisitRepository.create(siteVisit);
    }
}
