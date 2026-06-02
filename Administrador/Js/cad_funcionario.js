document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formFuncionario");
    
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();

            const id = document.getElementById("idAtual").value;
            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            
            // Remove pontos, traços e parênteses antes de enviar para caber nos 11 caracteres do banco
            const telefone = document.getElementById("telefone").value.replace(/[^\d]/g, '');
            const cpf = document.getElementById("cpf").value.replace(/[^\d]/g, '');
            
            // Busca o select de cargo de dentro do form
            const selectCargo = form.querySelector("select");
            const cargo = selectCargo ? selectCargo.value : "";

            const payload = {
                id: id ? parseInt(id) : null,
                NomeCompleto: nome,
                Email: email,
                Telefone: telefone,
                CPF: cpf,
                Cargo: cargo
            };

            fetch("./php/cad_funcionario.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    form.reset();
                    document.getElementById("idAtual").value = "";
                } else {
                    alert("Erro: " + data.message);
                }
            })
            .catch(error => {
                console.error("Erro na comunicação com o servidor:", error);
                alert("Não foi possível salvar os dados.");
            });
        });
    }
});