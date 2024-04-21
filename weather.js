const API_CHAVE = "747d2b43b65726d9af07fb6f0c393372";
const cidade = document.querySelector(".city-input");
const pesquisar = document.querySelector(".search-btn");
const partilhar = document.querySelector(".share-btn");
const localizaoAtual = document.querySelector(".location-btn");
const tempoAtual = document.querySelector(".clima-atual");
const climaCards = document.querySelector(".clima-cards");

const alerts = document.querySelector(".dropdown-content");
const quantidadeAlertas = document.querySelector(".alert-count");
const diasDaSemana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
let userLatitude, userLongitude;
let _latitude, _longitude
function pegarCoordenadasUsuario(value) {

    navigator.geolocation.getCurrentPosition(localizacao => {
        var { latitude, longitude } = localizacao.coords;
        userLatitude = latitude;
        userLongitude = longitude;
        var url = new URL(window.location.href);
        var lat = url.searchParams.get('lat');
        var lon = url.searchParams.get('lon');
        if (lat !== null && lon !== null && value == false) {
            latitude = lat;
            longitude = lon;
        }
        const API_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_CHAVE}`;
        fetch(API_URL).then(response => response.json()).then(dados => {
            if (dados.length == 0) {
                alert('Nenhuma informação encontrada para essa cidade');
                return;
            }
            var { name } = dados[0];
            buscarDetalhesTempo(name, latitude, longitude);
        }).catch((error) => {
            console.log(error)
        });
    })
}

function buscarDetalhesTempo(nomeCidade, latitude, longitude) {
    _latitude = latitude;
    _longitude = longitude;
    const CLIMA_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=pt&appid=${API_CHAVE}`;
    fetch(CLIMA_API_URL).then(response => response.json()).then(dados => {
        const uniqueNextFiveDays = [];
        var days = [];
        const fiveDaysForecast = dados.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            var dia = new Date(forecast.dt_txt).getDay();
            var hora = new Date(forecast.dt_txt).getHours();
            console.log("Previsao -> Hora: " + hora + " Dia: " + dia);
            var today = new Date();
            console.log("Hoje -> Hora: " + today.getHours() + " Dia: " + today.getDay());
            if (uniqueNextFiveDays.includes(forecastDate) == false) {
                days.push(diasDaSemana[dia])
                return uniqueNextFiveDays.push(forecastDate)
            }
        });
        cidade.value = "";
        tempoAtual.innerHTML = "";
        climaCards.innerHTML = "";
        const pais = dados.city.country;
        fiveDaysForecast.forEach((item, index) => {
            const html = criarCardClima(nomeCidade, pais, item, index, days);
            if (index === 0) {
                tempoAtual.insertAdjacentHTML("beforeend", html);
            } else {
                climaCards.insertAdjacentHTML("beforeend", html);
            }
        });
        const novaURL = `?lat=${_latitude}&lon=${_longitude}`;
        window.history.pushState({}, '', novaURL);
    }).catch((error) => {
        console.log(error)
    });
}



function criarCardClima(cidade, pais, item, index, dias) {
    if (index == 0) {
        return `<div class="details">
                    <div style ="display: flex;"> 
                    <h2>${cidade}, ${pais}&nbsp</h2>
                    <img src="https://flagsapi.com/${pais}/flat/32.png">
                    </div>
                    <h6>Temperatura: ${(item.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Ventania: ${(item.wind.speed)} m/s</h6>
                    <h6>Humidade: ${(item.main.humidity)}%</h6>
                </div> 
                <div class="icon">
                    <img src="http://openweathermap.org/img/wn/${(item.weather[0].icon)}@4x.png">
                    <h6>${item.weather[0].description}</h6>
                </div>`;

    } else {
        return `<div class="card">
                <h2>${(dias[index])}</h2>
                <img src="http://openweathermap.org/img/wn/${(item.weather[0].icon)}@4x.png">
                <h6>${item.weather[0].description}</h6>
                <h6>Temperatura: ${(item.main.temp - 273.15).toFixed(2)}°C</h6>
                <h6>Ventania: ${(item.wind.speed)} m/s</h6>
                <h6>Humidade: ${(item.main.humidity)}%</h6>
      </div>`;
    }
}
function dadosCidade() {
    var nomeCidade = cidade.value;
    if (nomeCidade == '') {
        return;
    }
    var API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${nomeCidade}&limit=1&lang=pt&appid=${API_CHAVE}`;
    fetch(API_URL).then(response => response.json()).then(dados => {
        console.log(dados);
        if (dados.length == 0) {
            alert('Nenhuma informação encontrada para essa cidade');
            return;
        }
        var { lat, lon, name } = dados[0];
        buscarDetalhesTempo(name, lat, lon);

    }).catch((error) => {
        console.log(error)
    });
}
function partilharPrevisao() {
    const linkCompartilhado = `http://celita22.github.io/Weather/?lat=${_latitude}&lon=${_longitude}`;
    Swal.fire({
        title: "<span style='color: white; font-weight: bold;'>Partilhar Previsão de Tempo</span>",
        html: "<span style='color: white; font-weight: bold;'>" + linkCompartilhado + "</span>",
        showDenyButton: true,
        confirmButtonText: "<span style='color: white; font-weight: bold;'>Copiar Link</span>",
        denyButtonText: "<span style='color: white; font-weight: bold;'>Voltar</span>",
        background: `url('http://i.gifer.com/fyDi.gif') no-repeat`,
        customClass: {
            title: 'swal-text-white',
            content: 'swal-text-white',
            actions: 'swal-text-white',
            confirmButton: 'swal-button-green',
            denyButton: 'swal-button-red',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            navigator.clipboard.writeText(linkCompartilhado).then(() => {
                Swal.fire("Link copiado com sucesso!", "", "success");
            }).catch(err => {
                console.error('Erro ao copiar o link:', err);
            });
        }
    });


}


