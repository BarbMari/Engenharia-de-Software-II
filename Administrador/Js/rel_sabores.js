const API_URL = "./php/rel_sabores.php";

const tabelaCorpo = document.getElementById("tabelaCorpo");
const totalSabores = document.getElementById("totalSabores");

let fIngredientesSelecionados = [];
let editIngredientesSelecionados = [];
let editImagemAtual = "";
let editResumoAtual = "";

/* =========================
   CARREGAR INGREDIENTES DO ESTOQUE
========================= */
async function carregarIngredientes() {
  try {
    const res = await fetch("./php/get_ingredientes.php");
    const data = await res.json();

    const filtroContainer = document.getElementById("fIngredientesContainer");
    const editContainer = document.getElementById("editIngredientesContainer");

    filtroContainer.innerHTML = "";
    editContainer.innerHTML = "";

    if (!data.sucesso || data.produtos.length === 0) {
      filtroContainer.innerHTML = '<span style="color:#999; font-size:0.9rem;">Nenhum produto no estoque.</span>';
      editContainer.innerHTML = '<span style="color:#999; font-size:0.9rem;">Nenhum produto no estoque.</span>';
      return;
    }

    data.produtos.forEach(p => {
      // Tag do filtro
      const tagFiltro = document.createElement("div");
      tagFiltro.className = "ingrediente-tag";
      tagFiltro.textContent = p.Nome;
      tagFiltro.addEventListener("click", () => {
        tagFiltro.classList.toggle("selecionado");
        const idx = fIngredientesSelecionados.indexOf(p.Nome);
        if (idx >= 0) fIngredientesSelecionados.splice(idx, 1);
        else fIngredientesSelecionados.push(p.Nome);
      });
      filtroContainer.appendChild(tagFiltro);

      // Tag do modal de edição
      const tagEdit = document.createElement("div");
      tagEdit.className = "ingrediente-tag";
      tagEdit.textContent = p.Nome;
      tagEdit.addEventListener("click", () => {
        tagEdit.classList.toggle("selecionado");
        const idx = editIngredientesSelecionados.indexOf(p.Nome);
        if (idx >= 0) editIngredientesSelecionados.splice(idx, 1);
        else editIngredientesSelecionados.push(p.Nome);
      });
      editContainer.appendChild(tagEdit);
    });

  } catch (err) {
    console.error("Erro ao carregar ingredientes:", err);
  }
}

// Busca no filtro
document.getElementById("fBuscarIngrediente").addEventListener("keyup", function () {
  const filtro = this.value.toLowerCase();
  document.querySelectorAll("#fIngredientesContainer .ingrediente-tag").forEach(tag => {
    tag.style.display = tag.textContent.toLowerCase().includes(filtro) ? "" : "none";
  });
});

// Busca no modal
document.getElementById("editBuscarIngrediente").addEventListener("keyup", function () {
  const filtro = this.value.toLowerCase();
  document.querySelectorAll("#editIngredientesContainer .ingrediente-tag").forEach(tag => {
    tag.style.display = tag.textContent.toLowerCase().includes(filtro) ? "" : "none";
  });
});

/* =========================
   CARREGAR / FILTRAR
========================= */
function carregarSabores() {
  const params = new URLSearchParams({
    action: "list",
    nome: document.getElementById("fNome").value,
    tipo: document.getElementById("fTipo").value,
    molho: document.getElementById("fMolho").value,
    queijo: document.getElementById("fQueijo").value,
    ingredientes: fIngredientesSelecionados.join(","),
    precoMin: document.getElementById("fPrecoMin").value,
    precoMax: document.getElementById("fPrecoMax").value,
  });

  fetch(`${API_URL}?${params.toString()}`)
    .then(resp => resp.text())
    .then(texto => {
      let data;
      try {
        data = JSON.parse(texto);
      } catch (e) {
        console.error("Resposta do servidor não é JSON válido:", texto);
        tabelaCorpo.innerHTML = `<tr><td colspan="7" class="sem-resultados">Erro: o servidor não retornou JSON. Veja o console (F12) para detalhes.</td></tr>`;
        return;
      }

      if (data.sucesso) {
        renderizarTabela(data.itens);
      } else {
        console.error("Erro retornado pelo PHP:", data.erro);
        tabelaCorpo.innerHTML = `<tr><td colspan="7" class="sem-resultados">Erro: ${data.erro}</td></tr>`;
      }
    })
    .catch(err => console.error("Erro ao carregar sabores:", err));
}

