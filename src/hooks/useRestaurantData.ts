import { Produto, Mesa, Comanda, VendaDia, Categoria, ItemComanda, Despesa } from '@/types/restaurant';
import { useLocalStorage } from './useLocalStorage';

export function useRestaurantData() {
  console.log('Inicializando useRestaurantData...');
  
  const produtosIniciais: Produto[] = [
    // ENTRADAS EM ALTA
    {
      id: '1',
      nome: 'Gyoza de Camarão',
      valor: 28.90,
      cmv: 9.50,
      imagem: '',
      categoria: 'Entradas',
      comentarios: ['Grelhado', 'No vapor', 'Extra molho']
    },
    {
      id: '2',
      nome: 'Tartar de Atum',
      valor: 42.90,
      cmv: 18.00,
      imagem: '',
      categoria: 'Entradas',
      comentarios: ['Picante', 'Tradicional', 'Com abacate']
    },
    {
      id: '3',
      nome: 'Edamame Trufado',
      valor: 24.90,
      cmv: 8.00,
      imagem: '',
      categoria: 'Entradas',
      comentarios: ['Com sal marinho', 'Tradicional']
    },
    {
      id: '4',
      nome: 'Sunomono de Pepino',
      valor: 18.90,
      cmv: 6.50,
      imagem: '',
      categoria: 'Entradas',
      comentarios: ['Com kani', 'Tradicional', 'Extra gengibre']
    },
    {
      id: '5',
      nome: 'Harumaki Vegano',
      valor: 22.90,
      cmv: 7.50,
      imagem: '',
      categoria: 'Entradas',
      comentarios: ['Com molho agridoce', 'Crocante']
    },
    {
      id: '6',
      nome: 'Carpaccio de Salmão',
      valor: 38.90,
      cmv: 15.50,
      imagem: '',
      categoria: 'Entradas',
      comentarios: ['Com molho cítrico', 'Tradicional']
    },

    // SASHIMIS E SUSHIS
    {
      id: '7',
      nome: 'Sashimi de Salmão',
      valor: 32.90,
      cmv: 14.00,
      imagem: '',
      categoria: 'Sashimis',
      comentarios: ['5 fatias', '8 fatias', '10 fatias']
    },
    {
      id: '8',
      nome: 'Sashimi de Atum',
      valor: 38.90,
      cmv: 17.00,
      imagem: '',
      categoria: 'Sashimis',
      comentarios: ['5 fatias', '8 fatias', '10 fatias']
    },
    {
      id: '9',
      nome: 'Combinado Sashimi',
      valor: 65.90,
      cmv: 28.00,
      imagem: '',
      categoria: 'Sashimis',
      comentarios: ['15 fatias variadas', '20 fatias variadas']
    },
    {
      id: '10',
      nome: 'Nigiri Salmão',
      valor: 8.90,
      cmv: 3.50,
      imagem: '',
      categoria: 'Sushis',
      comentarios: ['Flambado', 'Tradicional']
    },
    {
      id: '11',
      nome: 'Nigiri Atum',
      valor: 9.90,
      cmv: 4.00,
      imagem: '',
      categoria: 'Sushis',
      comentarios: ['Flambado', 'Tradicional']
    },
    {
      id: '12',
      nome: 'Nigiri Peixe Branco',
      valor: 7.90,
      cmv: 3.00,
      imagem: '',
      categoria: 'Sushis',
      comentarios: ['Tradicional', 'Com limão']
    },

    // COMBINADOS E TEMAKIS
    {
      id: '13',
      nome: 'Combinado Clássico',
      valor: 89.90,
      cmv: 35.00,
      imagem: '',
      categoria: 'Combinados',
      comentarios: ['30 peças', '40 peças', 'Sem camarão']
    },
    {
      id: '14',
      nome: 'Combinado Premium',
      valor: 125.90,
      cmv: 52.00,
      imagem: '',
      categoria: 'Combinados',
      comentarios: ['45 peças', '60 peças', 'Extra sashimi']
    },
    {
      id: '15',
      nome: 'Temaki Salmão',
      valor: 18.90,
      cmv: 7.50,
      imagem: '',
      categoria: 'Temakis',
      comentarios: ['Com cream cheese', 'Tradicional', 'Grelhado']
    },
    {
      id: '16',
      nome: 'Temaki California',
      valor: 22.90,
      cmv: 9.00,
      imagem: '',
      categoria: 'Temakis',
      comentarios: ['Com kani', 'Extra abacate']
    },
    {
      id: '17',
      nome: 'Temaki Hot Philadelphia',
      valor: 24.90,
      cmv: 10.50,
      imagem: '',
      categoria: 'Temakis',
      comentarios: ['Picante', 'Tradicional']
    },

    // PRATOS QUENTES
    {
      id: '18',
      nome: 'Lamen Shoyu',
      valor: 38.90,
      cmv: 15.00,
      imagem: '',
      categoria: 'Pratos Quentes',
      comentarios: ['Com chashu', 'Vegano', 'Extra ovo']
    },
    {
      id: '19',
      nome: 'Lamen Missô',
      valor: 42.90,
      cmv: 17.50,
      imagem: '',
      categoria: 'Pratos Quentes',
      comentarios: ['Picante', 'Tradicional', 'Com gyoza']
    },
    {
      id: '20',
      nome: 'Yakisoba de Frango',
      valor: 32.90,
      cmv: 12.50,
      imagem: '',
      categoria: 'Pratos Quentes',
      comentarios: ['Com legumes', 'Picante', 'Extra molho']
    },
    {
      id: '21',
      nome: 'Yakisoba de Camarão',
      valor: 38.90,
      cmv: 16.00,
      imagem: '',
      categoria: 'Pratos Quentes',
      comentarios: ['Com legumes', 'Picante']
    },
    {
      id: '22',
      nome: 'Salmão Teriyaki',
      valor: 45.90,
      cmv: 19.50,
      imagem: '',
      categoria: 'Pratos Quentes',
      comentarios: ['Com arroz', 'Com legumes', 'Extra molho']
    },
    {
      id: '23',
      nome: 'Frango Teriyaki',
      valor: 34.90,
      cmv: 13.50,
      imagem: '',
      categoria: 'Pratos Quentes',
      comentarios: ['Com arroz', 'Com legumes']
    },
    {
      id: '24',
      nome: 'Tempurá de Camarão',
      valor: 42.90,
      cmv: 18.00,
      imagem: '',
      categoria: 'Pratos Quentes',
      comentarios: ['6 unidades', '10 unidades', 'Com legumes']
    },

    // DRINKS CLÁSSICOS
    {
      id: '25',
      nome: 'Caipirinha',
      valor: 16.90,
      cmv: 5.50,
      imagem: '',
      categoria: 'Drinks',
      comentarios: ['Limão', 'Morango', 'Kiwi', 'Maracujá']
    },
    {
      id: '26',
      nome: 'Mojito',
      valor: 18.90,
      cmv: 6.50,
      imagem: '',
      categoria: 'Drinks',
      comentarios: ['Tradicional', 'Morango', 'Maracujá']
    },
    {
      id: '27',
      nome: 'Cosmopolitan',
      valor: 22.90,
      cmv: 8.00,
      imagem: '',
      categoria: 'Drinks',
      comentarios: ['Clássico', 'Com cranberry']
    },
    {
      id: '28',
      nome: 'Whiskey Sour',
      valor: 24.90,
      cmv: 9.50,
      imagem: '',
      categoria: 'Drinks',
      comentarios: ['Tradicional', 'Com egg white']
    },
    {
      id: '29',
      nome: 'Old Fashioned',
      valor: 28.90,
      cmv: 12.00,
      imagem: '',
      categoria: 'Drinks',
      comentarios: ['Bourbon', 'Rye whiskey']
    },
    {
      id: '30',
      nome: 'Gin Tônica',
      valor: 19.90,
      cmv: 7.00,
      imagem: '',
      categoria: 'Drinks',
      comentarios: ['Pepino', 'Limão siciliano', 'Tradicional']
    },

    // BEBIDAS
    {
      id: '31',
      nome: 'Sake Tradicional',
      valor: 12.90,
      cmv: 4.50,
      imagem: '',
      categoria: 'Bebidas',
      comentarios: ['Quente', 'Gelado', 'Premium']
    },
    {
      id: '32',
      nome: 'Cerveja Asahi',
      valor: 9.90,
      cmv: 3.50,
      imagem: '',
      categoria: 'Bebidas',
      comentarios: ['Long neck', 'Lata']
    },
    {
      id: '33',
      nome: 'Refrigerante',
      valor: 6.90,
      cmv: 2.50,
      imagem: '',
      categoria: 'Bebidas',
      comentarios: ['Coca-Cola', 'Guaraná', 'Sprite']
    },
    {
      id: '34',
      nome: 'Água com Gás',
      valor: 4.90,
      cmv: 1.80,
      imagem: '',
      categoria: 'Bebidas',
      comentarios: ['Perrier', 'São Pellegrino']
    },
    {
      id: '35',
      nome: 'Chá Verde',
      valor: 8.90,
      cmv: 3.00,
      imagem: '',
      categoria: 'Bebidas',
      comentarios: ['Tradicional', 'Com jasmim', 'Gelado']
    },

    // SOBREMESAS EM ALTA
    {
      id: '36',
      nome: 'Mochi de Sorvete',
      valor: 18.90,
      cmv: 6.50,
      imagem: '',
      categoria: 'Sobremesas',
      comentarios: ['Baunilha', 'Chocolate', 'Morango', 'Chá verde']
    },
    {
      id: '37',
      nome: 'Dorayaki',
      valor: 16.90,
      cmv: 5.50,
      imagem: '',
      categoria: 'Sobremesas',
      comentarios: ['Nutella', 'Doce de leite', 'Tradicional']
    },
    {
      id: '38',
      nome: 'Cheesecake Japonês',
      valor: 22.90,
      cmv: 8.50,
      imagem: '',
      categoria: 'Sobremesas',
      comentarios: ['Tradicional', 'Matcha', 'Frutas vermelhas']
    },
    {
      id: '39',
      nome: 'Sorvete Tempurá',
      valor: 19.90,
      cmv: 7.00,
      imagem: '',
      categoria: 'Sobremesas',
      comentarios: ['Baunilha', 'Chocolate']
    },
    {
      id: '40',
      nome: 'Kakigori (Raspadinha)',
      valor: 14.90,
      cmv: 4.50,
      imagem: '',
      categoria: 'Sobremesas',
      comentarios: ['Morango', 'Manga', 'Matcha', 'Leite condensado']
    }
  ];

  // Verificar se já existe produtos no localStorage - se sim, limpar e recarregar
  const produtosAtuais = localStorage.getItem('produtos');
  if (produtosAtuais) {
    const produtosParsed = JSON.parse(produtosAtuais);
    console.log('Produtos atuais no localStorage:', produtosParsed.length);
    
    // Se ainda são os produtos antigos (menos de 40), forçar atualização
    if (produtosParsed.length < 40) {
      console.log('Forçando atualização do cardápio...');
      localStorage.setItem('produtos', JSON.stringify(produtosIniciais));
    }
  }

  const [produtos, setProdutos] = useLocalStorage<Produto[]>('produtos', produtosIniciais);

  console.log('Produtos carregados:', produtos.length, 'produtos');
  console.log('Primeiros 5 produtos:', produtos.slice(0, 5).map(p => ({ nome: p.nome, categoria: p.categoria, valor: p.valor })));
  console.log('Categorias disponíveis:', [...new Set(produtos.map(p => p.categoria))]);

  const [categorias, setCategorias] = useLocalStorage<Categoria[]>('categorias', []);

  const [mesas, setMesas] = useLocalStorage<Mesa[]>('mesas', 
    Array.from({ length: 100 }, (_, i) => ({
      numero: i + 1,
      status: 'disponivel' as const,
      comanda_id: undefined
    }))
  );

  const [comandas, setComandas] = useLocalStorage<Comanda[]>('comandas', []);

  const [vendas, setVendas] = useLocalStorage<VendaDia[]>('vendas', []);

  const [despesas, setDespesas] = useLocalStorage<Despesa[]>('despesas', []);

  // Converter datas string para objetos Date nas vendas carregadas
  const vendasComDataConvertida = vendas.map(venda => ({
    ...venda,
    data: typeof venda.data === 'string' ? new Date(venda.data) : venda.data
  }));

  // Converter datas string para objetos Date nas despesas carregadas
  const despesasComDataConvertida = despesas.map(despesa => ({
    ...despesa,
    data: typeof despesa.data === 'string' ? new Date(despesa.data) : despesa.data
  }));

  const adicionarProduto = (produto: Produto) => {
    setProdutos([...produtos, produto]);
  };

  const adicionarCategoria = (categoria: Categoria) => {
    setCategorias([...categorias, categoria]);
  };

  const removerCategoria = (id: string) => {
    setCategorias(categorias.filter(cat => cat.id !== id));
  };

  const atualizarComanda = (comandaAtualizada: Comanda) => {
    console.log('Atualizando comanda:', comandaAtualizada);
    const novasComandas = comandas.map(c => c.id === comandaAtualizada.id ? comandaAtualizada : c);
    setComandas(novasComandas);
  };

  const fecharComanda = (venda: VendaDia, comandaId: string, mesaNumero: number) => {
    console.log('Fechando comanda:', comandaId, 'Mesa:', mesaNumero);
    
    // Garantir que a data seja um objeto Date antes de salvar
    const vendaComDataCorreta = {
      ...venda,
      data: new Date()
    };
    
    setVendas([...vendas, vendaComDataCorreta]);
    
    // Atualizar o status da comanda para fechada
    const comandasAtualizadas = comandas.map(c => 
      c.id === comandaId ? { ...c, status: 'fechada' as const } : c
    );
    setComandas(comandasAtualizadas);
    
    // Liberar a mesa
    const mesasAtualizadas = mesas.map(m => 
      m.numero === mesaNumero 
        ? { ...m, status: 'disponivel' as const, comanda_id: undefined }
        : m
    );
    setMesas(mesasAtualizadas);
    
    console.log('Comanda fechada com sucesso');
  };

  const excluirMesa = (comandaId: string, mesaNumero: number) => {
    console.log('Excluindo mesa:', mesaNumero, 'Comanda:', comandaId);
    
    const comanda = comandas.find(c => c.id === comandaId);
    if (!comanda) {
      console.error('Comanda não encontrada');
      return;
    }

    // Calcular o valor total do CMV dos itens
    const valorCMV = comanda.itens.reduce((total, item) => {
      const produto = produtos.find(p => p.nome === item.produto_nome || item.produto_nome.startsWith(p.nome));
      return total + ((produto?.cmv || 0) * item.quantidade);
    }, 0);

    // Criar despesa com o CMV
    const novaDespesa: Despesa = {
      id: Date.now().toString(),
      descricao: `Cancelamento Mesa ${mesaNumero}`,
      valor: valorCMV,
      tipo: 'cancelamento_mesa',
      itens: [...comanda.itens],
      mesa: mesaNumero,
      data: new Date()
    };

    setDespesas([...despesas, novaDespesa]);

    // Remover a comanda
    const comandasAtualizadas = comandas.filter(c => c.id !== comandaId);
    setComandas(comandasAtualizadas);

    // Liberar a mesa
    const mesasAtualizadas = mesas.map(m => 
      m.numero === mesaNumero 
        ? { ...m, status: 'disponivel' as const, comanda_id: undefined }
        : m
    );
    setMesas(mesasAtualizadas);

    console.log('Mesa excluída com sucesso. Despesa de CMV:', valorCMV);
  };

  const abrirMesa = (novaComanda: Comanda) => {
    console.log('Abrindo nova mesa:', novaComanda);
    setComandas([...comandas, novaComanda]);
    
    const mesasAtualizadas = mesas.map(m => 
      m.numero === novaComanda.mesa 
        ? { ...m, status: 'ocupada' as const, comanda_id: novaComanda.id }
        : m
    );
    setMesas(mesasAtualizadas);
  };

  const fecharMesaVazia = (comandaId: string, mesaNumero: number) => {
    console.log('Fechando mesa vazia:', mesaNumero, 'Comanda:', comandaId);
    
    // Remover a comanda sem registrar venda
    const comandasAtualizadas = comandas.filter(c => c.id !== comandaId);
    setComandas(comandasAtualizadas);
    
    // Liberar a mesa
    const mesasAtualizadas = mesas.map(m => 
      m.numero === mesaNumero 
        ? { ...m, status: 'disponivel' as const, comanda_id: undefined }
        : m
    );
    setMesas(mesasAtualizadas);
    
    console.log('Mesa vazia fechada com sucesso');
  };

  // Função para obter comanda atualizada por ID
  const obterComandaAtualizada = (comandaId: string): Comanda | null => {
    return comandas.find(c => c.id === comandaId) || null;
  };

  return {
    produtos,
    categorias,
    mesas,
    comandas,
    vendas: vendasComDataConvertida,
    despesas: despesasComDataConvertida,
    adicionarProduto,
    adicionarCategoria,
    removerCategoria,
    atualizarComanda,
    fecharComanda,
    excluirMesa,
    abrirMesa,
    fecharMesaVazia,
    obterComandaAtualizada
  };
}
