import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDto } from '@src/property/dto/mail.dto';
import { UserResponseDto } from '@src/user/dto/user.response.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(body: SendMailDto, userRequest?: UserResponseDto): Promise<void> {
    try {
      const html = `<b>Nombre:</b> ${userRequest.firstName}<br/>
             <b>Email:</b> ${userRequest ? userRequest.email : body.from}<br/>
             <b>Mensaje:</b> ${body.content}`;
      const bodyRequest = {
        from: userRequest ? `${userRequest.firstName} ${userRequest.lastName} <${userRequest.email}>` : body.from,
        subject: body.subject,
        text: body.content,
        html,
        content: body.content,
      }
      await this.mailerService.sendMail(bodyRequest);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo');
    }
  }
}
