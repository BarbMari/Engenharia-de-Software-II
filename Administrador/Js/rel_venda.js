const tbody = document.getElementById('tabelaProdutos');
const ACOES_URL = './php/buscar_vendas.php';

let vendasCache = [];

// Carrega todos ao abrir a página
carregarvendas();

// Botão filtrar
document.getElementById('btnFiltrar').addEventListener('click', carregarvendas);

async function carregarvendas() {
    const stauts         = document.getElementById('fStatus').value;
    const dataInicio    = document.getElementById('fDataI').value;
    const dataFim      = document.getElementById('fDataF').value;

    const params = new URLSearchParams({status, dataInicio, dataFim});

    tbody.innerHTML = '<tr><td colspan="10">Carregando...</td></tr>';

    try {
        const res  = await fetch(`./php/buscar_vendas.php?${params}`);
        const json = await res.json();

        tbody.innerHTML = '';

        if (!json.sucesso) {
            tbody.innerHTML = `<tr><td colspan="10" class="sem-resultados">${json.mensagem}</td></tr>`;
            return;
        }

        vendasCache = json.vendas;

        if (vendasCache.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="sem-resultados">Nenhuma venda encontrado.</td></tr>';
            document.getElementById('totalEstoque').textContent = 'R$ 0,00';
            return;
        }

        vendasCache.forEach((p) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${formatarMoeda(p.Valor)}</td>
                <td><strong>${p.Status}</strong></td>
                <td>${formatarData(p.DataPedido)}</td>
                <td>${p.Pagamento}</td>
                <td class="acoes-tabela">
                    <button class="btn-editar" data-id="${p.id}" title="Editar">✏️</button>
                    <button class="btn-excluir" data-id="${p.id}" title="Excluir">🗑️</button>
                </td>
            `;

            tr.querySelector('.btn-editar').addEventListener('click', () => abrirModalEdicao(p));
            tr.querySelector('.btn-excluir').addEventListener('click', () => excluirvenda(p.id, p.Nome));

            tbody.appendChild(tr);
        });


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
function excluirvenda(id, nome) {
    if (!confirm(`Deseja realmente excluir a venda "${nome}"?`)) return;

    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id);

    fetch(ACOES_URL, { method: 'POST', body: formData })
        .then((resp) => resp.json())
        .then((data) => {
            if (data.sucesso) {
                carregarvendas();
            } else {
                alert('Erro ao excluir: ' + (data.mensagem || data.erro || 'tente novamente.'));
                console.error('Resposta completa:', data);
            }
        })
        .catch((err) => console.error('Erro ao excluir venda:', err));
}

/* =========================
   EDITAR (MODAL)
========================= */
const modalEditar = document.getElementById('modalEditar');

function abrirModalEdicao(venda) {
    document.getElementById('editId').value = venda.id;
    document.getElementById('editStatus').value = venda.Status;
    document.getElementById('editPagamento').value = venda.Pagamento;
    document.getElementById('editValor').value = venda.Valor;
    document.getElementById('editData').value = venda.DataPedido;

    modalEditar.style.display = 'flex';
}

document.getElementById('btnCancelarEdicao').addEventListener('click', () => {
    modalEditar.style.display = 'none';
});

document.getElementById('btnSalvarEdicao').addEventListener('click', () => {
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('id', document.getElementById('editId').value);
    formData.append('status', document.getElementById('editStatus').value);
    formData.append('data', document.getElementById('editData').value);
    formData.append('valor', document.getElementById('editValor').value);
    formData.append('pagamento', document.getElementById('editPagamento').value);

    fetch(ACOES_URL, { method: 'POST', body: formData })
        .then((resp) => resp.json())
        .then((data) => {
            if (data.sucesso) {
                modalEditar.style.display = 'none';
                carregarvendas();
            } else {
                alert('Erro ao salvar: ' + (data.mensagem || data.erro || 'tente novamente.'));
                console.error('Resposta completa:', data);
            }
        })
        .catch((err) => console.error('Erro ao salvar edição:', err));
});