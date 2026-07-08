import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, Settings, TestTube } from 'lucide-react';
import { GerenciadorImpressao, ConfiguracaoImpressao } from '@/utils/impressao';
import { useToast } from '@/hooks/use-toast';

const GerenciadorImpressora = () => {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<ConfiguracaoImpressao>({
    largura: '80mm',
    altura: '200mm',
    tamanhoFonte: '9px',
    margens: '1mm',
  });
  const [testando, setTestando] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const configSalva = localStorage.getItem('configuracao-impressao');
    if (configSalva) setConfig(JSON.parse(configSalva));
  }, []);

  const testarImpressao = async () => {
    setTestando(true);
    const conteudoTeste = `=================================
         TESTE DE IMPRESSÃO
=================================
Data/Hora: ${new Date().toLocaleString('pt-BR')}
Largura: ${config.largura}
Fonte: ${config.tamanhoFonte}
---------------------------------
Se você consegue ler isto,
sua impressora está funcionando.
=================================`;

    try {
      const gerenciador = GerenciadorImpressao.obterInstancia();
      const sucesso = await gerenciador.imprimir(conteudoTeste, 'Teste de Impressão', config);
      toast({
        title: sucesso ? 'Teste enviado' : 'Erro no teste',
        description: sucesso
          ? 'Verifique se foi impresso corretamente'
          : 'Falha ao enviar teste',
        variant: sucesso ? 'default' : 'destructive',
      });
    } catch {
      toast({ title: 'Erro no teste', variant: 'destructive' });
    } finally {
      setTestando(false);
    }
  };

  const salvarConfiguracoes = () => {
    localStorage.setItem('configuracao-impressao', JSON.stringify(config));
    toast({ title: 'Configurações salvas' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Impressora
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            Configurar Impressora
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Largura do papel</Label>
            <Select value={config.largura} onValueChange={(v) => setConfig({ ...config, largura: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="58mm">58mm (pequena)</SelectItem>
                <SelectItem value="80mm">80mm (padrão)</SelectItem>
                <SelectItem value="112mm">112mm (grande)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tamanho da fonte</Label>
            <Select value={config.tamanhoFonte} onValueChange={(v) => setConfig({ ...config, tamanhoFonte: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="8px">8px (pequena)</SelectItem>
                <SelectItem value="9px">9px (padrão)</SelectItem>
                <SelectItem value="10px">10px (média)</SelectItem>
                <SelectItem value="11px">11px (grande)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Margens</Label>
            <Select value={config.margens} onValueChange={(v) => setConfig({ ...config, margens: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0mm">0mm</SelectItem>
                <SelectItem value="1mm">1mm</SelectItem>
                <SelectItem value="2mm">2mm</SelectItem>
                <SelectItem value="3mm">3mm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-accent/50 p-3 text-xs text-accent-foreground">
            A impressão tenta o app <strong>POS Printer</strong> primeiro e, se não estiver disponível,
            usa a impressora padrão do navegador.
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={testarImpressao} disabled={testando} variant="outline" className="flex-1">
              <TestTube className="h-4 w-4 mr-2" />
              {testando ? 'Testando...' : 'Testar'}
            </Button>
            <Button onClick={salvarConfiguracoes} className="flex-1">
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GerenciadorImpressora;
