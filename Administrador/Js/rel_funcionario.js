const tbody = document.getElementById('tabelaFuncionarios');
const totalEl = document.getElementById('totalFuncionarios');
const PHP_URL = '/Engenharia-de-Software-II/Administrador/php/rel_funcionario.php';
const CAD_URL = '/Engenharia-de-Software-II/Administrador/php/cad_funcionario.php';

const pesosHierarquia = {
    'Gerente': 1, 'Administrador': 2, 'Administração': 2,
    'Caixa': 3, 'Pizzaiolo': 4, 'Motoboy': 5,
    'Faxineiro': 6, 'Aprendiz': 7, 'Cozinha': 8
};

carregarFuncionarios();

document.getElementById('btnFiltrar').addEventListener('click', carregarFuncionarios);

async function carregarFuncionarios() {
    const nome  = document.getElementById('fNome').value;
    const email = document.getElementById('fEmail').value;
    const cpf   = document.getElementById('fCpf').value;
    const cargo = document.getElementById('fCargo').value;

    const params = new URLSearchParams({ nome, email, cpf, cargo, });

    tbody.innerHTML = '<tr><td colspan="7">Carregando...</td></tr>';

    try {
        const res   = await fetch(`${PHP_URL}?${params}`);
        let lista   = await res.json();

        tbody.innerHTML = '';

        if (!Array.isArray(lista) || lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="sem-resultados">Nenhum funcionário encontrado.</td></tr>';
            if (totalEl) totalEl.textContent = '0';
            return;
        }

        const ordemId    = document.getElementById('ordemId').value;
        const ordemCargo = document.getElementById('ordemCargo').value;

        if (ordemId === 'asc')  lista.sort((a, b) => a.id - b.id);
        if (ordemId === 'desc') lista.sort((a, b) => b.id - a.id);

        if (ordemCargo === 'asc')  lista.sort((a, b) => (pesosHierarquia[a.Cargo] || 99) - (pesosHierarquia[b.Cargo] || 99));
        if (ordemCargo === 'desc') lista.sort((a, b) => (pesosHierarquia[b.Cargo] || 99) - (pesosHierarquia[a.Cargo] || 99));

        lista.forEach((f, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
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
        tbody.innerHTML = '<tr><td colspan="7" class="sem-resultados">Erro ao carregar dados.</td></tr>';
        console.error(err);
    }
}

async function excluir(id, nome) {
    if (!confirm(`Excluir o funcionário "${nome}"?`)) return;

    try {
        const res  = await fetch(CAD_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) carregarFuncionarios();
    } catch (err) {
        console.error('Erro ao excluir:', err);
    }
}

const modal = document.getElementById('modalEditar');

function abrirModal(f) {
    document.getElementById('editId').value       = f.id;
    document.getElementById('editNome').value     = f.NomeCompleto;
    document.getElementById('editEmail').value    = f.Email;
    document.getElementById('editTelefone').value = f.Telefone;
    document.getElementById('editCargo').value    = f.Cargo;
    document.getElementById('editCpf').value      = f.CPF;
    document.getElementById('editUsuario').value  = f.Usuario;
    document.getElementById('editSenha').value    = f.Senha;
    modal.style.display = 'flex';
}

document.getElementById('btnCancelarEdicao').addEventListener('click', () => modal.style.display = 'none');
modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

// ===================================================
// FUNÇÃO DE SALVAR CORRIGIDA
// ================================================
document.getElementById('btnSalvarEdicao').addEventListener('click', async () => {
    const payload = {
        id: document.getElementById('editId').value,
        NomeCompleto: document.getElementById('editNome').value,
        Email: document.getElementById('editEmail').value,
        Telefone: document.getElementById('editTelefone').value,
        Cargo: document.getElementById('editCargo').value,
        CPF: document.getElementById('editCpf').value,
        Usuario: document.getElementById('editUsuario').value,
        Senha: document.getElementById('editSenha').value
    };

    try {
        const res = await fetch(CAD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        
        if (data.success) {
            modal.style.display = 'none';
            alert('Atualizado com sucesso!');
            carregarFuncionarios();
        } else {
            alert('Erro ao salvar: ' + (data.message || 'Erro desconhecido.'));
        }
    } catch (err) {
        console.error('Erro na requisição:', err);
        alert('Erro ao conectar com o servidor.');
    }
});