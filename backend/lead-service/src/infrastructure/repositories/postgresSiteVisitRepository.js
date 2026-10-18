import { ISiteVisitRepository } from "../../domains/repositories/ISiteVisitRepository.js";
import { getPool } from "../../shared/database/connectDB.js";

export class PostgresSiteVisitRepository extends ISiteVisitRepository {
    async create(siteVisit) {
        const result = await getPool().query(
            `INSERT INTO site_visits (
                first_name, last_name, email, phone, project_name
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id AS "_id",
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                phone,
                project_name AS "projectName",
                created_at AS "createdAt",
                updated_at AS "updatedAt"`,
            [
                siteVisit.firstName,
                siteVisit.lastName || "",
                siteVisit.email.toLowerCase(),
                siteVisit.phone,
                siteVisit.projectName,
            ]
        );

        return result.rows[0];
    }
}
