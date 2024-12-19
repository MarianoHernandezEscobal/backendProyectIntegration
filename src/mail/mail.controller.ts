import { Controller, Post, Body } from "@nestjs/common";
import { SendMailDto } from "@src/property/dto/mail.dto";
import { MailService } from "./mail.service";

  @Controller('mail')
  export class MailController {
    constructor(
      private readonly mailService: MailService
    ) {}

    @Post('send')
    async sendEmail(@Body() body: SendMailDto) {
      const { to, subject, content } = body;
  
      await this.mailService.sendEmail(to, subject, content);
  
      return { message: 'Correo enviado con éxito' };
    }
  }
  