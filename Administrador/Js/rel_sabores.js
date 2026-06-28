const API_URL = "./php/rel_sabores.php";

const tabelaCorpo = document.getElementById("tabelaCorpo");
const totalSabores = document.getElementById("totalSabores");

let fIngredientesSelecionados = [];

document.querySelectorAll("#fIngredientesContainer .ingrediente-tag").forEach((tag) => {
  tag.addEventListener("click", () => {
    tag.classList.toggle("selecionado");
    const ingrediente = tag.textContent;
    const idx = fIngredientesSelecionados.indexOf(ingrediente);

    if (idx >= 0) {
      fIngredientesSelecionados.splice(idx, 1);
    } else {
      fIngredientesSelecionados.push(ingrediente);
    }
  });
});

document.getElementById("fBuscarIngrediente").addEventListener("keyup", function () {
  const filtro = this.value.toLowerCase();
  document.querySelectorAll("#fIngredientesContainer .ingrediente-tag").forEach((tag) => {
    const texto = tag.textContent.toLowerCase();
    tag.style.display = texto.includes(filtro) ? "block" : "none";
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
    .then((resp) => resp.text())
    .then((texto) => {
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
    .catch((err) => console.error("Erro ao carregar sabores:", err));
}

function renderizarTabela(itens) {
  tabelaCorpo.innerHTML = "";
  totalSabores.textContent = itens.length;

  if (itens.length === 0) {
    tabelaCorpo.innerHTML =
      '<tr><td colspan="7" class="sem-resultados">Nenhum sabor encontrado.</td></tr>';
    return;
  }

  itens.forEach((item) => {
    const partes = (item.Igredientes || "").split(",").map((p) => p.trim());
    const queijo = partes[0] || "";
    const molho = partes[1] || "";
    const ingredientes = partes.slice(2).filter((p) => p !== "").join(", ");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.Nome}</strong></td>
      <td>${item.Tipo}</td>
      <td>${molho || "-"}</td>
      <td>${queijo || "-"}</td>
      <td>${ingredientes || "-"}</td>
      <td>R$ ${Number(item.Valor).toFixed(2).replace(".", ",")}</td>
      <td class="acoes-tabela">
        <button class="btn-editar" data-id="${item.id}" title="Editar">✏️</button>
        <button class="btn-excluir" data-id="${item.id}" title="Excluir">🗑️</button>
      </td>
    `;

    tr.querySelector(".btn-editar").addEventListener("click", () =>
      abrirModalEdicao(item)
    );

    tr.querySelector(".btn-excluir").addEventListener("click", () =>
      excluirSabor(item.id, item.Nome)
    );

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
    .then((resp) => resp.json())
    .then((data) => {
      if (data.sucesso) {
        carregarSabores();
      } else {
        alert("Erro ao excluir: " + (data.erro || "tente novamente."));
      }
    })
    .catch((err) => console.error("Erro ao excluir sabor:", err));
}

/* =========================
   EDITAR (MODAL)
========================= */
const modalEditar = document.getElementById("modalEditar");
let editIngredientesSelecionados = [];
let editImagemAtual = "";
let editResumoAtual = "";

function abrirModalEdicao(item) {
  const partes = (item.Igredientes || "").split(",").map((p) => p.trim());
  const queijo = partes[0] || "";
  const molho = partes[1] || "";
  const ingredientes = partes.slice(2).filter((p) => p !== "");

  document.getElementById("editId").value = item.id;
  document.getElementById("editNome").value = item.Nome;
  document.getElementById("editTipo").value = item.Tipo;
  document.getElementById("editMolho").value = molho;
  document.getElementById("editQueijo").value = queijo;
  document.getElementById("editValor").value = item.Valor;

  editImagemAtual = item.Imagem || "";
  editResumoAtual = item.Resumo || "";

  editIngredientesSelecionados = [...ingredientes];

  document.querySelectorAll("#editIngredientesContainer .ingrediente-tag").forEach((tag) => {
    tag.style.display = "block";
    if (editIngredientesSelecionados.includes(tag.textContent)) {
      tag.classList.add("selecionado");
    } else {
      tag.classList.remove("selecionado");
    }
  });

  modalEditar.style.display = "flex";
}

document.querySelectorAll("#editIngredientesContainer .ingrediente-tag").forEach((tag) => {
  tag.addEventListener("click", () => {
    tag.classList.toggle("selecionado");
    const ingrediente = tag.textContent;
    const idx = editIngredientesSelecionados.indexOf(ingrediente);

    if (idx >= 0) {
      editIngredientesSelecionados.splice(idx, 1);
    } else {
      editIngredientesSelecionados.push(ingrediente);
    }
  });
});

document.getElementById("editBuscarIngrediente").addEventListener("keyup", function () {
  const filtro = this.value.toLowerCase();
  document.querySelectorAll("#editIngredientesContainer .ingrediente-tag").forEach((tag) => {
    const texto = tag.textContent.toLowerCase();
    tag.style.display = texto.includes(filtro) ? "block" : "none";
  });
});

document.getElementById("btnCancelarEdicao").addEventListener("click", () => {
  modalEditar.style.display = "none";
});

document.getElementById("btnSalvarEdicao").addEventListener("click", () => {
  const queijo = document.getElementById("editQueijo").value;
  const molho = document.getElementById("editMolho").value;

  let ing = queijo + ", " + molho;
  editIngredientesSelecionados.forEach((i) => (ing += ", " + i));

  const formData = new FormData();
  formData.append("action", "update");
  formData.append("id", document.getElementById("editId").value);
  formData.append("nom", document.getElementById("editNome").value);
  formData.append("fla", document.getElementById("editTipo").value);
  formData.append("val", document.getElementById("editValor").value);
  formData.append("img", editImagemAtual);
  formData.append("res", editResumoAtual);
  formData.append("ing", ing);

  fetch(API_URL, { method: "POST", body: formData })
    .then((resp) => resp.json())
    .then((data) => {
      if (data.sucesso) {
        modalEditar.style.display = "none";
        carregarSabores();
      } else {
        alert("Erro ao salvar: " + (data.erro || "tente novamente."));
      }
    })
    .catch((err) => console.error("Erro ao salvar edição:", err));
});

/* =========================
   INICIALIZAÇÃO
========================= */
carregarSabores();