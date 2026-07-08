
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Package, DollarSign, TrendingDown } from 'lucide-react';
import { Produto } from '@/types/restaurant';

interface ListaProdutosProps {
  produtos: Produto[];
}

const ListaProdutos = ({ produtos }: ListaProdutosProps) => {
  const [busca, setBusca] = useState('');

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  // Agrupar produtos por categoria dinamicamente
  const categorias = [...new Set(produtos.map(p => p.categoria))].sort();
  
  const produtosPorCategoria = categorias.reduce((acc, categoria) => {
    acc[categoria] = produtosFiltrados.filter(produto => produto.categoria === categoria);
    return acc;
  }, {} as Record<string, Produto[]>);

  const getCategoriaColor = (categoria: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-red-100 text-red-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-primary/10 text-foreground',
      'bg-gray-100 text-gray-800'
    ];
    const index = categoria.length % colors.length;
    return colors[index];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Lista de Produtos ({produtos.length} total)
        </CardTitle>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar produto ou categoria..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categorias.map((categoria) => {
            const produtosCategoria = produtosPorCategoria[categoria];
            
            if (produtosCategoria.length === 0) return null;

            return (
              <div key={categoria}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getCategoriaColor(categoria)}>
                    {categoria} ({produtosCategoria.length})
                  </Badge>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-right">CMV</TableHead>
                        <TableHead className="text-right">Margem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {produtosCategoria.map((produto) => {
                        const margem = ((produto.valor - produto.cmv) / produto.valor * 100);
                        return (
                          <TableRow key={produto.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{produto.nome}</p>
                                {produto.imagem && (
                                  <p className="text-xs text-gray-500">Com imagem</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <DollarSign className="h-3 w-3 text-green-600" />
                                <span className="font-medium text-green-600">
                                  R$ {produto.valor.toFixed(2)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <TrendingDown className="h-3 w-3 text-red-600" />
                                <span className="text-red-600">
                                  R$ {produto.cmv.toFixed(2)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={`font-medium ${margem > 60 ? 'text-green-600' : margem > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {margem.toFixed(1)}%
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })}
          
          {produtosFiltrados.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {busca ? 'Nenhum produto encontrado para esta busca' : 'Nenhum produto cadastrado'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListaProdutos;