function condicoesSeveras() {
    navigator.geolocation.getCurrentPosition(localizacao => {
        var { latitude, longitude } = localizacao.coords;
        const CLIMA_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=pt&appid=${API_CHAVE}`;
        fetch(CLIMA_API_URL).then(response => response.json()).then(dados => {
            const uniqueNextFiveDays = [];
            var days = [];
            const previsaoProximosCincoDias = dados.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                var dia = new Date(forecast.dt_txt).getDay();
                if (uniqueNextFiveDays.includes(forecastDate) == false) {
                    days.push(diasDaSemana[dia]);
                    return uniqueNextFiveDays.push(forecastDate);
                }
            });
            const limiteTemperatura = 35; // 35 graus Celsius
            const limiteVelocidadeVento = 75; // 75 km/h
            const limiteChuvaPorHora = 50; // 50 mm/h
            const limiteChuvaDiaria = 100; // 100 mm/24h
            const limiteNeve = 30; // 30 cm
            const limiteRaios = 10; // 10 raios por minuto
            const limiteGranizo = 2; // 2 cm
            const limiteVisibilidade = 200; // 200 metros

            alerts.innerHTML = "";
            quantidadeAlertas.innerHTML = "0"
            let alertCount = 0;
            previsaoProximosCincoDias.forEach((dadosMeteorologicos, indice) => {
                const temperatura = (dadosMeteorologicos.main.temp - 273.15).toFixed(2);
                const velocidadeVento = dadosMeteorologicos.wind.speed;
                const chuvaPorHora = dadosMeteorologicos.rain ? dadosMeteorologicos.rain['1h'] || 0 : 0;
                const chuvaDiaria = dadosMeteorologicos.rain ? dadosMeteorologicos.rain['3h'] || 0 : 0;
                const neve = dadosMeteorologicos.snow ? dadosMeteorologicos.snow['1h'] || 0 : 0;
                const raios = dadosMeteorologicos.lightning ? dadosMeteorologicos.lightning['1h'] || 0 : 0;
                const granizo = dadosMeteorologicos.hail ? dadosMeteorologicos.hail['1h'] || 0 : 0;
                const visibilidade = dadosMeteorologicos.visibility || 0;

                if (temperatura > limiteTemperatura) {
                    alerts.insertAdjacentHTML('beforeend', `
                                    <a>${diasDaSemana[indice]}: Calor extremo detectado!,  tempo de previsão: ${dadosMeteorologicos.dt_txt.split(" ")[1]} </a>
                                 `)
                    alertCount += 1
                }
                if (velocidadeVento > limiteVelocidadeVento) {
                    alertCount += 1
                    alerts.insertAdjacentHTML('beforeend', `
                                    <a>${diasDaSemana[indice]}: Alta velocidade do vento detectada!</a>
                                 `)
                }
                if (chuvaPorHora > limiteChuvaPorHora) {
                    alertCount += 1
                    alerts.insertAdjacentHTML('beforeend', `
                    <a>${diasDaSemana[indice]}: Chuva intensa detectada!</a>
                 `)
                }
                if (chuvaDiaria > limiteChuvaDiaria) {
                    alertCount += 1
                    alerts.insertAdjacentHTML('beforeend', `
                    <a>${diasDaSemana[indice]}: Chuva diária extrema detectada!</a>
                 `)
                }
                if (neve > limiteNeve) {
                    alertCount += 1
                    alerts.insertAdjacentHTML('beforeend', `
                    <a>${diasDaSemana[indice]}: Neve pesada detectada!</a>
                 `)
                }
                if (raios > limiteRaios) {
                    alertCount += 1
                    alerts.insertAdjacentHTML('beforeend', `
                    <a>${diasDaSemana[indice]}: Atividade intensa de raios detectada!</a>
                 `)
                }
                if (granizo > limiteGranizo) {
                    alertCount += 1
                    alerts.insertAdjacentHTML('beforeend', `
                    <a>${diasDaSemana[indice]}: Pedras de granizo grandes detectada!</a>
                 `)

                }
                if (visibilidade < limiteVisibilidade) {
                    alertCount += 1
                    alerts.insertAdjacentHTML('beforeend', `
                    <a>${diasDaSemana[indice]}:Baixa visibilidade devido a nevoeiro ou outras condições atmosféricas!</a>
                 `)
                }
                quantidadeAlertas.innerHTML = alertCount
            });
        }).catch((error) => {
            console.log(error)
        });
    })
}
pesquisar.addEventListener("click", dadosCidade);
localizaoAtual.addEventListener("click", () => {
    pegarCoordenadasUsuario(true)
});
partilhar.addEventListener("click", partilharPrevisao)
pegarCoordenadasUsuario(false);
condicoesSeveras();

//setInterval(condicoesSeveras, 5000);