const tbody = document.getElementById('tabelaProdutos');
const ACOES_URL = './php/buscar_produtos.php';

let produtosCache = [];

// Carrega todos ao abrir a página
carregarProdutos();

// Botão filtrar
document.getElementById('btnFiltrar').addEventListener('click', carregarProdutos);

async function carregarProdutos() {
    const nome         = document.getElementById('fProduto').value;
    const categoria    = document.getElementById('fCategoria').value;
    const unidade      = document.getElementById('filtroUnidade').value;
    const status       = document.getElementById('fStatus').value;
    const ordemQtd     = document.getElementById('ordenarQuantidade').value;
    const ordemPreco   = document.getElementById('ordenarPreco').value;
    const dataEntrada  = document.getElementById('fDataEntrada').value;
    const dataValidade = document.getElementById('fDataValidade').value;

    const params = new URLSearchParams({ nome, categoria, unidade, status, ordemQtd, ordemPreco, dataEntrada, dataValidade });

    tbody.innerHTML = '<tr><td colspan="10">Carregando...</td></tr>';

    try {
        const res  = await fetch(`./php/buscar_produtos.php?${params}`);
        const json = await res.json();

        tbody.innerHTML = '';

        if (!json.sucesso) {
            tbody.innerHTML = `<tr><td colspan="10" class="sem-resultados">${json.mensagem}</td></tr>`;
            return;
        }

        produtosCache = json.produtos;

        if (produtosCache.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="sem-resultados">Nenhum produto encontrado.</td></tr>';
            document.getElementById('totalEstoque').textContent = 'R$ 0,00';
            return;
        }

        produtosCache.forEach((p) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${p.Nome}</strong></td>
                <td>${p.Categoria}</td>
                <td>${p.Unidade}</td>
                <td>${p.Quantidade}</td>
                <td>${formatarMoeda(p.CustoUn)}</td>
                <td>${formatarMoeda(p.CustoTotal)}</td>
                <td>${formatarData(p.DataEntrega)}</td>
                <td>${formatarData(p.DataValidade)}</td>
                <td>${badgeStatus(p.Status)}</td>
                <td class="acoes-tabela">
                    <button class="btn-editar" data-id="${p.id}" title="Editar">✏️</button>
                    <button class="btn-excluir" data-id="${p.id}" title="Excluir">🗑️</button>
                </td>
            `;

            tr.querySelector('.btn-editar').addEventListener('click', () => abrirModalEdicao(p));
            tr.querySelector('.btn-excluir').addEventListener('click', () => excluirProduto(p.id, p.Nome));

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
    document.getElementById('editNome').value = produto.Nome;
    document.getElementById('editCategoria').value = produto.Categoria;
    document.getElementById('editUnidade').value = produto.Unidade;
    document.getElementById('editQuantidade').value = produto.Quantidade;
    document.getElementById('editCusto').value = produto.CustoUn;
    document.getElementById('editDataEntrada').value = produto.DataEntrega;
    document.getElementById('editDataValidade').value = produto.DataValidade;

    modalEditar.style.display = 'flex';
}

document.getElementById('btnCancelarEdicao').addEventListener('click', () => {
    modalEditar.style.display = 'none';
});

document.getElementById('btnSalvarEdicao').addEventListener('click', () => {
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('id', document.getElementById('editId').value);
    formData.append('nome', document.getElementById('editNome').value);
    formData.append('categoria', document.getElementById('editCategoria').value);
    formData.append('unidade', document.getElementById('editUnidade').value);
    formData.append('quantidade', document.getElementById('editQuantidade').value);
    formData.append('custoUn', document.getElementById('editCusto').value);
    formData.append('dataEntrega', document.getElementById('editDataEntrada').value);
    formData.append('dataValidade', document.getElementById('editDataValidade').value);

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