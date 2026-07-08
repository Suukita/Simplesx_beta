// Printer via API nativa do navegador
import { ConfiguracaoImpressao } from '@/types/printing';
import { HTMLFormatter } from '../formatters/html';

export class NativePrinterManager {
  public static async imprimir(conteudo: string, titulo: string, config?: ConfiguracaoImpressao): Promise<boolean> {
    try {
      const largura = config?.largura || '80mm';
      
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = largura;
      iframe.style.height = 'auto';
      
      document.body.appendChild(iframe);
      
      const doc = iframe.contentDocument;
      if (doc) {
        const htmlCompleto = HTMLFormatter.gerarHTMLCompleto(conteudo, titulo, config);
        
        doc.open();
        doc.write(htmlCompleto);
        doc.close();
        
        // Aguardar e imprimir
        setTimeout(() => {
          iframe.contentWindow?.print();
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 2000);
        }, 500);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro na impressão nativa:', error);
      return false;
    }
  }

  public static abrirParaImpressaoManual(conteudo: string, titulo: string, config?: ConfiguracaoImpressao): void {
    const novaJanela = window.open('', '_blank');
    if (novaJanela) {
      const htmlCompleto = HTMLFormatter.gerarHTMLCompleto(conteudo, titulo, config);
      
      novaJanela.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${titulo}</title>
            <meta charset="utf-8">
            ${HTMLFormatter.gerarEstilosImpressao(config)}
          </head>
          <body>
            <pre>${conteudo}</pre>
            <script>
              // Auto-abrir diálogo de impressão
              setTimeout(() => {
                window.print();
              }, 1000);
            </script>
          </body>
        </html>
      `);
      novaJanela.document.close();
    }
  }
}