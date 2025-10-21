// Configuração dos itens
const itensConfig = {
    limpeza: [
        { id: 'limpadorMultiUso', label: 'Limpador Multi uso (veja/Similar)', placeholder: 'Ex: 4UND' },
        { id: 'papelHigienico', label: 'Papel Higiênico', placeholder: 'Ex: 3 fardos' },
        { id: 'aguaSanitaria', label: 'Água Sanitária', placeholder: 'Ex: 1 CX' },
        { id: 'detergenteIpe', label: 'Detergente (Ipê)', placeholder: 'Ex: 1 CX' },
        { id: 'polidorAluminio', label: 'Polidor de Alumínio', placeholder: 'Ex: 2UND' },
        { id: 'sabaoEmPo', label: 'Sabão em Pó', placeholder: 'Ex: 6UNID' },
        { id: 'cheirinhoAtol', label: 'Cheirinho ATOL', placeholder: 'Ex: 5UND' },
        { id: 'sacoLixo100L', label: 'Saco para Lixo 100L', placeholder: 'Ex: 2 FARDOS' },
        { id: 'bobinaTransparente', label: 'Bobina Sacola Transparente 30x40', placeholder: 'Ex: 2UNID' },
        { id: 'touca', label: 'Touca', placeholder: 'Ex: 2UNID' },
        { id: 'desinfetante', label: 'Desinfetante', placeholder: 'Ex: 2' },
        { id: 'esponja', label: 'Esponja', placeholder: 'Ex: 2 PCT/3 UND' },
        { id: 'bomBril', label: 'Bom Bril', placeholder: 'Ex: 2UND' }
    ],
    alimentos: [
        { id: 'feijao', label: 'Feijão', placeholder: 'Ex: 1 FARDO' },
        { id: 'macarrao', label: 'Macarrão', placeholder: 'Ex: 1 FARDO' },
        { id: 'acucar', label: 'Açúcar', placeholder: 'Ex: 1 FARDO' },
        { id: 'farinhaMandioca', label: 'Farinha de Mandioca', placeholder: 'Ex: 3 kg' },
        { id: 'fubaFlocao', label: 'Fubá-Flocão', placeholder: 'Ex: 9 Pacotes' },
        { id: 'oleoSoja', label: 'Óleo de Soja', placeholder: 'Ex: 1 unidade' },
        { id: 'vinagre', label: 'Vinagre', placeholder: 'Ex: 1 unidade' },
        { id: 'sal', label: 'Sal', placeholder: 'Ex: 2KG' },
        { id: 'extratoTomate', label: 'Extrato de Tomate', placeholder: 'Ex: 3 UNIDADES' },
        { id: 'biscoitoMaizena', label: 'Biscoito Maizena', placeholder: 'Ex: 1 caixa com 20 unid.' },
        { id: 'gelatina', label: 'Gelatina', placeholder: 'Ex: 1 CAIXA' },
        { id: 'leiteCoco', label: 'Leite de Coco', placeholder: 'Ex: 1' },
        { id: 'leiteEmPo', label: 'Leite em Pó', placeholder: 'Ex: 2 pacotes 400g' },
        { id: 'bolachaCreamCraker', label: 'Bolacha Cream Craker', placeholder: 'Ex: 3' },
        { id: 'margarina', label: 'Margarina', placeholder: 'Ex: 1 pote 3kg' },
        { id: 'alho', label: 'Alho', placeholder: 'Ex: 1' },
        { id: 'cafe', label: 'Café', placeholder: 'Ex: 2 pacotes 500g' },
        { id: 'preparoBolo', label: 'Preparo para Bolo (Baunilha)', placeholder: 'Ex: 2 pacotes' }
    ]
};

// Estado da aplicação
let pedidos = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    inicializarFormulario();
    carregarPedidos();
    configurarEventos();
    
    // Definir data atual
    document.getElementById('inputData').valueAsDate = new Date();
});

// Criar campos do formulário
function inicializarFormulario() {
    // Grid de Limpeza
    const gridLimpeza = document.getElementById('gridLimpeza');
    itensConfig.limpeza.forEach(item => {
        gridLimpeza.innerHTML += criarCampoInput(item);
    });

    // Grid de Alimentos
    const gridAlimentos = document.getElementById('gridAlimentos');
    itensConfig.alimentos.forEach(item => {
        gridAlimentos.innerHTML += criarCampoInput(item);
    });
}

function criarCampoInput(item) {
    return `
        <div class="form-group">
            <label>${item.label}</label>
            <input 
                type="text" 
                id="${item.id}" 
                placeholder="${item.placeholder}" 
                class="form-control"
            />
        </div>
    `;
}

// Configurar eventos
function configurarEventos() {
    document.getElementById('btnFormulario').addEventListener('click', () => mudarTela('formulario'));
    document.getElementById('btnHistorico').addEventListener('click', () => mudarTela('historico'));
    document.getElementById('btnEnviar').addEventListener('click', enviarPedido);
}

