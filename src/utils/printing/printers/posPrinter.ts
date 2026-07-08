// Printer via POS Printer (todos os sistemas)
import { ESCPOSFormatter } from '../formatters/escpos';

export class POSPrinterManager {

  public static async imprimir(conteudo: string, titulo: string): Promise<boolean> {
    try {
      // Formatar conteúdo para ESC/POS
      const conteudoFormatado = ESCPOSFormatter.formatarParaESCPOS(conteudo, titulo);
      
      // Codificar em base64 para URL
      const conteudoBase64 = btoa(unescape(encodeURIComponent(conteudoFormatado)));
      
      // URL scheme do POS Printer
      const urlPOSPrinter = `pos-printer://print?data=${conteudoBase64}`;
      
      console.log('Tentando abrir POS Printer com URL:', urlPOSPrinter);
      
      // Tentar abrir o app POS Printer
      window.location.href = urlPOSPrinter;
      
      // Aguardar um momento para verificar se o app foi aberto
      return new Promise((resolve) => {
        setTimeout(() => {
          // Se chegou até aqui, assumimos que funcionou
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error('Erro na impressão via POS Printer:', error);
      return false;
    }
  }
}