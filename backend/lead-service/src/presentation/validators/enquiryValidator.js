import { z } from "zod";

export const enquirySchema = z.object({
    firstName: z.string().trim().min(1, "First name is required").max(100),
    lastName: z.string().trim().max(100).optional().default(""),
    email: z.string().trim().email("Invalid email address").max(254),
    phone: z.string().trim().min(7, "Invalid phone number").max(20),
    propertyType: z.string().trim().max(100).optional().default(""),
    message: z.string().trim().max(2000).optional().default(""),
    source: z.enum(["contact", "enquire", "site-visit", "reach-us"]).optional().default("contact"),
});
