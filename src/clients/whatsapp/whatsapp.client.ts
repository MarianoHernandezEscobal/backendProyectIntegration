import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsAppClient implements OnModuleInit {
  private client: Client | undefined;

  // Inicializar WhatsApp al cargar el módulo
  async onModuleInit() {
    console.log('📢 Inicializando WhatsApp Web...');
    await this.initializeWhatsApp();
  }

  // Configurar e inicializar el cliente de WhatsApp Web
  private async initializeWhatsApp() {
    try {
      this.client = new Client({
        authStrategy: new LocalAuth(), // Guarda la sesión en el servidor
        puppeteer: {
          executablePath: '/usr/bin/chromium-browser',
          headless: true, // Modo sin interfaz gráfica
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-software-rasterizer',
            '--disable-extensions',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-accelerated-2d-canvas',
            '--single-process',
            '--no-zygote'
          ],
        }
      });

      if (!this.client) {
        console.error('❌ Error: Cliente de WhatsApp no inicializado');
        return;
      }

      // Mostrar QR para escanear en consola
      this.client.on('qr', (qr) => {
        console.log('📸 Escanea este código QR para iniciar sesión en WhatsApp:');
        qrcode.generate(qr, { small: true });
      });

      // Cliente listo
      this.client.on('ready', () => {
        console.log('✅ WhatsApp Web está listo para enviar mensajes.');
      });

      // Manejar errores de autenticación
      this.client.on('auth_failure', (msg) => {
        console.error('⚠️ Error de autenticación:', msg);
      });

      // Manejar desconexión y reintentar conexión
      this.client.on('disconnected', (reason) => {
        console.warn('🔌 WhatsApp Web desconectado. Razón:', reason);
        console.log('🔄 Intentando reconectar...');
        this.client?.initialize();
      });

      // Inicializar cliente
      await this.client.initialize();
    } catch (error) {
      console.error('❌ Error al inicializar WhatsApp Web:', error);
    }
  }

  // Método para enviar mensajes
  async sendMessage(to: string, message: string) {
    try {
      if (!this.client) {
        console.error('❌ Cliente de WhatsApp no está inicializado');
        return;
      }
      const chatId = `${to.replace('+', '')}@c.us`;

      await this.client.sendMessage(chatId, message);
      console.log(`📩 Mensaje enviado a ${to}: ${message}`);
    } catch (error) {
      console.error('❌ Error al enviar el mensaje:', error);
    }
  }
}
