
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Produto, Categoria } from '@/types/restaurant';
import { ProductFormData } from './types/ProductFormTypes';
import ProductForm from './components/ProductForm';

interface CadastroProdutoProps {
  onProdutoAdicionado: (produto: Produto) => void;
  categorias: Categoria[];
}

const CadastroProduto = ({ onProdutoAdicionado, categorias }: CadastroProdutoProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    nome: '',
    valor: '',
    cmv: '',
    categoria: '',
    comentarios: []
  });
  
  const { toast } = useToast();

  const handleFormDataChange = (data: Partial<ProductFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      valor: '',
      cmv: '',
      categoria: '',
      comentarios: []
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { nome, valor, cmv, categoria, comentarios } = formData;

    if (!nome || !valor || !cmv) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios (Nome, Valor e CMV)",
        variant: "destructive"
      });
      return;
    }

    // Filtrar comentários vazios
    const comentariosFiltrados = comentarios.filter(c => c && c.trim() !== '');

    const novoProduto: Produto = {
      id: Date.now().toString(),
      nome,
      valor: parseFloat(valor),
      cmv: parseFloat(cmv),
      categoria: categoria || 'Sem categoria',
      comentarios: comentariosFiltrados.length > 0 ? comentariosFiltrados : undefined
    };

    console.log('Produto sendo criado:', novoProduto);
    console.log('Comentários filtrados:', comentariosFiltrados);

    onProdutoAdicionado(novoProduto);
    resetForm();

    toast({
      title: "Produto cadastrado!",
      description: `${nome} foi adicionado com sucesso`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Cadastrar Produto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm
          formData={formData}
          categorias={categorias}
          onFormDataChange={handleFormDataChange}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default CadastroProduto;
