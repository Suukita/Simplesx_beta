// Formatador ESC/POS para impressoras térmicas
export class ESCPOSFormatter {
  public static formatarParaESCPOS(conteudo: string, titulo: string): string {
    let escpos = '';
    
    // Inicializar impressora
    escpos += '\x1B\x40'; // ESC @ - Inicializar
    
    // Centralizar e imprimir título
    escpos += '\x1B\x61\x01'; // ESC a 1 - Centralizar
    escpos += '\x1B\x21\x08'; // ESC ! 8 - Texto grande
    escpos += titulo + '\n';
    escpos += '\x1B\x21\x00'; // ESC ! 0 - Texto normal
    
    // Separador
    escpos += '\x1B\x61\x00'; // ESC a 0 - Alinhar à esquerda
    escpos += '--------------------------------\n';
    
    // Conteúdo
    escpos += conteudo;
    
    // Separador final
    escpos += '\n--------------------------------\n';
    
    // Cortar papel (se suportado)
    escpos += '\x1D\x56\x42\x00'; // GS V B 0 - Corte parcial
    
    // Pular linhas
    escpos += '\n\n\n';
    
    return escpos;
  }
}