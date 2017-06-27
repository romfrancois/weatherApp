'use strict';

var Rx = require('rxjs');
var WeatherCity = require('./weatherApp');

class MonitorMap {
    constructor() {
        this.appContainer = document.getElementById('app-container');
        this.cityInput = document.getElementById('city-input');
        this.addLocationBtn = document.getElementById('add-location');

        this.googleMapsOption = document.getElementById('displayGGMap');
        this.convertionOption = document.getElementById('convertDegrees');
        this.useGooglePhotoSearch = document.getElementById('useGooglePhotoSearch');

        this.initStreams();
        this.weatherCity = new WeatherCity(this.appContainer);

        this.monitoredCities = [];
    }

    initStreams() {
        // Stream for the monitor button
        // Once clicked trigger the whole pipeline
        Rx.Observable
            .fromEvent(this.addLocationBtn, 'click')
            .mapTo(true)
            .do(() => {
                var cityId = this.weatherCity.addCity(this.potentialCity);
                this.weatherCity.populate(cityId);

                this.monitoredCities.push(cityId);

                this.monitorClosingBtn(cityId);

                this.cityInput.value = '';
                this.addLocationBtn.disabled = true;
            })
            .subscribe();

            // Options observables
            Rx.Observable
                .fromEvent(this.googleMapsOption, 'click')
                .do((cbEvent) => {
                    var maps = document.getElementById('map-canvas');

                    var checkedValue = cbEvent.srcElement.checked;

                    checkedValue ?
                        maps.style.display = 'block' :
                        maps.style.display = 'none';
                })
                .subscribe();

            Rx.Observable
                .fromEvent(this.convertionOption, 'click')
                .do((cbEvent) => {
                    var Helpers = require('./helpers');

                    var checkedValue = cbEvent.srcElement.checked;
                    var temperatures = document.getElementsByClassName('temperature');

                    if (checkedValue) {
                        [...temperatures].forEach(function(temperature) {
                            var currentTemperature = temperature.innerText.split('°')[0];
                            temperature.innerHTML =
                                Helpers.convertDegreesCelToFar(currentTemperature) +
                                '&deg;F';
                        });
                    } else {
                        [...temperatures].forEach(function(temperature) {
                            var currentTemperature = temperature.innerText.split('°')[0];
                            temperature.innerHTML =
                                Helpers.convertDegreesFarToCel(currentTemperature) +
                                '&deg;C';
                        });
                    }
                })
                .subscribe();

            Rx.Observable
                .fromEvent(this.useGooglePhotoSearch, 'click')
                .do((cbEvent) => {
                    var checkedValue = cbEvent.srcElement.checked;

                    checkedValue ?
                        this.weatherCity.setBackgroundImageTypeSearch(true) :
                        this.weatherCity.setBackgroundImageTypeSearch(false);
                })
                .subscribe();
    }

    setPotentialCity(potentialCity) {
        this.potentialCity = potentialCity;
    }

    monitorClosingBtn(cityId) {
        var currentCity = document.getElementById(`${cityId}-closeBtn`);

        Rx.Observable
            .fromEvent(currentCity, 'click')
            .do(() => this.weatherCity.removeCity(cityId))
            .subscribe();
    }
}

module.exports = MonitorMap;
