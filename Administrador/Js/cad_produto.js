// Js/cad_produto.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formProduto");
    const inputQuantidade = form.querySelector('[name="quantidade"]');
    const inputCustoUnitario = form.querySelector('[name="custoUnitario"]');
    const inputCustoTotal = document.getElementById("custoTotal");
  
    // ---------- CALCULA O CUSTO TOTAL AUTOMATICAMENTE ----------
    function calcularCustoTotal() {
      const quantidade = parseFloat(inputQuantidade.value) || 0;
      const custoUnitario = parseFloat(inputCustoUnitario.value) || 0;
      const total = quantidade * custoUnitario;
      inputCustoTotal.value = total.toFixed(2);
    }
  
    inputQuantidade.addEventListener("input", calcularCustoTotal);
    inputCustoUnitario.addEventListener("input", calcularCustoTotal);
  
    // ---------- CRIA UMA ÁREA DE MENSAGEM (SUCESSO/ERRO) ----------
    let mensagemEl = document.getElementById("mensagemFormProduto");
    if (!mensagemEl) {
      mensagemEl = document.createElement("p");
      mensagemEl.id = "mensagemFormProduto";
      mensagemEl.style.marginTop = "12px";
      mensagemEl.style.fontWeight = "600";
      form.appendChild(mensagemEl);
    }
  
    function mostrarMensagem(texto, tipo) {
      mensagemEl.textContent = texto;
      mensagemEl.style.color = tipo === "sucesso" ? "#2c5530" : "#b00020";
    }
  
    // ---------- ENVIA O FORMULÁRIO VIA AJAX ----------
    form.addEventListener("submit", async (evento) => {
      evento.preventDefault();
  
      const botao = form.querySelector('button[type="submit"]');
      const textoOriginalBotao = botao.textContent;
      botao.disabled = true;
      botao.textContent = "Salvando...";
      mostrarMensagem("", "sucesso");
  
      const dados = new FormData(form);
  
      try {
        const resposta = await fetch("./php/cad_produto.php", {
          method: "POST",
          body: dados,
        });
  
        const resultado = await resposta.json();
  
        if (resultado.sucesso) {
          mostrarMensagem(resultado.mensagem, "sucesso");
          form.reset();
          inputCustoTotal.value = "";
        } else {
          mostrarMensagem(resultado.mensagem, "erro");
        }
      } catch (erro) {
        mostrarMensagem("Não foi possível conectar ao servidor. Tente novamente.", "erro");
      } finally {
        botao.disabled = false;
        botao.textContent = textoOriginalBotao;
      }
    });
  });