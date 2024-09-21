import { PropertyEntity } from "@databaseProperties/property.entity";

export class CreatePost {
    message: string;
    link: string;
    access_token: string;
    published: boolean;

    constructor(property: PropertyEntity){
        const { URL_INMO, FACEBOOK_ACCESSTOKEN } = process.env;
        this.message = `${property.title}\n${property.description}`;
        this.link = `${URL_INMO}${property.id}`;
        this.access_token = FACEBOOK_ACCESSTOKEN;
        this.published = property.approved;

    }
}