/* ✦── Gráficos ─────────────────────── */
let chartDadosHe = null;
let chartMediaDiaria = null;
let he_media_geral = document.getElementById("media_he");
let media_he_hi = document.getElementById("media_hi_he");

/* ✦── Formulário ─────────────────────── */
let botaoData = document.getElementById("botaoData");
let datainicio = document.getElementById("datainicio");
let ultimadata = document.getElementById("ultimadata");
let intervalo = document.getElementById("intervalo");

/* ✦── Erro ─────────────────────── */
let paragrafoErroGrafico = document.getElementById("pErro");



function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

function chamarBackend(event) {
    event.preventDefault();

    let valordatainicio = datainicio.value;
    let valorultimadata = ultimadata.value;
    let valorintervalo = intervalo.value || 20;

    /* ✦── Validações ─────────────────────── */
    if (!valordatainicio || !valorultimadata) {
        paragrafoErroGrafico.innerText = "Preencha as duas datas.";
        return;
    }

    if (valordatainicio > valorultimadata) {
        paragrafoErroGrafico.innerText = "A data final deve ser maior do que a data inicial.";
        return;
    }

    paragrafoErroGrafico.innerText = "";

    let url = `http://localhost/2025_2_arthur_moro_prog4/site_mabel_2/dashboards/dashboards_mabel/mabel_he/mabel_he.php?datainicio=${valordatainicio}&ultimadata=${valorultimadata}&intervalo=${valorintervalo}`;

    console.log("URL chamada:", url);
    
    fetch(url)
        .then(response => {
            console.log("Resposta bruta:", response);
            return response.json();
        })
        .then(data => {
            console.log("JSON recebido:", data);

            /* ✦── Gráfico com os dados da umidade externa ─────────────────────── */

            if (data.dados_he && data.dados_he.length > 0) {
                const labelsHE = data.dados_he.map(item => formatarData(item.datainclusao) + ' ' + item.horainclusao);
                const mediaHe = data.dados_he.map(item => item.he);

                const optionsHE = {
                    chart: {
                        type: 'area',
                        height: 350
                    },

                    colors: ['#576D4B'], 

                    series: [{
                        name: 'Umidade Externa',
                        data: mediaHe
                    }],

                    xaxis: {
                        categories: labelsHE
                    },
                    yaxis: {
                        labels: {
                            formatter: function (value) {
                            return value.toFixed(2)+"%";
                            }
                        }
                    },
                    title: {
                        text: "Registros da Umidade Externa da Colmeia",
                        align: 'center',
                        floating: false,
                        style: {
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '35px',
                            fontWeight: 'bold',
                            color: '#576D4B'
                        }
                    }
                };

                if (chartDadosHe) {
                    chartDadosHe.destroy();
                }

                chartDadosHe = new ApexCharts(document.querySelector("#chartDadosHe"), optionsHE);
                chartDadosHe.render();


                /* ✦── Gráfico da média diária da umidade externa ─────────────────────── */

                const labelsMediaDiaria = data.media_diaria.map(item => formatarData(item.datainclusao));
                const mediaDiaria = data.media_diaria.map(item => item.media_diaria);

                const optionsMediaDiaria = {
                    chart: {
                        type: 'bar',
                        height: 300
                    },
                    
                    colors: ['#576D4B'],

                    dataLabels: {
                        enabled: false
                    },

                    series: [{
                        name: 'Média Diária',
                        data: mediaDiaria
                    }],
                    xaxis: {
                        categories: labelsMediaDiaria
                    },
                    yaxis: {
                        labels: {
                        formatter: function (value) {
                            return value.toFixed(2)+"%";
                            }
                        }
                    },

                    title: {
                        text: "Média Diária da Umidade Externa",
                        align: 'center',
                        floating: false,
                        style: {
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '35px',
                            fontWeight: 'bold',
                            color: '#576D4B'
                        }
                    }
                };

                if (chartMediaDiaria) {
                    chartMediaDiaria.destroy();
                }

                chartMediaDiaria = new ApexCharts(document.querySelector("#chartMediaDiaria"), optionsMediaDiaria);
                chartMediaDiaria.render();


                /* ✦── Média Geral da Umidade Externa ─────────────────────── */
                if (data.media_geral && data.media_geral.he_media !== null) {
                    he_media_geral.innerText = `Média Geral HE: ${Number(data.media_geral.he_media).toFixed(2)}°C`;
                }
                else {
                    he_media_geral.innerText = "Média Geral HE: sem dados";
                }

                /* ✦── Diferença entre Umidade Interna e Externa ─────────────────────── */
                if (data.diferenca_hi_he && data.diferenca_hi_he.hi_he_media !== null) {
                    media_he_hi.innerText = `Diferença Média HI-HE: ${Number(data.diferenca_hi_he.hi_he_media).toFixed(2)}°C`;
                }
                else {
                    media_he_hi.innerText = "Diferença Média HI-HE: sem dados";
                }


            } else {
                console.log("Nenhum dado encontrado.");
                paragrafoErroGrafico.innerText = "Nenhum dado encontrado."
            }
        })
        .catch(error => {
            console.error('Erro ao obter dados:', error);
        });
}

botaoData.addEventListener("click", chamarBackend);