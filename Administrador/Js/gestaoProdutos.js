/* // Dados das opções
const OPCOES = {
  categorias: ["Mercearia", "Frios e Laticínios", "Hortifruti", "Bebidas", "Embalagens e Descartáveis"],
  unidades: ["KG", "L", "UN", "DZ", "G", "CX"],
  status: ["Disponível", "Baixo estoque", "Sem estoque"]
};

// Editar linha
function editarLinha(btn) {
  const linha = btn.closest('tr');
  const celulas = linha.querySelectorAll('td[data-field]');
  
  celulas.forEach(td => {
    const valor = td.textContent.trim();
    const campo = td.dataset.field;
    
    if (campo === 'categoria') {
      td.innerHTML = selectHTML(OPCOES.categorias, valor);
    } else if (campo === 'un') {
      td.innerHTML = selectHTML(OPCOES.unidades, valor);
    } else if (campo === 'status') {
      td.innerHTML = selectHTML(OPCOES.status, valor);
    } else if (campo === 'entrada' || campo === 'validade') {
      td.innerHTML = `<input type="date" class="tabela-input" value="${valor}">`;
    } else {
      td.innerHTML = `<input type="text" class="tabela-input" value="${valor}">`;
    }
  });
  
  btn.style.display = 'none';
  linha.querySelector('.btn-salvar').style.display = 'inline-block';
}

// Salvar linha
function salvarLinha(btn) {
  const linha = btn.closest('tr');
  const celulas = linha.querySelectorAll('td[data-field]');
  
  celulas.forEach(td => {
    const input = td.querySelector('.tabela-input');
    const valor = input ? input.value : td.textContent;
    td.textContent = td.dataset.field === 'produto' ? valor : valor;
  });
  
  btn.style.display = 'none';
  linha.querySelector('.btn-edit').style.display = 'inline-block';
  alert('Salvo!');
}

// Excluir linha
function excluirLinha(btn) {
  if (confirm('Excluir este produto?')) {
    btn.closest('tr').remove();
  }
}

// Função auxiliar para criar select
function selectHTML(opcoes, valorAtual) {
  return `<select class="tabela-input">
    ${opcoes.map(op => `<option ${op === valorAtual ? 'selected' : ''}>${op}</option>`).join('')}
  </select>`;
} */