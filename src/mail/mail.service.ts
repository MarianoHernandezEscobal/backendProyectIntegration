import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text: content,
        html: `<p>${content}</p>`,
      });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo');
    }
  }
}
