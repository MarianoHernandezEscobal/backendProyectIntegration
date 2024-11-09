import { Module } from '@nestjs/common';
import { FacebookClient } from './facebook/facebook.client';
import { HttpModule } from '@nestjs/axios';
import { WhatsAppClient } from './whatsapp/whatsapp.client';


@Module({
  imports: [ 
    HttpModule.register({
        timeout: 15000,
        maxRedirects: 5
    })
],
  providers: [FacebookClient, WhatsAppClient ],//
  exports: [FacebookClient, WhatsAppClient ],//WhatsAppClient
})
export class ClientsModule {}
