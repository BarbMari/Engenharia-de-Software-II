document.addEventListener("DOMContentLoaded", () => {
    carregarTabelaFuncionarios();
});

function carregarTabelaFuncionarios() {
    const tabelaBody = document.getElementById("tabelaFuncionarios");
    
    if (!tabelaBody) {
        console.error("Erro: Não encontrei a tabela com id 'tabelaFuncionarios'");
        return;
    }

    // Faz a busca no arquivo PHP correspondente
    fetch("./php/rel_funcionario.php")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro na resposta do servidor HTTP");
            }
            return response.json();
        })
        .then(funcionarios => {
            // LIMPA OS DADOS FIXOS (Ana Beatriz, Carlos, etc.) PARA REESCREVER COM O BANCO
            tabelaBody.innerHTML = ""; 

            if (funcionarios.length === 0) {
                tabelaBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #888;">Nenhum funcionário cadastrado no banco de dados.</td></tr>`;
                return;
            }

            // Desenha as novas linhas vinda do MySQL
            funcionarios.forEach(func => {
                const tr = document.createElement("tr");

                // Formatar o Telefone visualmente
                let telFormatado = func.Telefone;
                if(telFormatado.length === 11) {
                    telFormatado = `(${telFormatado.slice(0,2)}) ${telFormatado.slice(2,7)}-${telFormatado.slice(7)}`;
                } else if(telFormatado.length === 10) {
                    telFormatado = `(${telFormatado.slice(0,2)}) ${telFormatado.slice(2,6)}-${telFormatado.slice(6)}`;
                }

                // Formatar o CPF visualmente
                let cpfFormatado = func.CPF;
                if(cpfFormatado.length === 11) {
                    cpfFormatado = `${cpfFormatado.slice(0,3)}.${cpfFormatado.slice(3,6)}.${cpfFormatado.slice(6,9)}-${cpfFormatado.slice(9)}`;
                }

                tr.innerHTML = `
                    <td>${func.id}</td>
                    <td>${func.NomeCompleto}</td>
                    <td>${func.Email}</td>
                    <td>${telFormatado}</td>
                    <td>${func.Cargo}</td>
                    <td>${cpfFormatado}</td>
                `;
                tabelaBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar dados do relatório:", error);
        });
}