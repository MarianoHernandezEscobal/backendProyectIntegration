import { PropertyEntity } from "@databaseProperties/property.entity";
import { PropertyStatus } from "../enums/status.enum";
import { PropertyTypes } from "../enums/types.enum";

export class PropertyPlpDto {
    id: number;
    title: string;
    description: string;
    price: number;
    type: PropertyTypes;
    status: PropertyStatus[];
    image: string[];

    constructor(property: PropertyEntity) {
        this.id = property.id;
        this.title = property.title;
        this.description = property.description;
        this.price = property.price;
        this.type = property.type;
        this.status = property?.status || [];
        this.image = property?.image || [];
    }
}