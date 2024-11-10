import { Module } from '@nestjs/common';
import { FacebookClient } from './facebook/facebook.client';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [ 
    HttpModule.register({
        timeout: 15000,
        maxRedirects: 5
    })
],
  providers: [FacebookClient,  ],//
  exports: [FacebookClient,  ],//WhatsAppClient
})
export class ClientsModule {}
