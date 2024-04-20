var API_CHAVE = "495de84d4964370a1a9c1a9991578169";
var cidade = document.querySelector(".city-input");
var pesquisar = document.querySelector(".search-btn");
var localizaoAtual = document.querySelector(".location-btn");
var tempoAtual = document.querySelector(".clima-atual");
var climaCards = document.querySelector(".clima-cards");

const diasDaSemana = ["Domingo","Segunda-Feira","Terça-Feira","Quarta-Feira","Quinta-Feira","Sexta-Feira","Sábado"];

function buscarDetalhesTempo(nomeCidade, latitude, longitude) {

    const CLIMA_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=pt&appid=${API_CHAVE}`;

    fetch(CLIMA_API_URL).then(response => response.json()).then(dados => {
        const atualProximosDias = [];
        const fiveDaysForecast = dados.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!atualProximosDias.includes(forecastDate)) {
                return atualProximosDias.push(forecastDate);
            }
        });
        cidade.value = "";
        tempoAtual.innerHTML = "";
        climaCards.innerHTML = "";

        fiveDaysForecast.forEach((item, index) => {
            const html = criarCardClima(nomeCidade, item, index);
            if (index === 0) {
                tempoAtual.insertAdjacentHTML("beforeend", html);
            } else {
                climaCards.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("Algum erro");
    });

}

function criarCardClima(cidade, item, index) {
    if (index == 0) {
        return `<div class="details">
                    <h2>${cidade}</h2>
                    <h6>Temperatura: ${(item.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Ventania:${(item.wind.speed)} m/s</h6>
                    <h6>Humidade:${(item.main.humidity)}%</h6>
                </div> 
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${(item.weather[0].icon)}@4x.png">
                    <h6>${item.weather[0].description}</h6>
                </div>`;

    } else {
        return `<div class="card">
                <h2>${cidade}</h2>
                <img src="https://openweathermap.org/img/wn/${(item.weather[0].icon)}@4x.png">
                <h6>${item.weather[0].description}</h6>
                <h6>Temperatura: ${(item.main.temp - 273.15).toFixed(2)}°C</h6>
                <h6>Ventania:${(item.wind.speed)} m/s</h6>
                <h6>Humidade:${(item.main.humidity)}%</h6>
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
        if (dados.length == 0) {
            alert('Nenhuma informação encontrada para essa cidade');
            return;
        }
        var { lat, lon, name } = dados[0];
        buscarDetalhesTempo(name, lat, lon);
        
    }).catch(() => {
        alert("Algum erro");
    });

}

pesquisar.addEventListener("click", dadosCidade);

