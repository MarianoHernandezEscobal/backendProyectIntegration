import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationResponseDto {
    @ApiProperty({ description: 'Token de acceso JWT', example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    access_token: string;

    constructor(access_token: string) {
        this.access_token = access_token;
    }
}