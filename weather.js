const API_CHAVE = "495de84d4964370a1a9c1a9991578169";
const cidade = document.querySelector(".city-input");
const pesquisar = document.querySelector(".search-btn");
const partilhar = document.querySelector(".share-btn");
const localizaoAtual = document.querySelector(".location-btn");
const tempoAtual = document.querySelector(".clima-atual");
const climaCards = document.querySelector(".clima-cards");

const diasDaSemana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
let _latitude, _longitude
function pegarCoordenadasUsuario(value) {

    navigator.geolocation.getCurrentPosition(localizacao => {
        var { latitude, longitude } = localizacao.coords;
        var url = new URL(window.location.href);
        var lat = url.searchParams.get('lat');
        var lon = url.searchParams.get('lon');
        if(lat !== null && lon !== null && value == false){
            latitude = lat;
            longitude = lon;
        }
        const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_CHAVE}`;
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
    _longitude = longitude
    const CLIMA_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=pt&appid=${API_CHAVE}`;
    fetch(CLIMA_API_URL).then(response => response.json()).then(dados => {
        const atualProximosDias = [];
        var days = [];
        const fiveDaysForecast = dados.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            var dia = new Date(forecast.dt_txt).getDay();
           if (!atualProximosDias.includes(forecastDate)) {
                days.push(diasDaSemana[dia]);
                return atualProximosDias.push(forecastDate);
            }
        });
        cidade.value = "";
        tempoAtual.innerHTML = "";
        climaCards.innerHTML = "";

        fiveDaysForecast.forEach((item, index) => {
            const html = criarCardClima(nomeCidade, item, index, days);
            if (index === 0) {
                tempoAtual.insertAdjacentHTML("beforeend", html);
            } else {
                climaCards.insertAdjacentHTML("beforeend", html);
            }
        });
        const novaURL = `https://celita22.github.io/Weather/?lat=${_latitude}&lon=${_longitude}`;
        window.history.pushState({ path: novaURL }, '/', novaURL);
    }).catch((error) => {
       console.log(error)
    });
}

function criarCardClima(cidade, item, index, dias) {
    if (index == 0) {
        return `<div class="details">
                    <h2>${cidade}</h2>
                    <h6>Temperatura: ${(item.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Ventania:${(item.wind.speed)} m/s</h6>
                    <h6>Humidade:${(item.main.humidity)}%</h6>
                    <h6>Hora:${(item.dt_txt.split(" ")[1])}</h6>
                </div> 
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${(item.weather[0].icon)}@4x.png">
                    <h6>${item.weather[0].description}</h6>
                </div>`;

    } else {
        return `<div class="card">
                <h2>${(dias[index])}</h2>
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
    var API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${nomeCidade}&limit=1&lang=pt&appid=${API_CHAVE}`;
    fetch(API_URL).then(response => response.json()).then(dados => {
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
function partilharPrevisao(){
    const linkCompartilhado = `https://celita22.github.io/Weather/?lat=${_latitude}&lon=${_longitude}`;
    Swal.fire({
        title: "<span style='color: white; font-weight: bold;'>Partilhar Previsão de Tempo</span>",
        html: "<span style='color: white; font-weight: bold;'>" + linkCompartilhado + "</span>",
        showDenyButton: true,
        confirmButtonText: "<span style='color: white; font-weight: bold;'>Copiar Link</span>",
        denyButtonText: "<span style='color: white; font-weight: bold;'>Voltar</span>",
        background: `url('https://i.gifer.com/fyDi.gif') no-repeat`, 
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

pesquisar.addEventListener("click", dadosCidade);
localizaoAtual.addEventListener("click", () => {
    pegarCoordenadasUsuario(true)
});
partilhar.addEventListener("click", partilharPrevisao)
pegarCoordenadasUsuario(false);

