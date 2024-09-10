import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.dto';

export class UserResponseDto {
    @ApiProperty({ description: 'ID del usuario', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nombre del usuario', example: 'John' })
    firstName: string;

    @ApiProperty({ description: 'Correo electrónico del usuario', example: 'john@example.com' })
    email: string;

    @ApiProperty({ description: 'Apellido del usuario', example: 'Doe' })
    lastName: string;

    @ApiProperty({ description: 'Indica si el usuario está activo', example: true })
    isActive: boolean;

    @ApiProperty({ description: 'Indica si el usuario es administrador', example: false })
    admin: boolean;

    constructor(user: User) {
        this.firstName = user.firstName;
        this.email = user.email;
        this.lastName = user.lastName;
        this.isActive = user.isActive;
        this.admin = user.admin;
    }
}
