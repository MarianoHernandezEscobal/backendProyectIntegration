import { ApiProperty } from '@nestjs/swagger';

export class User {
    @ApiProperty({ description: 'ID del usuario', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nombre del usuario', example: 'John' })
    firstName: string;

    @ApiProperty({ description: 'Correo electrónico del usuario', example: 'john@example.com' })
    email: string;

    @ApiProperty({ description: 'Contraseña del usuario', example: 'password123', writeOnly: true })
    password: string;

    @ApiProperty({ description: 'Apellido del usuario', example: 'Doe' })
    lastName: string;

    @ApiProperty({ description: 'Indica si el usuario está activo', example: true })
    isActive: boolean;

    @ApiProperty({ description: 'Indica si el usuario es administrador', example: false })
    admin: boolean;

    constructor(firstName: string, email: string, password: string, lastName: string, isActive: boolean) {
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        this.lastName = lastName;
        this.isActive = isActive;
    }
}