import { ApiProperty } from "@nestjs/swagger";
import { PropertyPlpDto } from "./property.plp.dto";

export class Home{
    @ApiProperty({ type: [PropertyPlpDto], description: 'Propiedades en alquiler' })
    rent: PropertyPlpDto[];
  
    @ApiProperty({ type: [PropertyPlpDto], description: 'Propiedades en venta' })
    sale: PropertyPlpDto[];
  
    @ApiProperty({ type: [PropertyPlpDto], description: 'Propiedades pineadas' })
    pined: PropertyPlpDto[];
}