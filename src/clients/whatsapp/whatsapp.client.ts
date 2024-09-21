import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsAppClient implements OnModuleInit {
  private client: Client | undefined;

  // Inicializar el servicio de WhatsApp al iniciar el módulo
  onModuleInit() {
    this.initializeWhatsApp();
  }

  // Inicializar el cliente de WhatsApp Web
  initializeWhatsApp() {
    try {
      this.client = new Client({
        authStrategy: new LocalAuth(),  // Guarda la sesión para no escanear el QR cada vez
      });

      // Asegúrate de que el cliente se ha creado
      if (!this.client) {
        console.error('El cliente de WhatsApp no se ha inicializado correctamente');
        return;
      }

      // Mostrar el código QR para iniciar sesión en la consola
      this.client.on('qr', (qr) => {
        console.log('Escanea el código QR para iniciar sesión en WhatsApp:');
        qrcode.generate(qr, { small: true });
      });

      // Cliente listo para usar
      this.client.on('ready', () => {
        console.log('WhatsApp Web está listo para enviar mensajes.');
      });

      // Manejar errores de autenticación
      this.client.on('auth_failure', (msg) => {
        console.error('Error de autenticación:', msg);
      });

      // Manejar desconexiones
      this.client.on('disconnected', (reason) => {
        console.log('WhatsApp Web desconectado, razón:', reason);
        this.client?.initialize(); // Reintentar conexión
      });

      this.client.initialize();
    } catch (error) {
      console.error('Error al inicializar WhatsApp Web:', error);
    }
  }

  // Método para enviar mensajes a un número de WhatsApp
  async sendMessage(to: string, message: string) {
    try {
      if (!this.client) {
        console.error('El cliente de WhatsApp no está inicializado');
        return;
      }
      const chatId = `${to.replace('+', '')}@c.us`;

      await this.client.sendMessage(chatId, message);
      console.log(`Mensaje enviado a ${to}`);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }
}
