const form    = document.getElementById('formFuncionario');
const btnSalvar = document.getElementById('btnSalvar');
const idAtual = document.getElementById('idAtual');

const params = new URLSearchParams(window.location.search);
if (params.get('id')) {
    carregarParaEdicao(params.get('id'));
}

async function carregarParaEdicao(id) {
    const res  = await fetch(`/Engenharia-de-Software-II/Administrador/php/cad_funcionario.php?id=${id}`);
    const func = await res.json();

    idAtual.value                             = func.id;
    document.getElementById('nome').value     = func.NomeCompleto;
    document.getElementById('email').value    = func.Email;
    document.getElementById('telefone').value = func.Telefone;
    document.getElementById('cpf').value      = func.CPF;
    document.querySelector('select').value    = func.Cargo;
    btnSalvar.textContent = 'Salvar Alterações';
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        NomeCompleto: document.getElementById('nome').value,
        Email:        document.getElementById('email').value,
        Telefone:     document.getElementById('telefone').value,
        CPF:          document.getElementById('cpf').value,
        Cargo:        document.querySelector('select').value,
    };

    if (idAtual.value) {
        payload.id = idAtual.value;
    }

    const res  = await fetch('/Engenharia-de-Software-II/Administrador/php/cad_funcionario.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const data = await res.json();

    alert(data.message);
    if (data.success) {
        window.location.href = 'rel_funcionario.html';
    }
});
