
export class Enquiry {
    constructor({
        firstName,
        lastName,
        email,
        phone,
        propertyType,
        message,
        source = "contact",
    }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.propertyType = propertyType;
        this.message = message;
        this.source = source;
    }
}
