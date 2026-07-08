
export interface Produto {
  id: string;
  nome: string;
  valor: number;
  cmv: number;
  imagem?: string;
  categoria: string;
  comentarios?: string[];
}

export interface ItemComanda {
  produto_nome: string;
  quantidade: number;
  valor_unitario: number;
  garcom?: string; // Adicionado para identificar quem lançou
}

export interface Comanda {
  id: string;
  mesa: number;
  itens: ItemComanda[];
  valor_total: number;
  status: 'aberta' | 'fechada';
  pessoas: number;
  split_ativo: boolean;
  por_pessoa: string[];
  garcom?: string; // Garçom responsável pela mesa
}

export interface DivisaoConta {
  tipo: 'igual' | 'personalizado';
  pessoas: number;
  porcentagemGarcom: number;
  divisaoPersonalizada?: { pessoa: string; valor: number }[];
  garcom_fechamento?: string; // Quem fechou a conta
}

export interface VendaDia {
  id: string;
  itens: ItemComanda[];
  total_bruto: number;
  total_liquido: number;
  total_custo: number;
  valor_gorjeta?: number;
  porcentagem_gorjeta?: number;
  divisao_conta?: DivisaoConta;
  data: Date;
  garcom_fechamento?: string;
}

export interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'cancelamento_mesa' | 'outros';
  itens?: ItemComanda[];
  mesa?: number;
  data: Date;
}

export interface Mesa {
  numero: number;
  status: 'disponivel' | 'ocupada';
  comanda_id?: string;
}

export interface Categoria {
  id: string;
  nome: string;
  cor: string;
}
