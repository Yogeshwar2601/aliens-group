import { enquirySchema } from "../validators/enquiryValidator.js";
import { PostgresEnquiryRepository } from "../../infrastructure/repositories/postgresEnquiryRepository.js";
import { CreateEnquiry } from "../../application/usecases/createEnquiry.js";

const repository = new PostgresEnquiryRepository();
const createEnquiry = new CreateEnquiry(repository);

export async function submitEnquiry(req, res, next) {
    try {
        const validation = enquirySchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid enquiry details",
                errors: validation.error.flatten().fieldErrors,
            });
        }

        await createEnquiry.execute(validation.data);

        return res.status(201).json({
            success: true,
            message: "Your enquiry has been submitted successfully",
        });
    } catch (error) {
        next(error);
    }
}
