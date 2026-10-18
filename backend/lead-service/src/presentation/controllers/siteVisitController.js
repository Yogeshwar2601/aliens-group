import { siteVisitSchema } from "../validators/siteVisitValidator.js";
import { PostgresSiteVisitRepository } from "../../infrastructure/repositories/postgresSiteVisitRepository.js";
import { CreateSiteVisit } from "../../application/usecases/createSiteVisit.js";

const repository = new PostgresSiteVisitRepository();
const createSiteVisit = new CreateSiteVisit(repository);

export async function submitSiteVisit(req, res, next) {
    try {
        const validation = siteVisitSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid site visit details",
                errors: validation.error.flatten().fieldErrors,
            });
        }

        await createSiteVisit.execute(validation.data);

        return res.status(201).json({
            success: true,
            message: "Your site visit request has been submitted successfully",
        });
    } catch (error) {
        next(error);
    }
}
