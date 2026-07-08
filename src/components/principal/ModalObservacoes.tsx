import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { Produto } from '@/types/restaurant';

interface ModalObservacoesProps {
  isOpen: boolean;
  onClose: () => void;
  produto: Produto | null;
  onConfirmar: (quantidade: number, observacao?: string) => void;
}

const ModalObservacoes = ({ isOpen, onClose, produto, onConfirmar }: ModalObservacoesProps) => {
  const [quantidade, setQuantidade] = useState(1);
  const [observacaoPersonalizada, setObservacaoPersonalizada] = useState('');
  const [observacoesSelecionadas, setObservacoesSelecionadas] = useState<string[]>([]);

  const observacoesPredefinidas = [
    'Sem cebola',
    'Sem tomate', 
    'Sem alface',
    'Bem passado',
    'Mal passado',
    'Ao ponto',
    'Sem molho',
    'Molho à parte',
    'Bem quente',
    'Sem pimenta',
    'Extra molho',
    'Sem queijo'
  ];

  const handleObservacaoClick = (obs: string) => {
    if (observacoesSelecionadas.includes(obs)) {
      setObservacoesSelecionadas(prev => prev.filter(o => o !== obs));
    } else {
      setObservacoesSelecionadas(prev => [...prev, obs]);
    }
  };

  const adicionarObservacaoPersonalizada = () => {
    if (observacaoPersonalizada.trim() && !observacoesSelecionadas.includes(observacaoPersonalizada.trim())) {
      setObservacoesSelecionadas(prev => [...prev, observacaoPersonalizada.trim()]);
      setObservacaoPersonalizada('');
    }
  };

  const removerObservacao = (obs: string) => {
    setObservacoesSelecionadas(prev => prev.filter(o => o !== obs));
  };

  const handleConfirmar = () => {
    const observacaoFinal = observacoesSelecionadas.length > 0 
      ? observacoesSelecionadas.join(', ') 
      : undefined;
    
    onConfirmar(quantidade, observacaoFinal);
    handleClose();
  };

  const handleClose = () => {
    setQuantidade(1);
    setObservacaoPersonalizada('');
    setObservacoesSelecionadas([]);
    onClose();
  };

  if (!produto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar ao Carrinho</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Produto Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="font-medium">{produto.nome}</h3>
            <p className="text-sm text-gray-600">R$ {produto.valor.toFixed(2)}</p>
          </div>

          {/* Quantidade */}
          <div className="space-y-2">
            <Label>Quantidade</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                className="h-8 w-8 p-0"
              >
                -
              </Button>
              <Input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantidade(quantidade + 1)}
                className="h-8 w-8 p-0"
              >
                +
              </Button>
            </div>
          </div>

          {/* Observações Predefinidas */}
          <div className="space-y-2">
            <Label>Observações Comuns</Label>
            <div className="flex flex-wrap gap-2">
              {observacoesPredefinidas.map(obs => (
                <Badge
                  key={obs}
                  variant={observacoesSelecionadas.includes(obs) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => handleObservacaoClick(obs)}
                >
                  {obs}
                </Badge>
              ))}
            </div>
          </div>

          {/* Observação Personalizada */}
          <div className="space-y-2">
            <Label>Observação Personalizada</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Digite uma observação..."
                value={observacaoPersonalizada}
                onChange={(e) => setObservacaoPersonalizada(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && adicionarObservacaoPersonalizada()}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={adicionarObservacaoPersonalizada}
                disabled={!observacaoPersonalizada.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Observações Selecionadas */}
          {observacoesSelecionadas.length > 0 && (
            <div className="space-y-2">
              <Label>Observações Selecionadas</Label>
              <div className="flex flex-wrap gap-2">
                {observacoesSelecionadas.map(obs => (
                  <Badge key={obs} variant="secondary" className="flex items-center gap-1">
                    {obs}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removerObservacao(obs)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="pt-2 border-t">
            <p className="font-medium text-right">
              Total: R$ {(produto.valor * quantidade).toFixed(2)}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmar}>
            Adicionar ao Carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalObservacoes;