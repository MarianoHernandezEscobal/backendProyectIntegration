import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const clientId = config.get<string>('GMAIL_CLIENT_ID')
        const oAuth2Client = new google.auth.OAuth2(
            clientId,
          config.get<string>('GMAIL_CLIENT_SECRET'),
          config.get<string>('GMAIL_REDIRECT_URI')
        );

        oAuth2Client.setCredentials({
          refresh_token: config.get<string>('GMAIL_REFRESH_TOKEN'),
        });

        const accessToken = await oAuth2Client.getAccessToken();

        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              type: 'OAuth2',
              user: config.get<string>('GMAIL_USER'),
              clientId: config.get<string>('GMAIL_CLIENT_ID'),
              clientSecret: config.get<string>('GMAIL_CLIENT_SECRET'),
              refreshToken: config.get<string>('GMAIL_REFRESH_TOKEN'),
              accessToken: accessToken.token,
            },
          },
          defaults: {
            from: `"No Reply" <${config.get<string>('GMAIL_USER')}>`, // Remitente predeterminado
          },
        };
      },
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
