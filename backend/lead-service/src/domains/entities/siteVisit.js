export class SiteVisit {
    constructor({
        firstName,
        lastName = "",
        email,
        phone,
        projectName,
    }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.projectName = projectName;
    }
}
