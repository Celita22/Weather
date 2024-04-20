var API_CHAVE = "495de84d4964370a1a9c1a9991578169";
var cidade = document.querySelector(".city-input");
var pesquisar = document.querySelector(".search-btn");
var localizaoAtual = document.querySelector(".location-btn");
var tempoAtual = document.querySelector(".clima-atual");
var climaCards = document.querySelector(".clima-cards");


function buscarDetalhesTempo(nomeCidade, latitude, longitude) {

    var CLIMA_API_URL = `api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_CHAVE}`


    fetch(CLIMA_API_URL).then(response => response.json()).then(dados => {
        var atualProximosDias = [];
        if (dados.length == 0) {
            alert('Nenhuma informação encontrada para essa cidade');
            return;

        }
        var proximosDiasClima = dados.list.filter(clima => {
            var dia = new Date(clima.dt_txt).getDate();
            if (atualProximosDias.includes(dia) == false) {
                return atualProximosDias.push(dia);
            }

        });

        cidade.value = "";
        tempoAtual.innerHTML = "";
        climaCards.innerHTML = "";
        proximosDiasClima.forEach((item, index) => {
            var card = criarCardClima(nomeCidade, item, index);
            if (index == 0) {
                tempoAtual.insertAdjacentHTML('beforeend', card);
            } else {
                climaCards.insertAdjacentHTML('beforeend', card);
            }
        });

    })

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

    var API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${nomeCidade}&limit=1&appid=${API_CHAVE}`;
    fetch(API_URL).then(response => response.json()).then(dados => {
        if (dados.length == 0) {
            alert('Nenhuma informação encontrada para essa cidade');
            return;
        }
        var { lat, lon, name } = dados[0];
        buscarDetalhesTempo(name, lat, lon);
        /*console.log(lat);
        console.log(lon);
        console.log(name);*/

    })


}

pesquisar.addEventListener("click", dadosCidade);

