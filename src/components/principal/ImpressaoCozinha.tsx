import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ChefHat, Printer, Settings, Eye } from 'lucide-react';
import { ItemComanda } from '@/types/restaurant';
import { useToast } from '@/hooks/use-toast';
import { GerenciadorImpressao } from '@/utils/impressao';
import { GerenciadorImpressao } from '@/utils/impressao';

interface ImpressaoCozinhaProps {
  isOpen: boolean;
  onClose: () => void;
  itens: ItemComanda[];
  mesaNumero: number;
  garcomNome: string;
}

interface ConfigImpressaoCozinha {
  mostrarHorario: boolean;
  mostrarMesa: boolean;
  mostrarGarcom: boolean;
  mostrarObservacoes: boolean;
  separarPorCategoria: boolean;
  tamanhoFonte: 'pequeno' | 'medio' | 'grande';
  larguraFonte: 'condensado' | 'normal' | 'expandido';
  incluirCabecalho: boolean;
  cabecalhoPersonalizado: string;
  incluirRodape: boolean;
  rodapePersonalizado: string;
}

const ImpressaoCozinha = ({ isOpen, onClose, itens, mesaNumero, garcomNome }: ImpressaoCozinhaProps) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<ConfigImpressaoCozinha>({
    mostrarHorario: true,
    mostrarMesa: true,
    mostrarGarcom: true,
    mostrarObservacoes: true,
    separarPorCategoria: false,
    tamanhoFonte: 'medio',
    larguraFonte: 'normal',
    incluirCabecalho: true,
    cabecalhoPersonalizado: '*** PEDIDO COZINHA ***',
    incluirRodape: true,
    rodapePersonalizado: '--- BOM TRABALHO! ---'
  });
  
  const [mostrandoPreview, setMostrandoPreview] = useState(false);
  const [imprimindo, setImprimindo] = useState(false);

  const gerarConteudoPedido = (): string => {
    const agora = new Date();
    const dataHora = agora.toLocaleString('pt-BR');
    const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    let conteudo = '';
    
    // Cabeçalho personalizado
    if (config.incluirCabecalho && config.cabecalhoPersonalizado) {
      conteudo += `${config.cabecalhoPersonalizado}\n`;
      conteudo += '='.repeat(config.cabecalhoPersonalizado.length) + '\n\n';
    }
    
    // Informações do pedido
    if (config.mostrarHorario) {
      conteudo += `HORARIO: ${hora}\n`;
    }
    
    if (config.mostrarMesa) {
      conteudo += `MESA: ${mesaNumero}\n`;
    }
    
    if (config.mostrarGarcom && garcomNome) {
      conteudo += `GARCOM: ${garcomNome}\n`;
    }
    
    conteudo += '\n' + '-'.repeat(30) + '\n\n';
    
    // Itens do pedido
    if (config.separarPorCategoria) {
      // Agrupar por categoria (simulado)
      const categorias = new Map();
      itens.forEach(item => {
        const categoria = 'GERAL'; // Aqui você pode implementar lógica de categoria
        if (!categorias.has(categoria)) {
          categorias.set(categoria, []);
        }
        categorias.get(categoria).push(item);
      });
      
      categorias.forEach((items, categoria) => {
        conteudo += `** ${categoria} **\n\n`;
        items.forEach(item => {
          conteudo += gerarLinhaItem(item);
        });
        conteudo += '\n';
      });
    } else {
      itens.forEach(item => {
        conteudo += gerarLinhaItem(item);
      });
    }
    
    // Rodapé personalizado
    if (config.incluirRodape && config.rodapePersonalizado) {
      conteudo += '\n' + '-'.repeat(30) + '\n';
      conteudo += config.rodapePersonalizado + '\n';
    }
    
    return conteudo;
  };

  const gerarLinhaItem = (item: ItemComanda): string => {
    let linha = '';
    
    // Nome do produto e quantidade
    const nomeCompleto = item.produto_nome;
    const temObservacao = nomeCompleto.includes('(') && nomeCompleto.includes(')');
    const nomeProduto = temObservacao ? nomeCompleto.split('(')[0].trim() : nomeCompleto;
    const observacao = temObservacao ? nomeCompleto.split('(')[1].replace(')', '').trim() : null;
    
    linha += `${item.quantidade}x ${nomeProduto}\n`;
    
    // Observações
    if (config.mostrarObservacoes && observacao) {
      linha += `   >>> ${observacao} <<<\n`;
    }
    
    linha += '\n';
    return linha;
  };

  const imprimirPedido = async () => {
    setImprimindo(true);
    
    try {
      const gerenciador = GerenciadorImpressao.obterInstancia();
      const conteudo = gerarConteudoPedido();
      const titulo = `Pedido Cozinha - Mesa ${mesaNumero}`;
      
      // Configuração de impressão baseada nas preferências
      const configImpressao = {
        largura: '80mm',
        altura: '200mm',
        tamanhoFonte: config.tamanhoFonte === 'pequeno' ? '8px' : 
                      config.tamanhoFonte === 'medio' ? '10px' : '12px',
        margens: '2mm'
      };
      
      const sucesso = await gerenciador.imprimir(conteudo, titulo, configImpressao);
      
      if (sucesso) {
        toast({
          title: "Pedido enviado para cozinha!",
          description: `Mesa ${mesaNumero} - ${itens.length} itens`,
        });
        onClose();
      }
    } catch (error) {
      console.error('Erro na impressão:', error);
      toast({
        title: "Erro na impressão",
        description: "Verifique se a impressora está conectada",
        variant: "destructive"
      });
    } finally {
      setImprimindo(false);
    }
  };

  const salvarConfiguracao = () => {
    localStorage.setItem('config-impressao-cozinha', JSON.stringify(config));
    toast({
      title: "Configuração salva!",
      description: "Suas preferências foram salvas",
    });
  };

  const carregarConfiguracao = () => {
    const configSalva = localStorage.getItem('config-impressao-cozinha');
    if (configSalva) {
      setConfig(JSON.parse(configSalva));
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      carregarConfiguracao();
    }
  }, [isOpen]);

  const previewConteudo = gerarConteudoPedido();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Impressão para Cozinha - Mesa {mesaNumero}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configurações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-4 w-4" />
                Configurações de Impressão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informações a incluir */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Informações a incluir:</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="horario">Mostrar horário</Label>
                  <Switch
                    id="horario"
                    checked={config.mostrarHorario}
                    onCheckedChange={(checked) => setConfig({...config, mostrarHorario: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="mesa">Mostrar mesa</Label>
                  <Switch
                    id="mesa"
                    checked={config.mostrarMesa}
                    onCheckedChange={(checked) => setConfig({...config, mostrarMesa: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="garcom">Mostrar garçom</Label>
                  <Switch
                    id="garcom"
                    checked={config.mostrarGarcom}
                    onCheckedChange={(checked) => setConfig({...config, mostrarGarcom: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="observacoes">Mostrar observações</Label>
                  <Switch
                    id="observacoes"
                    checked={config.mostrarObservacoes}
                    onCheckedChange={(checked) => setConfig({...config, mostrarObservacoes: checked})}
                  />
                </div>
              </div>

              {/* Formatação */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Formatação:</h4>
                
                <div>
                  <Label>Tamanho da fonte</Label>
                  <Select value={config.tamanhoFonte} onValueChange={(value: 'pequeno' | 'medio' | 'grande') => setConfig({...config, tamanhoFonte: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequeno">Pequeno</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Textos personalizados */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Textos personalizados:</h4>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="cabecalho">Incluir cabeçalho</Label>
                  <Switch
                    id="cabecalho"
                    checked={config.incluirCabecalho}
                    onCheckedChange={(checked) => setConfig({...config, incluirCabecalho: checked})}
                  />
                </div>
                
                {config.incluirCabecalho && (
                  <div>
                    <Label>Texto do cabeçalho</Label>
                    <Input
                      value={config.cabecalhoPersonalizado}
                      onChange={(e) => setConfig({...config, cabecalhoPersonalizado: e.target.value})}
                      placeholder="Digite o cabeçalho..."
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="rodape">Incluir rodapé</Label>
                  <Switch
                    id="rodape"
                    checked={config.incluirRodape}
                    onCheckedChange={(checked) => setConfig({...config, incluirRodape: checked})}
                  />
                </div>
                
                {config.incluirRodape && (
                  <div>
                    <Label>Texto do rodapé</Label>
                    <Input
                      value={config.rodapePersonalizado}
                      onChange={(e) => setConfig({...config, rodapePersonalizado: e.target.value})}
                      placeholder="Digite o rodapé..."
                    />
                  </div>
                )}
              </div>

              <Button onClick={salvarConfiguracao} variant="outline" className="w-full">
                Salvar Configuração
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-4 w-4" />
                Preview do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {previewConteudo}
                </pre>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={imprimirPedido}
                  disabled={imprimindo || itens.length === 0}
                  className="flex-1"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  {imprimindo ? 'Imprimindo...' : 'Imprimir Pedido'}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImpressaoCozinha;