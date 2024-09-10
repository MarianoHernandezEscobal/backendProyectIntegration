import { ApiProperty } from "@nestjs/swagger";

export class GeoCoordinatesDto {
    @ApiProperty({ description: 'Latitud de la propiedad', example: -34.603722 })
    lat: number;

    @ApiProperty({ description: 'Longitud de la propiedad', example: -58.381592 })
    lng: number;
}