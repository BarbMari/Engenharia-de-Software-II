const tbody = document.getElementById('tabelaProdutos');
const ACOES_URL = './php/buscar_pedidos.php';

let produtosCache = [];

// Carrega todos ao abrir a página
carregarProdutos();

// Botão filtrar
document.getElementById('btnFiltrar').addEventListener('click', carregarProdutos);

async function carregarProdutos() {
    const nomeP         = document.getElementById('fNPedido').value;
    const nomeC         = document.getElementById('fNCliente').value;
    const pagamento    = document.getElementById('fPagamento').value;
    const status       = document.getElementById('fStatus').value;

    const params = new URLSearchParams({nomeP, nomeC, pagamento, status});

    tbody.innerHTML = '<tr><td colspan="10">Carregando...</td></tr>';

    try {
        const res  = await fetch(`./php/buscar_pedidos.php?${params}`);
        const json = await res.json();

        tbody.innerHTML = '';

        if (!json.sucesso) {
            tbody.innerHTML = `<tr><td colspan="10" class="sem-resultados">${json.mensagem}</td></tr>`;
            return;
        }

        pedidosCache = json.pedidos;

        if (pedidosCache.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="sem-resultados">Nenhum produto encontrado.</td></tr>';
            document.getElementById('totalEstoque').textContent = 'R$ 0,00';
            return;
        }

        pedidosCache.forEach((p) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${p.NomePedido}</strong></td>
                <td>${p.NomeCliente}</td>
                <td>${formatarMoeda(p.Valor)}</td>
                <td>${p.Itens}</td>
                <td>${p.Observacoes}</td>
                <td>${p.Pagamento}</td>
                <td>${p.Status}</td>
                <td class="acoes-tabela">
                    <button class="btn-editar" data-id="${p.id}" title="Editar">✏️</button>
                    <button class="btn-excluir" data-id="${p.id}" title="Excluir">🗑️</button>
                </td>
            `;

            tr.querySelector('.btn-editar').addEventListener('click', () => abrirModalEdicao(p));
            tr.querySelector('.btn-excluir').addEventListener('click', () => excluirProduto(p.id, p.NomePedido));

            tbody.appendChild(tr);
        });

        document.getElementById('totalEstoque').textContent = formatarMoeda(json.totalEstoque);

    } catch (erro) {
        tbody.innerHTML = '<tr><td colspan="10" class="sem-resultados">Erro de conexão com o servidor.</td></tr>';
        console.error(erro);
    }
}

function formatarData(dataISO) {
    if (!dataISO) return '-';
    const [y, m, d] = dataISO.split('-');
    return `${d}/${m}/${y}`;
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function badgeStatus(status) {
    const classes = {
        'Disponível':    'status-ok',
        'Baixo estoque': 'status-baixo',
        'Sem estoque':   'status-sem',
    };
    return `<span class="status ${classes[status] || ''}">${status}</span>`;
}

/* =========================
   EXCLUIR
========================= */
function excluirProduto(id, nome) {
    if (!confirm(`Deseja realmente excluir o produto "${nome}"?`)) return;

    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id);

    fetch(ACOES_URL, { method: 'POST', body: formData })
        .then((resp) => resp.json())
        .then((data) => {
            if (data.sucesso) {
                carregarProdutos();
            } else {
                alert('Erro ao excluir: ' + (data.mensagem || data.erro || 'tente novamente.'));
                console.error('Resposta completa:', data);
            }
        })
        .catch((err) => console.error('Erro ao excluir produto:', err));
}

/* =========================
   EDITAR (MODAL)
========================= */
const modalEditar = document.getElementById('modalEditar');

function abrirModalEdicao(produto) {
    document.getElementById('editId').value = produto.id;
    document.getElementById('editNomeP').value = produto.NomePedido;
    document.getElementById('editNomeC').value = produto.NomeCliente;
    document.getElementById('editPagamento').value = produto.Pagamento;
    document.getElementById('editQuantidade').value = produto.Valor;
    document.getElementById('editObs').value = produto.Observacoes;
    document.getElementById('editItens').value = produto.Itens;
    document.getElementById('editStatus').value = produto.Status;

    modalEditar.style.display = 'flex';
}

document.getElementById('btnCancelarEdicao').addEventListener('click', () => {
    modalEditar.style.display = 'none';
});

document.getElementById('btnSalvarEdicao').addEventListener('click', () => {
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('id', document.getElementById('editId').value);
    formData.append('nomeP', document.getElementById('editNomeP').value);
    formData.append('nomeC', document.getElementById('editNomeC').value);
    formData.append('pagamento', document.getElementById('editPagamento').value);
    formData.append('valor', document.getElementById('editQuantidade').value);
    formData.append('obs', document.getElementById('editObs').value);
    formData.append('itens', document.getElementById('editItens').value);
    formData.append('status', document.getElementById('editStatus').value);

    fetch(ACOES_URL, { method: 'POST', body: formData })
        .then((resp) => resp.json())
        .then((data) => {
            if (data.sucesso) {
                modalEditar.style.display = 'none';
                carregarProdutos();
            } else {
                alert('Erro ao salvar: ' + (data.mensagem || data.erro || 'tente novamente.'));
                console.error('Resposta completa:', data);
            }
        })
        .catch((err) => console.error('Erro ao salvar edição:', err));
});