function renderizarTabela(itens) {
  tabelaCorpo.innerHTML = "";
  totalSabores.textContent = itens.length;

  if (itens.length === 0) {
    tabelaCorpo.innerHTML = '<tr><td colspan="7" class="sem-resultados">Nenhum sabor encontrado.</td></tr>';
    return;
  }

  itens.forEach(item => {
    const partes = (item.Igredientes || "").split(",").map(p => p.trim());
    const queijo = partes[0] || "";
    const molho = partes[1] || "";
    const ingredientes = partes.slice(2).filter(p => p !== "").join(", ");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.Nome}</strong></td>
      <td>${item.Tipo}</td>
      <td>${molho || "-"}</td>
      <td>${queijo || "-"}</td>
      <td>${ingredientes || "-"}</td>
      <td>R$ ${Number(item.Valor).toFixed(2).replace(".", ",")}</td>
      <td class="acoes-tabela">
        <button class="btn-editar" title="Editar">✏️</button>
        <button class="btn-excluir" title="Excluir">🗑️</button>
      </td>
    `;

    tr.querySelector(".btn-editar").addEventListener("click", () => abrirModalEdicao(item));
    tr.querySelector(".btn-excluir").addEventListener("click", () => excluirSabor(item.id, item.Nome));

    tabelaCorpo.appendChild(tr);
  });
}

document.getElementById("btnFiltrar").addEventListener("click", carregarSabores);

/* =========================
   EXCLUIR
========================= */
function excluirSabor(id, nome) {
  if (!confirm(`Deseja realmente excluir o sabor "${nome}"?`)) return;

  const formData = new FormData();
  formData.append("action", "delete");
  formData.append("id", id);

  fetch(API_URL, { method: "POST", body: formData })
    .then(resp => resp.json())
    .then(data => {
      if (data.sucesso) {
        carregarSabores();
      } else {
        alert("Erro ao excluir: " + (data.erro || "tente novamente."));
      }
    })
    .catch(err => console.error("Erro ao excluir sabor:", err));
}

/* =========================
   EDITAR (MODAL)
========================= */
const modalEditar = document.getElementById("modalEditar");

function abrirModalEdicao(item) {
  const partes = (item.Igredientes || "").split(",").map(p => p.trim());
  const queijo = partes[0] || "";
  const molho = partes[1] || "";
  const ingredientes = partes.slice(2).filter(p => p !== "");

  document.getElementById("editId").value = item.id;
  document.getElementById("editNome").value = item.Nome;
  document.getElementById("editTipo").value = item.Tipo;
  document.getElementById("editMolho").value = molho;
  document.getElementById("editQueijo").value = queijo;
  document.getElementById("editValor").value = item.Valor;

  editImagemAtual = item.Imagem || "";
  editResumoAtual = item.Resumo || "";
  editIngredientesSelecionados = [...ingredientes];

  // Marca os ingredientes selecionados no modal
  document.querySelectorAll("#editIngredientesContainer .ingrediente-tag").forEach(tag => {
    tag.style.display = "";
    if (editIngredientesSelecionados.includes(tag.textContent)) {
      tag.classList.add("selecionado");
    } else {
      tag.classList.remove("selecionado");
    }
  });

  modalEditar.style.display = "flex";
}

document.getElementById("btnCancelarEdicao").addEventListener("click", () => {
  modalEditar.style.display = "none";
});

modalEditar.addEventListener("click", e => {
  if (e.target === modalEditar) modalEditar.style.display = "none";
});

document.getElementById("btnSalvarEdicao").addEventListener("click", () => {
  const queijo = document.getElementById("editQueijo").value;
  const molho = document.getElementById("editMolho").value;

  const partes = [];
  if (queijo) partes.push(queijo);
  if (molho) partes.push(molho);
  partes.push(...editIngredientesSelecionados);

  const formData = new FormData();
  formData.append("action", "update");
  formData.append("id", document.getElementById("editId").value);
  formData.append("nom", document.getElementById("editNome").value);
  formData.append("fla", document.getElementById("editTipo").value);
  formData.append("val", document.getElementById("editValor").value);
  formData.append("img", editImagemAtual);
  formData.append("res", editResumoAtual);
  formData.append("ing", partes.join(", "));

  fetch(API_URL, { method: "POST", body: formData })
    .then(resp => resp.json())
    .then(data => {
      if (data.sucesso) {
        modalEditar.style.display = "none";
        carregarSabores();
      } else {
        alert("Erro ao salvar: " + (data.erro || "tente novamente."));
      }
    })
    .catch(err => console.error("Erro ao salvar edição:", err));
});

/* =========================
   INICIALIZAÇÃO
========================= */
carregarIngredientes();
carregarSabores();