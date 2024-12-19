import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to, // Dirección del destinatario
        subject, // Asunto del correo
        text: content, // Contenido en texto plano
        html: `<p>${content}</p>`, // Contenido en formato HTML
      });
      console.log('Correo enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo');
    }
  }
}
