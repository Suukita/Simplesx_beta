// Gerenciador principal de impressão
import { ConfiguracaoImpressao } from '@/types/printing';
import { POSPrinterManager } from './printing/printers/posPrinter';
import { NativePrinterManager } from './printing/printers/nativePrinter';

export type { ConfiguracaoImpressao };

export class GerenciadorImpressao {
  private static instancia: GerenciadorImpressao;

  public static obterInstancia(): GerenciadorImpressao {
    if (!GerenciadorImpressao.instancia) {
      GerenciadorImpressao.instancia = new GerenciadorImpressao();
    }
    return GerenciadorImpressao.instancia;
  }

  // Método principal de impressão
  public async imprimir(conteudo: string, titulo: string, config?: ConfiguracaoImpressao): Promise<boolean> {
    console.log('Iniciando impressão:', titulo);

    // 1. Tentar POS Printer primeiro
    const sucessoPOSPrinter = await POSPrinterManager.imprimir(conteudo, titulo);
    if (sucessoPOSPrinter) {
      console.log('Impressão enviada via POS Printer');
      return true;
    }

    // 2. Fallback para impressão nativa do navegador
    const sucessoNativo = await NativePrinterManager.imprimir(conteudo, titulo, config);
    if (sucessoNativo) {
      console.log('Impressão enviada via método nativo');
      return true;
    }

    // 3. Fallback final — abrir em nova janela
    console.log('Abrindo janela manual de impressão...');
    NativePrinterManager.abrirParaImpressaoManual(conteudo, titulo, config);
    return true;
  }
}
