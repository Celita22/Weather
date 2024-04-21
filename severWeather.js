
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const lat = 'LATITUDE';
const lon = 'LONGITUDE';

const temperatureThreshold = 35; // 35 degrees Celsius
const windSpeedThreshold = 75; // 75 km/h
const rainfallThresholdHourly = 50; // 50 mm/h
const rainfallThresholdDaily = 100; // 100 mm/24h
const snowfallThreshold = 30; // 30 cm
const lightningThreshold = 10; // 10 strikes per minute
const hailSizeThreshold = 2; // 2 cm
const visibilityThreshold = 200; // 200 meters

// Function to fetch weather data from OpenWeather API
async function fetchWeather() {
    const url = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to check for severe weather conditions
async function checkSevereWeather() {
    const weatherData = await fetchWeather();
    if (!weatherData) {
        console.error('Failed to fetch weather data. Please check your API key and network connection.');
        return;
    }

    const temperature = weatherData.main.temp;
    const windSpeed = weatherData.wind.speed;
    const rainfallHourly = weatherData.rain ? weatherData.rain['1h'] || 0 : 0;
    const rainfallDaily = weatherData.rain ? weatherData.rain['3h'] || 0 : 0;
    const snowfall = weatherData.snow ? weatherData.snow['1h'] || 0 : 0;
    const lightning = weatherData.lightning ? weatherData.lightning['1h'] || 0 : 0;
    const hailSize = weatherData.hail ? weatherData.hail['1h'] || 0 : 0;
    const visibility = weatherData.visibility || 0;

    // Check for severe weather conditions
    if (temperature > temperatureThreshold) {
        console.log('Extreme heat detected!');
    }
    if (windSpeed > windSpeedThreshold) {
        console.log('High wind speed detected!');
    }
    if (rainfallHourly > rainfallThresholdHourly) {
        console.log('Heavy rainfall detected!');
    }
    if (rainfallDaily > rainfallThresholdDaily) {
        console.log('Extreme daily rainfall detected!');
    }
    if (snowfall > snowfallThreshold) {
        console.log('Heavy snowfall detected!');
    }
    if (lightning > lightningThreshold) {
        console.log('Intense lightning activity detected!');
    }
    if (hailSize > hailSizeThreshold) {
        console.log('Large hailstones detected!');
    }
    if (visibility < visibilityThreshold) {
        console.log('Low visibility due to fog or other atmospheric conditions!');
    }
}

// Call the function to check for severe weather conditions
checkSevereWeather();
