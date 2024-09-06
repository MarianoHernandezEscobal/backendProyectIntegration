import { User } from "./user.dto";

export class UserResponseDto {
    id: number;
    firstName: string;
    email: string;
    lastName: string;
    isActive: boolean;
    admin: boolean;

    constructor( user:User) {
        this.firstName = user.firstName;
        this.email = user.email;
        this.lastName = user.lastName;
        this.isActive = user.isActive;
        this.admin = user.admin;
    }
}   