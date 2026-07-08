// Formatador HTML/CSS para impressão
import { ConfiguracaoImpressao } from '@/types/printing';

export class HTMLFormatter {
  public static gerarEstilosImpressao(config?: ConfiguracaoImpressao): string {
    const largura = config?.largura || '80mm';
    const altura = config?.altura || '200mm';
    const tamanhoFonte = config?.tamanhoFonte || '9px';
    const margens = config?.margens || '1mm';
    
    // Calcular largura do conteúdo
    const larguraNum = parseInt(largura);
    const margensNum = parseInt(margens);
    const larguraConteudo = `${larguraNum - (margensNum * 2)}mm`;
    
    return `
      <style>
        @page {
          size: ${largura} ${altura};
          margin: 0;
        }
        
        body { 
          font-family: 'Courier New', monospace; 
          font-size: ${tamanhoFonte};
          margin: 0;
          padding: ${margens};
          line-height: 1.0;
          width: ${larguraConteudo};
          color: #000;
          background: #fff;
          page-break-inside: avoid;
        }
        
        pre { 
          white-space: pre-wrap; 
          margin: 0;
          font-family: inherit;
          font-size: inherit;
          page-break-inside: avoid;
        }
        
        @media print {
          body { 
            margin: 0; 
            padding: ${margens};
            font-size: ${tamanhoFonte};
            page-break-inside: avoid;
          }
          
          @page {
            size: ${largura} ${altura === 'auto' ? 'auto' : altura};
            margin: 0;
          }
          
          * {
            page-break-inside: avoid;
          }
        }
        
        .titulo {
          text-align: center;
          font-weight: bold;
          margin-bottom: ${margens};
          font-size: ${parseInt(tamanhoFonte) + 1}px;
        }
        
        .separador {
          border-top: 1px dashed #000;
          margin: ${margens} 0;
          height: 1px;
        }
        
        .item {
          margin: ${parseInt(margens) * 0.5}mm 0;
          line-height: 1.1;
        }
        
        .total {
          font-weight: bold;
          text-align: right;
          margin-top: ${margens};
          font-size: ${tamanhoFonte};
        }
      </style>
    `;
  }

  public static gerarHTMLCompleto(conteudo: string, titulo: string, config?: ConfiguracaoImpressao): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${titulo}</title>
          <meta charset="utf-8">
          ${this.gerarEstilosImpressao(config)}
        </head>
        <body>
          <pre>${conteudo}</pre>
        </body>
      </html>
    `;
  }
}