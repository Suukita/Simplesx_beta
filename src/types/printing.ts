// Tipos e interfaces para o sistema de impressão
export interface ConfiguracaoImpressao {
  largura?: string;
  altura?: string;
  tamanhoFonte?: string;
  margens?: string;
}

export interface PrintResult {
  success: boolean;
  method?: string;
  error?: string;
}