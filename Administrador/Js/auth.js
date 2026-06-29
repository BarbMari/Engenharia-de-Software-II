
(function () {
  const papel = sessionStorage.getItem('nsPapel');

  // Sem login -> redireciona
  if (!papel) {
    window.location.href = './index.html';
    return;
  }

  // Cozinheiro vai pra cozinha
  if (papel === 'cozinheiro') {
    window.location.href = '../Cozinha/cozinha.html';
    return;
  }

  // Páginas que só o admin pode acessar
  const adminOnlyPages = ['cad_funcionario', 'rel_funcionario', 'rel_venda' ];
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '');

  if (papel === 'funcionario' && adminOnlyPages.includes(currentPage)) {
    alert('Acesso restrito. Redirecionando...');
    window.location.href = './inicio.html';
  }
})();
