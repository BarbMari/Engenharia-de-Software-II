const tbody = document.getElementById('tabelaFuncionarios');

// Carrega todos ao abrir a página
carregarFuncionarios();

// Botão filtrar
document.querySelector('.btn-filtrar').addEventListener('click', carregarFuncionarios);

async function carregarFuncionarios() {
    const inputs  = document.querySelectorAll('#filtros input, #filtros select');
    const nome    = inputs[0].value;
    const email   = inputs[1].value;
    const cpf     = inputs[2].value;
    const cargo   = inputs[3].value;

    const params = new URLSearchParams({ nome, email, cpf, cargo });
    const res    = await fetch(`/Engenharia-de-Software-II/Administrador/php/rel_funcionario.php?${params}`);
    const lista  = await res.json();

    tbody.innerHTML = '';

    if (lista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Nenhum funcionário encontrado.</td></tr>';
        return;
    }

    lista.forEach(f => {
        tbody.innerHTML += `
            <tr>
                <td>${f.id}</td>
                <td>${f.NomeCompleto}</td>
                <td>${f.Email}</td>
                <td>${f.Telefone}</td>
                <td>${f.Cargo}</td>
                <td>${f.CPF}</td>
                <td>
                    <a href="/Engenharia-de-Software-II/Administrador/cad_funcionario.html?id=${f.id}">Editar</a> |
                    <a href="#" onclick="excluir(${f.id})">Excluir</a>
                </td>
            </tr>`;
    });
}

async function excluir(id) {
    if (!confirm('Excluir este funcionário?')) return;

    const res  = await fetch('/Engenharia-de-Software-II/Administrador/php/cad_funcionario.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
    });
    const data = await res.json();

    alert(data.message);
    if (data.success) carregarFuncionarios();
}
