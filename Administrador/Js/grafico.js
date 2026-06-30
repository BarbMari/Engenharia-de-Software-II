/* ✦── Gráfico ─────────────────────────────────────────────────── */
let chartReceita = null;

/* ✦── Dados ─────────────────────────────────────────────── */
let receita_total = document.getElementById("receita_total");
let maior_venda = document.getElementById("maior_venda");
let menor_venda = document.getElementById("menor_venda");
let media_receita = document.getElementById("media_receita");
let quantidadePedidos = document.getElementById("quantidade_pedidos");

/* ✦── Form ──────────────────────────────────────────────── */
let botaoData = document.getElementById("botaoData");
let datainicio = document.getElementById("datainicio");
let ultimadata = document.getElementById("ultimadata");
let intervalo = document.getElementById("intervalo");


/* ✦── Erro ────────────────────────────────────────── */
let paragrafoErroGrafico = document.getElementById("pErro");


function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}



function chamarBackend(event) {

    event.preventDefault();

    let valordatainicio = datainicio.value;
    let valorultimadata = ultimadata.value;

    /* ✦── Validações ─────────────────────────────────────────── */

    if (!valordatainicio || !valorultimadata) {

        paragrafoErroGrafico.innerText = "Preencha as duas datas.";
        return;

    }

    if (valordatainicio > valorultimadata) {

        paragrafoErroGrafico.innerText =
            "A data final deve ser maior do que a data inicial.";

        return;

    }

    paragrafoErroGrafico.innerText = "";

    let url =
        `http://localhost/Engenharia-de-Software-II/Administrador/php/grafico.php?datainicio=${valordatainicio}&ultimadata=${valorultimadata}`;

    console.log(url);

    fetch(url)
        .then(response => {
            console.log(response);
            return response.json();

        })

        .then(data => {

            console.log(data);

            if (data.receita_diaria && data.receita_diaria.length > 0) {

                const labels = data.receita_diaria.map(item =>
                    formatarData(item.DataPedido)
                );

                const valores = data.receita_diaria.map(item =>
                    Number(item.receita)
                );

                /* ✦── Gráfico ───────────────────────────── */

                const options = {

                    chart: {

                        type: "area",
                        height: 350

                    },

                    colors: ["#C0392B"],

                    series: [

                        {

                            name: "Receita Diária",

                            data: valores

                        }

                    ],

                    xaxis: {

                        categories: labels

                    },

                    yaxis: {

                        labels: {

                            formatter: function (value) {

                                return "R$ " + value.toFixed(2);

                            }

                        }

                    },

                    tooltip: {

                        y: {

                            formatter: function(value){

                                return "R$ " + value.toFixed(2);

                            }

                        }

                    },

                    dataLabels: {

                        enabled: false

                    },

                    stroke: {

                        curve: "smooth"

                    },

                    title: {

                        text: "Ganhos diários da NanoSabores",

                        align: "center",

                        floating: false,

                        style: {

                            fontFamily: "'Playfair Display', serif",

                            fontSize: "35px",

                            fontWeight: "bold",

                            color: "#C0392B"

                        }

                    }

                };

                if (chartReceita) {

                    chartReceita.destroy();

                }

                chartReceita = new ApexCharts(

                    document.querySelector("#chartReceita"),

                    options

                );

                chartReceita.render();


                if (data.receita_total.valor != null) {

                    receita_total.innerText =
                        `Receita Total: R$ ${Number(data.receita_total.valor).toFixed(2)}`;

                }

                else {

                    receita_total.innerText =
                        "Receita Total: sem dados";

                }


                if (data.maior_venda.valor != null) {

                    maior_venda.innerText =
                        `Maior Venda: R$ ${Number(data.maior_venda.valor).toFixed(2)}`;

                }

                else {

                    maior_venda.innerText =
                        "Maior Venda: sem dados";

                }

                if (data.menor_venda.valor != null) {

                    menor_venda.innerText =
                        `Menor Venda: R$ ${Number(data.menor_venda.valor).toFixed(2)}`;

                }

                else {

                    menor_venda.innerText =
                        "Menor Venda: sem dados";

                }

                if (data.media_receita.valor != null) {

                    media_receita.innerText =
                        `Receita Média Diária: R$ ${Number(data.media_receita.valor).toFixed(2)}`;

                }

                else {

                    media_receita.innerText =
                        "Receita Média Diária: sem dados";

                }
                
                if (data.quantidade_pedidos && data.quantidade_pedidos.valor !== null) {
                    quantidadePedidos.innerText =`Quantidade de Pedidos: ${data.quantidade_pedidos.valor}`;
            
                }
                
                else {

                    quantidadePedidos.innerText = "Quantidade de Pedidos: sem dados";
                
                }

            }

            else {

                paragrafoErroGrafico.innerText =
                    "Nenhum dado encontrado.";

            }

        })

        .catch(error => {

            console.error(error);

            paragrafoErroGrafico.innerText =
                "Erro ao consultar o servidor.";

        });

}

/* ✦────────────────────────────────────────────────────────────── */

botaoData.addEventListener("click", chamarBackend);