/* // Dados das opções
const OPCOES = {
  tipos: ["Salgada", "Doce", "Vegetariana"],
  molhos: ["Tomate", "Pesto", "Branco", "Nenhum"],
  queijos: ["Mussarela", "Cheddar", "Parmesão", "Provolone", "Gouda", "Catupiry", "Nenhum"]
};

// Editar linha
function editarLinha(btn) {
  const linha = btn.closest('tr');
  const celulas = linha.querySelectorAll('td[data-field]');
  
  celulas.forEach(td => {
    const valor = td.textContent.trim();
    const campo = td.dataset.field;
    
    if (campo === 'tipo') {
      td.innerHTML = selectHTML(OPCOES.tipos, valor);
    } 
    else if (campo === 'molho') {
      td.innerHTML = selectHTML(OPCOES.molhos, valor);
    } 
    else if (campo === 'queijo') {
      td.innerHTML = selectHTML(OPCOES.queijos, valor);
    } 
    else {
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
    td.textContent = valor;
  });
  
  btn.style.display = 'none';
  linha.querySelector('.btn-edit').style.display = 'inline-block';
  alert('Salvo!');
}

// Excluir linha
function excluirLinha(btn) {
  if (confirm('Excluir este sabor?')) {
    btn.closest('tr').remove();
  }
}

// Função auxiliar para criar select
function selectHTML(opcoes, valorAtual) {
  return `<select class="tabela-input">
    ${opcoes.map(op => `<option ${op === valorAtual ? 'selected' : ''}>${op}</option>`).join('')}
  </select>`;
} */