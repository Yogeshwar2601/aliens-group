
import { z } from "zod";

export const siteVisitSchema = z.object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().max(100).optional().default(""),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(7).max(20),
    projectName: z.string().trim().min(1).max(150),
});
