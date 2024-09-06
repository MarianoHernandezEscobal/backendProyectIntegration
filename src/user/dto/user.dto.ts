

export class User {
    id: number;
    firstName: string;
    email: string;
    password: string;
    lastName: string;
    isActive: boolean;
    admin: boolean;

    constructor(firstName: string, email: string, password: string, lastName: string, isActive: boolean) {
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        this.lastName = lastName;
        this.isActive = isActive;
    }
}