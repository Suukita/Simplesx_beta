
export interface ProductFormData {
  nome: string;
  valor: string;
  cmv: string;
  categoria: string;
  comentarios: string[];
}

export interface ProductFormErrors {
  nome?: string;
  valor?: string;
  cmv?: string;
}
