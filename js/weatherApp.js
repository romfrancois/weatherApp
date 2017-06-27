'use strict';

var Rx = require('rxjs');
var Helpers = require('./helpers');

class WeatherCity {
    constructor(rootContainer) {
        this.rootContainer = rootContainer; // main 'div id' of the app
        this.cities = []; // we keep track of all cities added

        // Fetchable temperature stream
        this.getCityWeather = cityName =>
          fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&APPID=43694dc0d28f96df2da262494f2059a2`)
            .then(res => res.json());
    }

    /*
    Given a city name (provided by @google_maps through @MonitorMap.SearchBox.Listener)
    creates the template.
     */
    addCity(city) {
        this.cities.push({
            cityId: city.formatted_address,
            photos: city.photos
        });

        const currentCityBox = document.createElement('div');
        currentCityBox.classList.add('box');
        currentCityBox.id = city.formatted_address;

        const btnClosing = document.createElement('img');
        btnClosing.classList.add('closeBtn');
        btnClosing.id = `${city.formatted_address}-closeBtn`;
        btnClosing.src = './res/img/close.png';
        currentCityBox.appendChild(btnClosing);

        this.rootContainer.appendChild(currentCityBox);

        return city.formatted_address;
    }

    /*
    Given an id (returned by @addCity), populate the corresponding div with
    relevant weather info.
     */
    populate(cityId) {
        Rx.Observable
          .fromPromise(this.getCityWeather(cityId))
          .pluck('list')
          .map((weatherFor5Days) => Helpers.getFullCityWeatherPerDay(weatherFor5Days))
          .map((weatherFor5Days) => Helpers.getCityWeatherPerDay(weatherFor5Days))
          .map((weatherFor5Days) => ({ cityId, weatherFor5Days }))
          .forEach((fiveDaysWeather) => {
              var weatherFor5Days = fiveDaysWeather['weatherFor5Days'];

              this.addLegend(cityId);
              this.addForecast(cityId, weatherFor5Days);

              if (this.useGooglePhotoSearch) {
                  Helpers.setBackgroundImage(cityId);
              } else {
                  var currentPhotos = this.cities.filter(function(city) {
                  	if (city.cityId === cityId) {
                  		return city.photos;
                      }
                  });

                  if (currentPhotos.length > 0) {
                      var photos = currentPhotos[0].photos;
                      var randPhoto = photos[Math.floor(Math.random() * photos.length)];
                      var photoUrl = randPhoto.getUrl({ 'maxWidth': 620, 'maxHeight': 150 });

                      Helpers.setDefaultBackgroundImage(
                          cityId,
                          photoUrl
                      );
                  }
              }
          })
    }

    /*
    Given an id (returned by @addCity), add the name of the city to a div.
     */
    addLegend(cityId) {
        const currentCityEl = document.getElementById(cityId);

        const currentLegendEl = document.createElement('div');
        currentLegendEl.classList.add('legend');
        currentLegendEl.innerText = cityId;
        currentLegendEl.id = `${cityId}-legend`;

        currentCityEl.appendChild(currentLegendEl);
    }

    /*
    Given an id (returned by @addCity), add the weather forecast
    for the next 5 days (including current day).
     */
    addForecast(cityId, weatherFor5Days) {
        const currentForecast = document.createElement('div');
        currentForecast.classList.add('forecast');

        weatherFor5Days.forEach((currentDay, index) => {
            var cityTag = cityId + '_day' + index;
            this.addDay(currentDay, cityTag, currentForecast);
        })
    }

    addDay(currentDay, cityTag, anchor) {
        const cityId = cityTag.split('_')[0];
        const currentCityEl = document.getElementById(cityId);
        const temperature = currentDay['main']['temp'];
        const currentDate = currentDay['dt_txt'];

        const currentDayHTMLEl = document.createElement('div');
        currentDayHTMLEl.classList.add('day');
        currentDayHTMLEl.id = cityTag;

        this.addDayLetters(currentDate, currentDayHTMLEl);
        this.addDayTemperature(temperature, currentDayHTMLEl);

        anchor.appendChild(currentDayHTMLEl);
        currentCityEl.appendChild(anchor);

        Helpers.setWeatherIcon(currentDay['weather'][0]['icon'], cityTag);
        Helpers.setTooltip(currentDay, cityTag);
    }

    addDayLetters(currentDate, anchor) {
        const currentDateDayEl = document.createElement('p');
        currentDateDayEl.classList.add('dayLetters');
        currentDateDayEl.innerHTML = Helpers.dayOfWeekAsString(currentDate.slice(0, 10));

        anchor.appendChild(currentDateDayEl);
    }

    addDayTemperature(currentTemperature, anchor) {
        const tempEle = document.createElement('p');
        tempEle.classList.add('temperature');
        tempEle.innerHTML = Math.round(`${currentTemperature}`) + '&deg;C';

        anchor.appendChild(tempEle);
    }

    removeCity(cityId) {
        var cityNameIdx =
            this.cities.findIndex((currentCityName) =>
                currentCityName.cityId === cityId);
        this.cities.splice(cityNameIdx, 1);

        var elToBeRemoved = document.getElementById(cityId);
        elToBeRemoved.parentNode.removeChild(elToBeRemoved);
    }

    setBackgroundImageTypeSearch(useGooglePhotoSearch) {
        this.useGooglePhotoSearch = useGooglePhotoSearch;
    }
}

module.exports = WeatherCity;
