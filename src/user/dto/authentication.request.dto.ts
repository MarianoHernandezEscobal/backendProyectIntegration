import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationRequestDto {
    @ApiProperty({ description: 'Correo electrónico del usuario', example: 'user@example.com' })
    email: string;

    @ApiProperty({ description: 'Contraseña del usuario', example: 'password123', writeOnly: true })
    password: string;
}