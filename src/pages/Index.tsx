import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Coffee } from 'lucide-react';
import Header from '@/components/Header';
import CadastroProduto from '@/components/gestor/CadastroProduto';
import CadastroMesas from '@/components/gestor/CadastroMesas';
import VendasDia from '@/components/gestor/VendasDia';
import DespesasDia from '@/components/gestor/DespesasDia';
import ListaProdutos from '@/components/gestor/ListaProdutos';
import GerenciarCategorias from '@/components/gestor/GerenciarCategorias';
import RelatoriosAvancados from '@/components/gestor/RelatoriosAvancados';
import SelecionarMesa from '@/components/principal/SelecionarMesa';
import AbrirMesa from '@/components/principal/AbrirMesa';
import GerenciarComanda from '@/components/principal/GerenciarComanda';
import MesasAbertas from '@/components/principal/MesasAbertas';
import FiltroGarcom from '@/components/principal/FiltroGarcom';
import { Mesa, Comanda, VendaDia } from '@/types/restaurant';
import { useRestaurantData } from '@/hooks/useRestaurantData';

const Index = () => {
  const {
    produtos,
    categorias,
    mesas,
    comandas,
    vendas,
    despesas,
    adicionarProduto,
    adicionarCategoria,
    removerCategoria,
    atualizarComanda,
    fecharComanda,
    excluirMesa,
    abrirMesa,
    fecharMesaVazia,
    obterComandaAtualizada
  } = useRestaurantData();

  // Estados de navegação
  const [mesaSelecionada, setMesaSelecionada] = useState<Mesa | null>(null);
  const [comandaAtiva, setComandaAtiva] = useState<Comanda | null>(null);
  const [modo, setModo] = useState<'selecionar' | 'abrir' | 'gerenciar' | 'mesas-abertas'>('selecionar');
  
  // Estados do garçom
  const [garcomAtual, setGarcomAtual] = useState('');
  const [filtrarMeusPedidos, setFiltrarMeusPedidos] = useState(false);

  const selecionarMesa = (mesa: Mesa) => {
    setMesaSelecionada(mesa);
    
    if (mesa.status === 'ocupada' && mesa.comanda_id) {
      const comanda = obterComandaAtualizada(mesa.comanda_id);
      if (comanda) {
        setComandaAtiva(comanda);
        setModo('gerenciar');
      }
    } else {
      setModo('abrir');
    }
  };

  const handleAbrirMesa = (novaComanda: Comanda) => {
    // Adicionar garçom à comanda se informado
    const comandaComGarcom = garcomAtual ? { ...novaComanda, garcom: garcomAtual } : novaComanda;
    abrirMesa(comandaComGarcom);
    setComandaAtiva(comandaComGarcom);
    setModo('gerenciar');
  };

  const handleFecharComanda = (venda: VendaDia) => {
    if (!comandaAtiva) return;
    
    // Adicionar informação do garçom que fechou
    const vendaComGarcom = garcomAtual ? { 
      ...venda, 
      garcom_fechamento: garcomAtual,
      divisao_conta: venda.divisao_conta ? {
        ...venda.divisao_conta,
        garcom_fechamento: garcomAtual
      } : undefined
    } : venda;
    
    fecharComanda(vendaComGarcom, comandaAtiva.id, comandaAtiva.mesa);
    voltarParaSelecao();
  };

  const handleExcluirMesa = (comandaId: string, mesaNumero: number) => {
    excluirMesa(comandaId, mesaNumero);
    voltarParaSelecao();
  };

  const handleFecharMesaVazia = (comandaId: string, mesaNumero: number) => {
    fecharMesaVazia(comandaId, mesaNumero);
  };

  const voltarParaSelecao = () => {
    setMesaSelecionada(null);
    setComandaAtiva(null);
    setModo('selecionar');
  };

  const irParaMesasAbertas = () => {
    setModo('mesas-abertas');
  };

  const selecionarComandaAtiva = (comanda: Comanda) => {
    setComandaAtiva(comanda);
    setModo('gerenciar');
  };

  const comandasAbertas = comandas.filter(c => c.status === 'aberta');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto p-4">
        <Tabs defaultValue="principal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
            <TabsTrigger value="principal" className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              Principal
            </TabsTrigger>
            <TabsTrigger value="gestor" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Gestor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gestor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CadastroProduto 
                onProdutoAdicionado={adicionarProduto} 
                categorias={categorias}
              />
              <CadastroMesas mesas={mesas} />
            </div>
            <GerenciarCategorias
              categorias={categorias}
              onCategoriaAdicionada={adicionarCategoria}
              onCategoriaRemovida={removerCategoria}
            />
            <ListaProdutos produtos={produtos} />
            <RelatoriosAvancados vendas={vendas} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VendasDia vendas={vendas} />
              <DespesasDia despesas={despesas} />
            </div>
          </TabsContent>

          <TabsContent value="principal">
            {/* Filtro do Garçom - sempre visível */}
            <FiltroGarcom
              garcomAtual={garcomAtual}
              filtrarMeus={filtrarMeusPedidos}
              onGarcomChange={setGarcomAtual}
              onFiltroMeusChange={setFiltrarMeusPedidos}
            />

            {modo === 'selecionar' && (
              <SelecionarMesa 
                mesas={mesas} 
                onSelecionarMesa={selecionarMesa}
                comandasAbertas={comandasAbertas}
                onVerMesasAbertas={irParaMesasAbertas}
              />
            )}

            {modo === 'mesas-abertas' && (
              <MesasAbertas
                comandas={comandasAbertas}
                onSelecionarComanda={selecionarComandaAtiva}
                onVoltar={voltarParaSelecao}
                onFecharMesaVazia={handleFecharMesaVazia}
                garcomAtual={garcomAtual}
                filtrarPorGarcom={filtrarMeusPedidos}
              />
            )}
            
            {modo === 'abrir' && mesaSelecionada && (
              <AbrirMesa 
                mesa={mesaSelecionada}
                onMesaAberta={handleAbrirMesa}
                onVoltar={voltarParaSelecao}
              />
            )}
            
            {modo === 'gerenciar' && comandaAtiva && (
              <GerenciarComanda
                comanda={comandaAtiva}
                produtos={produtos}
                onComandaAtualizada={atualizarComanda}
                onComandaFechada={handleFecharComanda}
                onMesaExcluida={handleExcluirMesa}
                onVoltar={voltarParaSelecao}
                onVerMesasAbertas={irParaMesasAbertas}
                comandasAbertas={comandasAbertas}
                obterComandaAtualizada={obterComandaAtualizada}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
