const tbody = document.getElementById('tabelaProdutos');

// Carrega todos ao abrir a página
carregarProdutos();

// Botão filtrar
document.querySelector('.btn-filtrar').addEventListener('click', carregarProdutos);

async function carregarProdutos() {
    const nome        = document.querySelector('#filtros input[type="text"]').value;
    const categoria   = document.querySelectorAll('#filtros select')[0].value;
    const unidade     = document.getElementById('filtroUnidade').value;
    const status      = document.querySelectorAll('#filtros select')[2].value;
    const ordemQtd    = document.getElementById('ordenarQuantidade').value;
    const ordemPreco  = document.getElementById('ordenarPreco').value;
    const dataEntrada = document.querySelectorAll('#filtros input[type="date"]')[0].value;
    const dataValidade= document.querySelectorAll('#filtros input[type="date"]')[1].value;

    const params = new URLSearchParams({ nome, categoria, unidade, status, ordemQtd, ordemPreco, dataEntrada, dataValidade });

    tbody.innerHTML = '<tr><td colspan="9">Carregando...</td></tr>';

    try {
        const res  = await fetch(`/Engenharia-de-Software-II/Administrador/php/buscar_produtos.php?${params}`);
        const json = await res.json();

        tbody.innerHTML = '';

        if (!json.sucesso) {
            tbody.innerHTML = `<tr><td colspan="9">${json.mensagem}</td></tr>`;
            return;
        }

        if (json.produtos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9">Nenhum produto encontrado.</td></tr>';
            document.getElementById('totalEstoque').textContent = 'R$ 0,00';
            return;
        }

        json.produtos.forEach(p => {
            tbody.innerHTML += `
                <tr>
                    <td><strong>${p.Nome}</strong></td>
                    <td>${p.Categoria}</td>
                    <td>${p.Unidade}</td>
                    <td>${p.Quantidade}</td>
                    <td>${formatarMoeda(p.CustoUn)}</td>
                    <td>${formatarMoeda(p.CustoTotal)}</td>
                    <td>${formatarData(p.DataEntrega)}</td>
                    <td>${formatarData(p.DataValidade)}</td>
                    <td>${badgeStatus(p.Status)}</td>
                </tr>`;
        });

        document.getElementById('totalEstoque').textContent = formatarMoeda(json.totalEstoque);

    } catch (erro) {
        tbody.innerHTML = '<tr><td colspan="9">Erro de conexão com o servidor.</td></tr>';
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