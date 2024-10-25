import { Module } from '@nestjs/common';
import { FacebookClient } from './facebook/facebook.client';
import { HttpModule } from '@nestjs/axios';
import { MercadoLibreClient } from './mercadoLibre/mercadoLibre.client';
import { WhatsAppClient } from './whatsapp/whatsapp.client';


@Module({
  imports: [ 
    HttpModule.register({
        timeout: 15000,
        maxRedirects: 5
    })
],
  providers: [FacebookClient, MercadoLibreClient ],//WhatsAppClient
  exports: [FacebookClient, MercadoLibreClient ],//WhatsAppClient
})
export class ClientsModule {}
