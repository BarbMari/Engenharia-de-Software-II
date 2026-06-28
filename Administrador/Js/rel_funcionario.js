const tbody = document.getElementById('tabelaFuncionarios');
const totalEl = document.getElementById('totalFuncionarios');
const PHP_URL = '/Engenharia-de-Software-II/Administrador/php/rel_funcionario.php';
const CAD_URL = '/Engenharia-de-Software-II/Administrador/php/cad_funcionario.php';

// Carrega ao abrir
carregarFuncionarios();

// Botão filtrar
document.getElementById('btnFiltrar').addEventListener('click', carregarFuncionarios);

async function carregarFuncionarios() {
    const nome  = document.getElementById('fNome').value;
    const email = document.getElementById('fEmail').value;
    const cpf   = document.getElementById('fCpf').value;
    const cargo = document.getElementById('fCargo').value;

    const params = new URLSearchParams({ nome, email, cpf, cargo });

    tbody.innerHTML = '<tr><td colspan="7">Carregando...</td></tr>';

    try {
        const res  = await fetch(`${PHP_URL}?${params}`);
        const lista = await res.json();

        tbody.innerHTML = '';

        if (!Array.isArray(lista) || lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="sem-resultados">Nenhum funcionário encontrado.</td></tr>';
            if (totalEl) totalEl.textContent = '0';
            return;
        }

        lista.forEach(f => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${f.id}</td>
                <td>${f.NomeCompleto}</td>
                <td>${f.Email}</td>
                <td>${f.Telefone}</td>
                <td>${f.Cargo}</td>
                <td>${f.CPF}</td>
                <td>
                    <div class="acoes-tabela">
                        <button class="btn-editar" title="Editar">✏️</button>
                        <button class="btn-excluir" title="Excluir">🗑️</button>
                    </div>
                </td>
            `;

            tr.querySelector('.btn-editar').addEventListener('click', () => abrirModal(f));
            tr.querySelector('.btn-excluir').addEventListener('click', () => excluir(f.id, f.NomeCompleto));

            tbody.appendChild(tr);
        });

        if (totalEl) totalEl.textContent = lista.length;

    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" class="sem-resultados">Erro de conexão com o servidor.</td></tr>';
        console.error(err);
    }
}

/* =========================
   EXCLUIR
========================= */
async function excluir(id, nome) {
    if (!confirm(`Excluir o funcionário "${nome}"?`)) return;

    try {
        const res  = await fetch(CAD_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        const data = await res.json();
        alert(data.message || (data.success ? 'Excluído com sucesso.' : 'Erro ao excluir.'));
        if (data.success) carregarFuncionarios();
    } catch (err) {
        console.error('Erro ao excluir:', err);
    }
}

/* =========================
   MODAL DE EDIÇÃO
========================= */
const modal = document.getElementById('modalEditar');

function abrirModal(f) {
    document.getElementById('editId').value       = f.id;
    document.getElementById('editNome').value     = f.NomeCompleto;
    document.getElementById('editEmail').value    = f.Email;
    document.getElementById('editTelefone').value = f.Telefone;
    document.getElementById('editCargo').value    = f.Cargo;
    document.getElementById('editCpf').value      = f.CPF;
    modal.style.display = 'flex';
}

document.getElementById('btnCancelarEdicao').addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fechar clicando fora do modal
modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

document.getElementById('btnSalvarEdicao').addEventListener('click', async () => {
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('id',        document.getElementById('editId').value);
    formData.append('nome',      document.getElementById('editNome').value);
    formData.append('email',     document.getElementById('editEmail').value);
    formData.append('telefone',  document.getElementById('editTelefone').value);
    formData.append('cargo',     document.getElementById('editCargo').value);
    formData.append('cpf',       document.getElementById('editCpf').value);

    try {
        const res  = await fetch(CAD_URL, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success || data.sucesso) {
            modal.style.display = 'none';
            carregarFuncionarios();
        } else {
            alert('Erro ao salvar: ' + (data.message || data.mensagem || 'tente novamente.'));
        }
    } catch (err) {
        console.error('Erro ao salvar:', err);
    }
});