// Mudar tela
function mudarTela(tela) {
    // Atualizar botões
    document.getElementById('btnFormulario').classList.remove('active');
    document.getElementById('btnHistorico').classList.remove('active');
    
    if (tela === 'formulario') {
        document.getElementById('btnFormulario').classList.add('active');
        document.getElementById('telaFormulario').classList.add('active');
        document.getElementById('telaHistorico').classList.remove('active');
    } else {
        document.getElementById('btnHistorico').classList.add('active');
        document.getElementById('telaFormulario').classList.remove('active');
        document.getElementById('telaHistorico').classList.add('active');
        renderizarHistorico();
    }
}

// Enviar pedido
function enviarPedido() {
    const nome = document.getElementById('inputNome').value.trim();
    const setor = document.getElementById('inputSetor').value;
    const data = document.getElementById('inputData').value;
    const observacoes = document.getElementById('inputObservacoes').value.trim();

    // Validações
    if (!nome) {
        alert('Por favor, informe o nome do solicitante');
        document.getElementById('inputNome').focus();
        return;
    }

    if (!setor) {
        alert('Por favor, informe o setor');
        document.getElementById('inputSetor').focus();
        return;
    }

    // Coletar itens preenchidos
    const itens = [];
    const todosItens = [...itensConfig.limpeza, ...itensConfig.alimentos];
    
    todosItens.forEach(item => {
        const input = document.getElementById(item.id);
        if (input && input.value.trim() !== '') {
            itens.push({
                nome: item.label,
                quantidade: input.value.trim()
            });
        }
    });

    if (itens.length === 0) {
        alert('Por favor, preencha pelo menos um item');
        return;
    }

    // Criar pedido
    const pedido = {
        id: Date.now(),
        data: data,
        nome: nome,
        setor: setor,
        itens: itens,
        observacoes: observacoes,
        status: 'Pendente'
    };

    // Salvar pedido
    pedidos.unshift(pedido);
    salvarPedidos();

    // Limpar formulário
    limparFormulario();

    // Mostrar mensagem e ir para histórico
    alert('✅ Pedido enviado com sucesso!');
    mudarTela('historico');
}

// Limpar formulário
function limparFormulario() {
    document.getElementById('inputNome').value = '';
    document.getElementById('inputSetor').value = '';
    document.getElementById('inputData').valueAsDate = new Date();
    document.getElementById('inputObservacoes').value = '';

    const todosItens = [...itensConfig.limpeza, ...itensConfig.alimentos];
    todosItens.forEach(item => {
        const input = document.getElementById(item.id);
        if (input) input.value = '';
    });
}

// Renderizar histórico
function renderizarHistorico() {
    const container = document.getElementById('listaPedidos');
    
    if (pedidos.length === 0) {
        container.innerHTML = '<div class="lista-vazia">Nenhum pedido registrado ainda.</div>';
        return;
    }

    container.innerHTML = pedidos.map(pedido => `
        <div class="pedido-item">
            <div class="pedido-header">
                <div class="pedido-info">
                    <div class="pedido-id">Pedido #${pedido.id.toString().slice(-6)}</div>
                    <div class="pedido-detalhe">📅 ${formatarData(pedido.data)}</div>
                    <div class="pedido-detalhe">👤 ${pedido.nome}</div>
                    <div class="pedido-detalhe">🏢 ${pedido.setor}</div>
                </div>
                <select 
                    class="status-select ${getClasseStatus(pedido.status)}"
                    onchange="atualizarStatus(${pedido.id}, this.value)"
                >
                    <option value="Pendente" ${pedido.status === 'Pendente' ? 'selected' : ''}>⏳ Pendente</option>
                    <option value="Em Andamento" ${pedido.status === 'Em Andamento' ? 'selected' : ''}>🔄 Em Andamento</option>
                    <option value="Concluído" ${pedido.status === 'Concluído' ? 'selected' : ''}>✅ Concluído</option>
                </select>
            </div>
            
            <div class="pedido-itens">
                <div class="itens-titulo">Itens solicitados (${pedido.itens.length}):</div>
                <ul class="item-lista">
                    ${pedido.itens.map(item => `
                        <li><span class="item-nome">${item.nome}:</span> ${item.quantidade}</li>
                    `).join('')}
                </ul>
            </div>
            
            ${pedido.observacoes ? `
                <div class="pedido-obs">
                    <span class="pedido-obs-titulo">Observações:</span>
                    ${pedido.observacoes}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Atualizar status do pedido
function atualizarStatus(pedidoId, novoStatus) {
    const index = pedidos.findIndex(p => p.id === pedidoId);
    if (index !== -1) {
        pedidos[index].status = novoStatus;
        salvarPedidos();
        renderizarHistorico();
    }
}

// Obter classe CSS do status
function getClasseStatus(status) {
    switch(status) {
        case 'Pendente': return 'status-pendente';
        case 'Em Andamento': return 'status-andamento';
        case 'Concluído': return 'status-concluido';
        default: return 'status-pendente';
    }
}

// Formatar data
function formatarData(dataStr) {
    const data = new Date(dataStr + 'T00:00:00');
    return data.toLocaleDateString('pt-BR');
}

// Salvar pedidos no localStorage
function salvarPedidos() {
    localStorage.setItem('pedidos_talentinho', JSON.stringify(pedidos));
}

// Carregar pedidos do localStorage
function carregarPedidos() {
    const pedidosSalvos = localStorage.getItem('pedidos_talentinho');
    if (pedidosSalvos) {
        pedidos = JSON.parse(pedidosSalvos);
    }
}