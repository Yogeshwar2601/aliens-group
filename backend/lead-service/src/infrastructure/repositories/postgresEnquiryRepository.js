import { IEnquiryRepository } from "../../domains/repositories/IEnquiryRepository.js";
import { getPool } from "../../shared/database/connectDB.js";

export class PostgresEnquiryRepository extends IEnquiryRepository {
    async create(enquiry) {
        const result = await getPool().query(
            `INSERT INTO enquiries (
                first_name, last_name, email, phone, property_type, message, source
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING
                id AS "_id",
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                phone,
                property_type AS "propertyType",
                message,
                source,
                created_at AS "createdAt",
                updated_at AS "updatedAt"`,
            [
                enquiry.firstName,
                enquiry.lastName || "",
                enquiry.email.toLowerCase(),
                enquiry.phone,
                enquiry.propertyType || "",
                enquiry.message || "",
                enquiry.source || "contact",
            ]
        );

        return result.rows[0];
    }
}
