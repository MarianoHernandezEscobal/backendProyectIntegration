import { ApiProperty } from '@nestjs/swagger';
import { PropertyDto } from '@src/property/dto/property.dto';
import { RentDTO } from '@src/rent/dto/rent.dto';

export class User {
    @ApiProperty({ description: 'ID del usuario', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nombre del usuario', example: 'John' })
    firstName: string;

    @ApiProperty({ description: 'Correo electrónico del usuario', example: 'john@example.com' })
    email: string;

    @ApiProperty({ description: 'Contraseña del usuario', example: 'password123', writeOnly: true })
    password: string;

    @ApiProperty({ description: 'Telefono del usuario', example: '95376123' })
    phone: string;

    @ApiProperty({ description: 'Apellido del usuario', example: 'Doe' })
    lastName: string;

    @ApiProperty({ description: 'Indica si el usuario está activo', example: true })
    isActive: boolean;

    @ApiProperty({ description: 'Indica si el usuario es administrador', example: false })
    admin: boolean;

    constructor(firstName: string, email: string, password: string, lastName: string, isActive: boolean, phone: string) {
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        this.lastName = lastName;
        this.isActive = isActive;
        this.phone = User.formatPhoneNumber(phone);
    }

    static formatPhoneNumber(phone: string): string {
        phone = phone.replace(/[\s\-\(\)]/g, '');
        if (phone.startsWith('+5980')) {
          phone = phone.replace('+5980', '');
        }
        if (phone.startsWith('0')) {
          phone = phone.substring(1);
        }
        if (!phone.startsWith('+598')) {
          phone = '+598' + phone;
        }
        return phone;
      }
   
}


