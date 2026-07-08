import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, Trash2, Receipt } from 'lucide-react';
import { Comanda, Produto, VendaDia, ItemComanda } from '@/types/restaurant';
import { DivisaoConta } from './DividirConta';
import DividirConta from './DividirConta';
import MesaHeader from './MesaHeader';
import AdicionarProduto from './AdicionarProduto';
import ListaItensComanda from './ListaItensComanda';
import CarrinhoTemporario from './CarrinhoTemporario';
import GerarConta from './GerarConta';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface GerenciarComandaProps {
  comanda: Comanda;
  produtos: Produto[];
  onComandaAtualizada: (comanda: Comanda) => void;
  onComandaFechada: (venda: VendaDia) => void;
  onMesaExcluida: (comandaId: string, mesaNumero: number) => void;
  onVoltar: () => void;
  onVerMesasAbertas: () => void;
  comandasAbertas: Comanda[];
  obterComandaAtualizada: (comandaId: string) => Comanda | null;
}

const GerenciarComanda = ({ 
  comanda: comandaInicial, 
  produtos, 
  onComandaAtualizada, 
  onComandaFechada,
  onMesaExcluida,
  onVoltar,
  onVerMesasAbertas,
  comandasAbertas,
  obterComandaAtualizada
}: GerenciarComandaProps) => {
  const [mostrarDivisao, setMostrarDivisao] = useState(false);
  const [mostrarGerarConta, setMostrarGerarConta] = useState(false);
  const [comandaAtual, setComandaAtual] = useState(comandaInicial);
  const [carrinhoTemporario, setCarrinhoTemporario] = useState<ItemComanda[]>([]);
  const { toast } = useToast();

  // Sempre usar a versão mais atualizada da comanda
  useEffect(() => {
    const comandaAtualizada = obterComandaAtualizada(comandaInicial.id);
    if (comandaAtualizada) {
      setComandaAtual(comandaAtualizada);
    }
  }, [comandaInicial.id, obterComandaAtualizada, comandasAbertas]);

  const calcularTotal = () => {
    return comandaAtual.itens.reduce((total, item) => total + (item.valor_unitario * item.quantidade), 0);
  };

  const calcularCMV = () => {
    return comandaAtual.itens.reduce((total, item) => {
      const produto = produtos.find(p => p.nome === item.produto_nome || item.produto_nome.startsWith(p.nome));
      return total + ((produto?.cmv || 0) * item.quantidade);
    }, 0);
  };

  const adicionarAoCarrinho = (produto: Produto, quantidade: number, comentario?: string, garcom?: string) => {
    const nomeCompleto = comentario ? `${produto.nome} (${comentario})` : produto.nome;
    const itemExistente = carrinhoTemporario.findIndex(item => item.produto_nome === nomeCompleto);
    
    if (itemExistente >= 0) {
      const novoCarrinho = [...carrinhoTemporario];
      novoCarrinho[itemExistente].quantidade += quantidade;
      setCarrinhoTemporario(novoCarrinho);
    } else {
      const novoItem: ItemComanda = {
        produto_nome: nomeCompleto,
        quantidade,
        valor_unitario: produto.valor,
        garcom
      };
      setCarrinhoTemporario([...carrinhoTemporario, novoItem]);
    }

    toast({
      title: "Produto adicionado ao carrinho",
      description: `${quantidade}x ${produto.nome}`,
    });
  };

  const atualizarItemCarrinho = (index: number, quantidade: number) => {
    if (quantidade < 1) return;
    const novoCarrinho = [...carrinhoTemporario];
    novoCarrinho[index].quantidade = quantidade;
    setCarrinhoTemporario(novoCarrinho);
  };

  const removerItemCarrinho = (index: number) => {
    const novoCarrinho = carrinhoTemporario.filter((_, i) => i !== index);
    setCarrinhoTemporario(novoCarrinho);
  };

  const confirmarPedido = () => {
    if (carrinhoTemporario.length === 0) return;

    const comandaAtualizada = { ...comandaAtual };
    carrinhoTemporario.forEach(itemCarrinho => {
      const itemExistente = comandaAtualizada.itens.findIndex(
        item => item.produto_nome === itemCarrinho.produto_nome
      );

      if (itemExistente >= 0) {
        comandaAtualizada.itens[itemExistente].quantidade += itemCarrinho.quantidade;
      } else {
        comandaAtualizada.itens.push({ ...itemCarrinho });
      }
      
      comandaAtualizada.valor_total += itemCarrinho.valor_unitario * itemCarrinho.quantidade;
    });

    setComandaAtual(comandaAtualizada);
    onComandaAtualizada(comandaAtualizada);
    setCarrinhoTemporario([]);

    toast({
      title: "Pedido confirmado!",
      description: `Itens adicionados à mesa ${comandaAtual.mesa}`,
    });
  };

  const limparCarrinho = () => {
    setCarrinhoTemporario([]);
  };

  const handleGerarConta = (porcentagem: number, tipoDivisao: 'igual' | 'personalizado', divisaoPersonalizada?: { pessoa: string; valor: number }[]) => {
    setMostrarGerarConta(false);
    
    toast({
      title: "Conta gerada!",
      description: `Mesa ${comandaAtual.mesa} - Porcentagem: ${porcentagem}%`,
    });
  };

  const fecharMesa = () => {
    const comandaParaFechar = obterComandaAtualizada(comandaAtual.id);
    if (!comandaParaFechar || comandaParaFechar.status === 'fechada') {
      toast({
        title: "Erro",
        description: "Esta comanda já foi fechada ou não existe mais",
        variant: "destructive"
      });
      return;
    }
    
    if (comandaParaFechar.itens.length === 0) {
      toast({
        title: "Erro",
        description: "Não é possível fechar uma mesa sem itens",
        variant: "destructive"
      });
      return;
    }
    
    setMostrarDivisao(true);
  };

  const excluirMesa = () => {
    const comandaParaExcluir = obterComandaAtualizada(comandaAtual.id);
    if (!comandaParaExcluir || comandaParaExcluir.status === 'fechada') {
      toast({
        title: "Erro",
        description: "Esta comanda já foi fechada ou não existe mais",
        variant: "destructive"
      });
      return;
    }

    const valorCMV = calcularCMV();
    
    onMesaExcluida(comandaAtual.id, comandaAtual.mesa);
    
    toast({
      title: "Mesa excluída!",
      description: `Mesa ${comandaAtual.mesa} foi cancelada. Despesa de CMV: R$ ${valorCMV.toFixed(2)}`,
      variant: "destructive"
    });
  };

  const confirmarFechamento = (divisao: DivisaoConta) => {
    const comandaParaFechar = obterComandaAtualizada(comandaAtual.id);
    if (!comandaParaFechar) {
      toast({
        title: "Erro",
        description: "Comanda não encontrada",
        variant: "destructive"
      });
      return;
    }

    const totalBruto = comandaParaFechar.itens.reduce((total, item) => total + (item.valor_unitario * item.quantidade), 0);
    const valorGorjeta = (totalBruto * divisao.porcentagemGarcom) / 100;
    const totalComGorjeta = totalBruto + valorGorjeta;
    
    const totalCusto = comandaParaFechar.itens.reduce((total, item) => {
      const produto = produtos.find(p => p.nome === item.produto_nome || item.produto_nome.startsWith(p.nome));
      return total + ((produto?.cmv || 0) * item.quantidade);
    }, 0);
    
    const totalLiquido = totalComGorjeta - totalCusto;

    const venda: VendaDia = {
      id: Date.now().toString(),
      itens: [...comandaParaFechar.itens],
      total_bruto: totalBruto,
      total_liquido: totalLiquido,
      total_custo: totalCusto,
      valor_gorjeta: valorGorjeta,
      porcentagem_gorjeta: divisao.porcentagemGarcom,
      divisao_conta: divisao,
      data: new Date()
    };

    onComandaFechada(venda);
    setMostrarDivisao(false);

    toast({
      title: "Mesa fechada!",
      description: `Mesa ${comandaParaFechar.mesa} fechada. Total: R$ ${totalComGorjeta.toFixed(2)}`,
    });
  };

  const handleComandaAtualizada = (comandaAtualizada: Comanda) => {
    setComandaAtual(comandaAtualizada);
    onComandaAtualizada(comandaAtualizada);
  };

  return (
    <div className="space-y-6">
      <MesaHeader 
        comanda={comandaAtual}
        comandasAbertas={comandasAbertas}
        onVoltar={onVoltar}
        onVerMesasAbertas={onVerMesasAbertas}
      />

      <AdicionarProduto 
        produtos={produtos}
        comanda={comandaAtual}
        onProdutoAdicionado={handleComandaAtualizada}
        onSairMesa={onVoltar}
        onAdicionarAoCarrinho={adicionarAoCarrinho}
      />

      <CarrinhoTemporario
        itens={carrinhoTemporario}
        onAtualizarItem={atualizarItemCarrinho}
        onRemoverItem={removerItemCarrinho}
        onConfirmarPedido={confirmarPedido}
        onLimparCarrinho={limparCarrinho}
        onEnviarEVoltar={onVoltar}
        mesaNumero={comandaAtual.mesa}
        garcomNome={comandaAtual.garcom || 'N/A'}
      />

      <ListaItensComanda 
        comanda={comandaAtual}
        onComandaAtualizada={handleComandaAtualizada}
      />

      <div className="flex gap-2">
        <Button
          onClick={() => setMostrarGerarConta(true)}
          disabled={comandaAtual.itens.length === 0}
          variant="outline"
          className="flex-1"
        >
          <Receipt className="h-4 w-4 mr-2" />
          Gerar Conta
        </Button>

        <Button
          onClick={fecharMesa}
          disabled={comandaAtual.itens.length === 0}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Fechar Mesa {comandaAtual.mesa}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="px-4"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Mesa {comandaAtual.mesa}?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação cancelará a mesa e registrará o CMV dos itens como despesa.
                <br />
                <br />
                <strong>Valor do CMV: R$ {calcularCMV().toFixed(2)}</strong>
                <br />
                <br />
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={excluirMesa} className="bg-red-600 hover:bg-red-700">
                Excluir Mesa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <GerarConta
        open={mostrarGerarConta}
        onOpenChange={setMostrarGerarConta}
        comanda={comandaAtual}
        onGerarConta={handleGerarConta}
      />

      <DividirConta
        open={mostrarDivisao}
        onOpenChange={setMostrarDivisao}
        valorTotal={calcularTotal()}
        onConfirmar={confirmarFechamento}
      />
    </div>
  );
};

export default GerenciarComanda;
