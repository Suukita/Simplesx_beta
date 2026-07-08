
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Coffee, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Mesa, Comanda } from '@/types/restaurant';

interface AbrirMesaProps {
  mesa: Mesa;
  onMesaAberta: (comanda: Comanda) => void;
  onVoltar: () => void;
}

const AbrirMesa = ({ mesa, onMesaAberta, onVoltar }: AbrirMesaProps) => {
  const [pessoas, setPessoas] = useState('1'); // Definindo 1 como padrão
  const [splitAtivo, setSplitAtivo] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pessoas || parseInt(pessoas) <= 0) {
      toast({
        title: "Erro",
        description: "Informe um número válido de pessoas",
        variant: "destructive"
      });
      return;
    }

    const novaComanda: Comanda = {
      id: Date.now().toString(),
      mesa: mesa.numero,
      itens: [],
      valor_total: 0,
      status: 'aberta',
      pessoas: parseInt(pessoas),
      split_ativo: splitAtivo,
      por_pessoa: []
    };

    onMesaAberta(novaComanda);

    toast({
      title: "Mesa aberta!",
      description: `Mesa ${mesa.numero} aberta para ${pessoas} pessoa(s)`,
    });
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="h-5 w-5 text-primary" />
          Abrir Mesa {mesa.numero}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="mesa" className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              Número da Mesa
            </Label>
            <Input
              id="mesa"
              value={mesa.numero}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <Label htmlFor="pessoas" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Número de Pessoas
            </Label>
            <Input
              id="pessoas"
              type="number"
              min="1"
              value={pessoas}
              onChange={(e) => setPessoas(e.target.value)}
              placeholder="Ex: 4"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="split"
              checked={splitAtivo}
              onCheckedChange={(checked) => setSplitAtivo(checked as boolean)}
            />
            <Label htmlFor="split" className="text-sm font-normal">
              Ativar divisão por pessoa
            </Label>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onVoltar}
              className="flex-1"
            >
              Voltar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary/50 hover:bg-primary/90"
            >
              Abrir Mesa
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AbrirMesa;
