const tbody = document.querySelector('#tabelaGestao tbody');

// ── Filtros ───────────────────────────────────────────────────────────────────
const inputNome        = document.querySelector('#filtros input[type="text"]');
const selects          = document.querySelectorAll('#filtros select');
const selectTipo       = selects[0];
const selectIngrediente= selects[2];
const selectOrdemPreco = selects[3];

document.querySelector('.btn-filtrar').addEventListener('click', carregarSabores);

// Carrega ao abrir
carregarSabores();

async function carregarSabores() {
    const params = new URLSearchParams({
        nome:        inputNome.value.trim(),
        tipo:        selectTipo.value,
        ingrediente: selectIngrediente.value,
        ordemPreco:  selectOrdemPreco.value,
    });

    tbody.innerHTML = '<tr><td colspan="7">Carregando...</td></tr>';

    try {
        const res  = await fetch(`/Engenharia-de-Software-II/Administrador/php/rel_sabores_gestao.php?${params}`);
        const json = await res.json();

        tbody.innerHTML = '';

        if (!json.sucesso) {
            tbody.innerHTML = `<tr><td colspan="7">${json.mensagem}</td></tr>`;
            return;
        }
        if (json.itens.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Nenhum sabor encontrado.</td></tr>';
            return;
        }

        json.itens.forEach(item => {
            tbody.innerHTML += `
                <tr data-id="${item.id}">
                    <td data-field="Nome"><strong>${item.Nome}</strong></td>
                    <td data-field="Tipo">${item.Tipo}</td>
                    <td data-field="Resumo">${item.Resumo ?? '-'}</td>
                    <td data-field="Igredientes">${item.Igredientes ?? '-'}</td>
                    <td data-field="Valor">R$ ${Number(item.Valor).toFixed(2).replace('.', ',')}</td>
                    <td class="acoes-coluna">
                        <button class="btn-edit"    onclick="editarLinha(this)">Editar</button>
                        <button class="btn-salvar"  onclick="salvarLinha(this)" style="display:none">Salvar</button>
                        <button class="btn-excluir" onclick="excluirLinha(this)">Excluir</button>
                    </td>
                </tr>`;
        });

    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7">Erro de conexão com o servidor.</td></tr>';
        console.error(err);
    }
}

// ── Editar linha inline ───────────────────────────────────────────────────────
function editarLinha(btn) {
    const tr     = btn.closest('tr');
    const campos = ['Nome', 'Tipo', 'Resumo', 'Igredientes', 'Valor'];

    campos.forEach(field => {
        const td  = tr.querySelector(`[data-field="${field}"]`);
        const val = td.textContent.trim().replace('R$ ', '').replace(',', '.');
        td.innerHTML = `<input value="${val}" style="width:100%;padding:4px;border:1px solid #afcfb4;border-radius:4px" />`;
    });

    btn.style.display = 'none';
    tr.querySelector('.btn-salvar').style.display = 'inline-block';
}

// ── Salvar linha editada ──────────────────────────────────────────────────────
async function salvarLinha(btn) {
    const tr = btn.closest('tr');
    const id = tr.dataset.id;

    const dados = {
        id,
        Nome:        tr.querySelector('[data-field="Nome"] input').value,
        Tipo:        tr.querySelector('[data-field="Tipo"] input').value,
        Resumo:      tr.querySelector('[data-field="Resumo"] input').value,
        Igredientes: tr.querySelector('[data-field="Igredientes"] input').value,
        Valor:       tr.querySelector('[data-field="Valor"] input').value,
    };

    try {
        const res  = await fetch('/Engenharia-de-Software-II/Administrador/php/editar_sabor.php', {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(dados),
        });
        const json = await res.json();
        alert(json.mensagem);
        if (json.sucesso) carregarSabores();
    } catch (err) {
        alert('Erro de conexão.');
    }
}

// ── Excluir linha ─────────────────────────────────────────────────────────────
async function excluirLinha(btn) {
    if (!confirm('Excluir este sabor?')) return;

    const id = btn.closest('tr').dataset.id;

    try {
        const res  = await fetch('/Engenharia-de-Software-II/Administrador/php/editar_sabor.php', {
            method:  'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ id }),
        });
        const json = await res.json();
        alert(json.mensagem);
        if (json.sucesso) carregarSabores();
    } catch (err) {
        alert('Erro de conexão.');
    }
}