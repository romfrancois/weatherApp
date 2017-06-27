// DATES
function extractDayFromDate(dateToParse) {
    var currentDay = dateToParse.slice(0, 10);
    return currentDay.slice(-2);
}

function extractTimeFromDate(dateToParse) {
    return dateToParse.slice(-8);
}

function dayOfWeekAsString(date) {
    var currentDate = new Date(date);
    return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
            [currentDate.getDay()];
}

// JSON parsing
function getFullCityWeatherPerDay(cityWeather) {
    var weatherPerDay = [];
    var currentDay = [];

    var firstWeatherDay = extractDayFromDate(cityWeather[0]['dt_txt']);
    currentDay.push(cityWeather[0]);

    for (var i = 1; i < cityWeather.length; i++) {
        var currentWeather = cityWeather[i];
        var currentWeatherDay = extractDayFromDate(currentWeather['dt_txt']);

        if (currentWeatherDay === firstWeatherDay) {
            currentDay.push(currentWeather);
        } else {
            weatherPerDay.push(currentDay);
            firstWeatherDay = currentWeatherDay;

            currentDay = [currentWeather];
        }
    }

    return weatherPerDay;
};

function getCityWeatherPerDay(weather) {
    var weatherPerDay = [];

    weather.forEach((currentWeather) => {
        var firstDataOfTheDAy = currentWeather[0];
        weatherPerDay.push(firstDataOfTheDAy);
    });

    return weatherPerDay;
}

// TEMPERATURES
function convertDegreesCelToFar(celcius) {
    return Math.round(celcius * 9 / 5 + 32);
}

function convertDegreesFarToCel(fahrenheit) {
    return Math.round((fahrenheit -32) * 5 / 9);
}

// IMAGES & ICONS
function setBackgroundImage(cityName) {
    getImage(cityName).then((image) => {
        var cityElement = document.getElementById(cityName);
        cityElement.style.backgroundImage = "url('" + image + "')";
        cityElement.style.backgroundSize = "100% 100%";
    });
}

function setDefaultBackgroundImage(cityName, photoUrl) {
    var dayElement = document.getElementById(cityName);
    dayElement.style.backgroundImage = "url('" + photoUrl + "')";
    dayElement.style.backgroundSize = "100% 100%";
}

function getImage(cityName) {
    var imageSearch = require('./google_images');

    const APP_KEY = 'AIzaSyDbDsdgFmgNql8GjNCYiYSjbJ0jj14rJpU';
    const CX = '000874965932233629634:wmefk6q2u1c';

    const client = new imageSearch(CX, APP_KEY);

    var options = { page: 1 };

    return client.search(cityName, options)
        .then(images => {
            var randImage = images[Math.floor(Math.random() * images.length)];
            return randImage['url'];
        })
        .catch(error => console.log(error));
}

function setWeatherIcon(iconCode, target) {
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

    var dayElement = document.getElementById(target);
    dayElement.style.backgroundImage = "url('" + iconUrl + "')";
    dayElement.style.backgroundSize = "100% 100%";
}

// TOOLTIP
function setTooltip(data, target) {
    var tippy = require('./tippy.min');

    var currentWeatherDescription = data['weather'][0]['description'];
    var currentWindSpeed = data['wind']['speed'];

    var tooltipTemplate =
        `<div id="tooltip-${target}" style="display: none;">
            <p>Expected weather</p>
            <p>${currentWeatherDescription}</p>
            <p>
                <img
                    class="wind-speed"
                    alt="wind-speed ${currentWindSpeed}"
                    height="32"
                    src="./res/img/wind.png"
                >
                ${currentWindSpeed} meter/sec
            </p>
        </div>`;

    var d1 = document.getElementById(target);
    d1.insertAdjacentHTML('beforeend', tooltipTemplate);

    tippy(
        d1,
        {
            html: `#tooltip-${target}`,
            arrow: true,
            animation: 'fade',
            size: 'small'
        }
    );
}

module.exports = {
    extractDayFromDate,
    extractTimeFromDate,
    dayOfWeekAsString,

    getFullCityWeatherPerDay,
    getCityWeatherPerDay,

    convertDegreesCelToFar,
    convertDegreesFarToCel,

    setBackgroundImage,
    setDefaultBackgroundImage,
    getImage,
    setWeatherIcon,

    setTooltip
};
