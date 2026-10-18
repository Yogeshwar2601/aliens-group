import { Enquiry } from "../../domains/entities/enquiry.js";

export class CreateEnquiry {
    constructor(enquiryRepository) {
        this.enquiryRepository = enquiryRepository;
    }

    async execute(data) {
        const enquiry = new Enquiry(data);
        return this.enquiryRepository.create(enquiry);
    }
}
